import { isFirebaseConfigured, getFirebaseServices } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  type User,
} from "firebase/auth";
import { createUserProfileDoc, getUserProfileDoc, UserProfileData } from "./firestore";
import { sendWelcomeEmail } from "../email/welcome-email";
import { syncServerSession } from "./session-sync";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider?: string;
}

/**
 * Centralized Firebase Auth Error Code Mapper
 * Converts raw Firebase Auth error codes into friendly, clear user messages.
 */
export function getFirebaseAuthError(error: any): string {
  if (!error) return "An unknown error occurred. Please try again.";
  if (typeof error === "string") return error;

  const code = error.code || "";
  const message = error.message || "";

  if (
    process.env.NODE_ENV === "development" &&
    !["auth/email-already-in-use", "auth/invalid-email", "auth/weak-password", "auth/wrong-password", "auth/user-not-found", "auth/popup-closed-by-user"].includes(code)
  ) {
    console.error("[ResumeAI Auth Technical Error]", code, message);
  } else if (process.env.NODE_ENV === "development") {
    console.log("[ResumeAI Auth Validation Event]", code, message);
  }

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Please allow popups for ResumeAI and try again.";
    case "auth/cancelled-popup-request":
      return "A Google sign-in request is already in progress. Please finish the current popup before trying again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Please sign in using the original sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Firebase Authentication. Add it in Firebase Console -> Authentication -> Settings -> Authorized domains.";
    case "auth/operation-not-allowed":
      return "Email/password authentication is not enabled. Please enable it in Firebase Console.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/auth-domain-config-required":
      return "Firebase Auth Domain is missing. Please add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=resumeai-f02eb.firebaseapp.com to Vercel Environment Variables.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
      return "Firebase configuration is invalid. Check the Firebase Web API key in Vercel Environment Variables.";
    case "auth/invalid-credential":
      return "Google authentication credentials are invalid.";
    case "auth/configuration-not-found":
      return "Firebase Authentication configuration was not found. Check your Firebase project configuration in Firebase Console.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Your password is too weak. Please choose a stronger password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Access temporarily disabled due to many failed attempts. Please reset your password or try again later.";
    default:
      return message || "Unable to sign in with Google. Please try again.";
  }
}

/**
 * Register user with Email & Password.
 * Creates Firebase Auth account + Firestore user profile document.
 * NO PASSWORDS ARE EVER WRITTEN TO FIRESTORE.
 */
export async function registerUser(email: string, password: string, fullName: string): Promise<UserSession> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();

  const { auth } = getFirebaseServices();

  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase Authentication is not configured. Please check your environment variables in Vercel.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName: cleanName });
      try {
        await sendEmailVerification(user);
      } catch {}

      await createUserProfileDoc({
        uid: user.uid,
        email: cleanEmail,
        fullName: cleanName,
        provider: "firebase_email",
        emailVerified: user.emailVerified,
      });

      // Trigger Welcome Email pipeline
      sendWelcomeEmail({ email: cleanEmail, fullName: cleanName }).catch((err) => {
        console.warn("[ResumeAI Auth] Welcome email trigger background error:", err?.message);
      });
    }

    const session: UserSession = {
      id: user.uid,
      email: user.email || cleanEmail,
      fullName: user.displayName || cleanName,
      provider: "firebase_email",
    };
    await saveActiveSession(session, user);
    return session;
  } catch (err: any) {
    throw new Error(getFirebaseAuthError(err));
  }
}

/**
 * Login user with Email & Password via Firebase Auth.
 */
export async function loginUser(email: string, password: string): Promise<UserSession> {
  const cleanEmail = email.trim().toLowerCase();
  const { auth } = getFirebaseServices();

  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase Authentication is not configured. Please check your environment variables in Vercel.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    let profileDoc = await getUserProfileDoc(user.uid);
    if (!profileDoc) {
      profileDoc = {
        uid: user.uid,
        email: user.email || cleanEmail,
        fullName: user.displayName || cleanEmail.split("@")[0],
        provider: "firebase_email",
      };
      await createUserProfileDoc(profileDoc);
    }

    const session: UserSession = {
      id: user.uid,
      email: user.email || cleanEmail,
      fullName: profileDoc.fullName || user.displayName || cleanEmail.split("@")[0],
      avatarUrl: user.photoURL || undefined,
      provider: "firebase_email",
    };
    await saveActiveSession(session, user);
    return session;
  } catch (err: any) {
    throw new Error(getFirebaseAuthError(err));
  }
}

let googleSignInInProgress = false;

/**
 * Sign in with Google (Firebase Popup) with a single-flight guard.
 * Opens Google account chooser via prompt: "select_account".
 * Creates/preserves Firestore user profile using the authenticated Firebase User.
 */
export async function loginWithGoogle(): Promise<UserSession> {
  if (googleSignInInProgress) {
    throw new Error("A Google sign-in request is already in progress. Please finish the current popup before trying again.");
  }

  const { auth } = getFirebaseServices();

  if (!auth || !isFirebaseConfigured()) {
    throw new Error("Firebase Authentication is not configured. Please check your environment variables in Vercel.");
  }

  googleSignInInProgress = true;
  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    let existingProfile = await getUserProfileDoc(user.uid);
    const fullName = existingProfile?.fullName || user.displayName || user.email?.split("@")[0] || "Google User";
    const avatarUrl = user.photoURL || existingProfile?.profileImageUrl;

    if (!existingProfile) {
      await createUserProfileDoc({
        uid: user.uid,
        email: user.email || "",
        fullName,
        profileImageUrl: avatarUrl || "",
        provider: "google",
        emailVerified: user.emailVerified,
      });
    }

    const session: UserSession = {
      id: user.uid,
      email: user.email || "",
      fullName,
      avatarUrl,
      provider: "google",
    };
    await saveActiveSession(session, user);
    return session;
  } catch (err: any) {
    throw new Error(getFirebaseAuthError(err));
  } finally {
    googleSignInInProgress = false;
  }
}

/**
 * Sends a passwordless sign-in link to the user's email via Firebase Auth.
 */
export async function sendLoginLink(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const { auth } = getFirebaseServices();

  if (auth && isFirebaseConfigured()) {
    try {
      const actionCodeSettings = {
        url: `${typeof window !== "undefined" ? window.location.origin : "https://resume-app-ten-nu.vercel.app"}/login`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("emailForSignIn", cleanEmail);
      }
    } catch (err: any) {
      throw new Error(getFirebaseAuthError(err));
    }
  }
}

/**
 * Sends a password reset email via Firebase Auth.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const { auth } = getFirebaseServices();

  if (auth && isFirebaseConfigured()) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return;
    } catch (err: any) {
      throw new Error(getFirebaseAuthError(err));
    }
  }
}

/**
 * Sends an email verification link to the currently signed-in user.
 */
export async function sendVerificationEmail(): Promise<void> {
  const { auth } = getFirebaseServices();
  if (auth?.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      throw new Error(getFirebaseAuthError(err));
    }
  }
}

/**
 * Logout current Firebase Auth session.
 */
export async function logoutUser(): Promise<void> {
  const { auth } = getFirebaseServices();
  if (auth) {
    try {
      await signOut(auth);
    } catch {}
  }
  await syncServerSession(null);
  // Clean up legacy client-written cookies from older app versions.
  document.cookie = "mock-user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = "active_user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  localStorage.removeItem("active_user_session");
}

/**
 * Stores NON-AUTHORITATIVE display data (name/avatar) for the UI and
 * establishes the verified server session. The server never trusts the
 * localStorage value; it only trusts the verified Firebase ID token cookie.
 */
async function saveActiveSession(session: UserSession, user: User): Promise<void> {
  localStorage.setItem("active_user_session", JSON.stringify(session));
  const ok = await syncServerSession(user);
  if (!ok) {
    throw new Error("Unable to establish a secure session. Please try again.");
  }
}
