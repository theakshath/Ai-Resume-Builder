import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { checkIpRateLimit } from '@/lib/security/rate-limiter';
import { SESSION_COOKIE_NAME, verifyFirebaseIdToken } from '@/lib/auth/firebase-token';

const sessionSchema = z.object({
  idToken: z.string().min(100).max(4096),
});

function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/**
 * POST /api/auth/session
 * Exchanges a Firebase ID token (obtained client-side after sign-in) for an
 * HttpOnly session cookie. The token is cryptographically verified first.
 */
export async function POST(request: NextRequest) {
  try {
    checkIpRateLimit(request, 'session');

    const body = await request.json().catch(() => null);
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) {
      throw ApiError.unauthorized('Authentication failed');
    }

    const verified = await verifyFirebaseIdToken(parsed.data.idToken);
    if (!verified) {
      // Generic message: never reveal why verification failed.
      throw ApiError.unauthorized('Authentication failed');
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const maxAge = Math.max(0, Math.min(verified.exp - nowSeconds, 60 * 60));

    const response = NextResponse.json({ success: true, data: { authenticated: true } });
    response.cookies.set(SESSION_COOKIE_NAME, parsed.data.idToken, sessionCookieOptions(maxAge));
    // Remove legacy, client-forgeable cookies from older app versions.
    response.cookies.delete('mock-user');
    response.cookies.delete('active_user_session');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/auth/session
 * Clears the server session cookie (logout).
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { authenticated: false } });
  response.cookies.set(SESSION_COOKIE_NAME, '', sessionCookieOptions(0));
  response.cookies.delete('mock-user');
  response.cookies.delete('active_user_session');
  return response;
}
