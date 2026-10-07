import { createClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/errors/api-error';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isMockSupabase } from '@/lib/env';
import { SESSION_COOKIE_NAME, verifyFirebaseIdToken } from '@/lib/auth/firebase-token';

function buildUser(id: string, email: string, fullName: string, avatarUrl: string): User {
  return {
    id,
    email,
    user_metadata: {
      full_name: fullName,
      avatar_url: avatarUrl,
    },
    created_at: new Date().toISOString(),
    app_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
  } as unknown as User;
}

/**
 * Returns the currently authenticated user or session.
 *
 * Identity sources (in order):
 *  1. `__session` HttpOnly cookie holding a Firebase ID token, verified
 *     cryptographically on every request (see lib/auth/firebase-token.ts).
 *  2. A Supabase Auth session, if Supabase is configured.
 *
 * SECURITY: client-written cookies such as `active_user_session` / `mock-user`
 * are NOT trusted outside of the automated test environment, because any
 * browser can set them to an arbitrary user id.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();

    // 1. Verified Firebase ID token
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionToken) {
      const verified = await verifyFirebaseIdToken(sessionToken);
      if (verified) {
        const fullName = verified.name || (verified.email ? verified.email.split('@')[0] : 'User');
        return buildUser(verified.uid, verified.email, fullName, verified.picture);
      }
    }

    // Test-only mock session (never honoured in development or production).
    if (process.env.NODE_ENV === 'test') {
      const mockCookie = cookieStore.get('mock-user')?.value;
      if (mockCookie) {
        try {
          const parsed = JSON.parse(decodeURIComponent(mockCookie));
          const userId = parsed?.id || parsed?.uid;
          if (typeof userId === 'string' && userId.length > 0 && userId.length <= 128) {
            const email = typeof parsed.email === 'string' ? parsed.email : '';
            return buildUser(userId, email, parsed.fullName || email.split('@')[0] || 'User', '');
          }
        } catch {
          // ignore malformed test cookie
        }
      }
    }

    // 2. Try Supabase Auth if configured
    if (!isMockSupabase()) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (user && !error) {
          return user;
        }
      } catch {
        // Ignore Supabase fetch errors
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the currently authenticated user ID or null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user ? user.id : null;
}

/**
 * Requires an authenticated user session. Throws 401 ApiError if unauthenticated.
 */
export async function requireUser(): Promise<{ user: User; supabase: Awaited<ReturnType<typeof createClient>> }> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (!user) {
    throw ApiError.unauthorized('Authentication session invalid or expired');
  }

  return { user, supabase };
}

/**
 * Requires an authenticated user ID. Throws 401 ApiError if unauthenticated.
 */
export async function requireUserId(): Promise<string> {
  const { user } = await requireUser();
  return user.id;
}

// Alias for backwards compatibility
export const requireAuth = requireUser;
