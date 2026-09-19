import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

export function validateFirebaseConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || apiKey === "your_api_key" || apiKey.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!authDomain || authDomain.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!projectId || projectId.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!storageBucket || storageBucket.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  if (!messagingSenderId || messagingSenderId.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  if (!appId || appId.includes("placeholder")) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  if (missing.length > 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Firebase configuration incomplete:");
      missing.forEach((key) => console.warn(`  - ${key} missing`));
    }
    return { valid: false, missing };
  }

  return { valid: true, missing: [] };
}

export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  return (
    !!apiKey &&
    apiKey !== "your_api_key" &&
    !apiKey.includes("placeholder") &&
    !!authDomain &&
    !authDomain.includes("placeholder")
  );
}

export function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };
}

const firebaseConfig = getFirebaseConfig();

// Safe Singleton Initialization
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

try {
  if (isFirebaseConfigured()) {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const app: FirebaseApp | null = appInstance;
export const auth: Auth | null = authInstance;
export const db: Firestore | null = dbInstance;
export const storage: FirebaseStorage | null = storageInstance;

export function getFirebaseServices() {
  return { app, auth, db, storage };
}

export default app;
