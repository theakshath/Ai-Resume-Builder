"use client";

import type { User } from "firebase/auth";

/**
 * Keeps the server-side HttpOnly session cookie in sync with Firebase Auth.
 *
 * - On sign-in / token refresh: sends the current Firebase ID token to
 *   POST /api/auth/session, where it is cryptographically verified before the
 *   cookie is set.
 * - On sign-out: DELETE /api/auth/session clears the cookie.
 *
 * The browser never writes auth cookies itself any more.
 */
export async function syncServerSession(user: User | null, forceRefresh = false): Promise<boolean> {
  try {
    if (!user) {
      await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin" });
      return false;
    }

    const idToken = await user.getIdToken(forceRefresh);
    const res = await fetch("/api/auth/session", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
