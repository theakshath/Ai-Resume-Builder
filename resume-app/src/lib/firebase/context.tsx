"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, onIdTokenChanged } from "firebase/auth";
import { getFirebaseServices } from "./config";
import { getUserProfileDoc, UserProfileData } from "./firestore";
import { syncServerSession } from "./session-sync";

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebaseServices();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profileDoc = await getUserProfileDoc(firebaseUser.uid);
          setProfile(profileDoc);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Keep the verified HttpOnly server session in sync with Firebase's
    // hourly ID-token rotation (also fires on sign-in and sign-out).
    let hadUser = false;
    const unsubscribeToken = onIdTokenChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        hadUser = true;
        void syncServerSession(firebaseUser);
      } else if (hadUser) {
        hadUser = false;
        void syncServerSession(null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
