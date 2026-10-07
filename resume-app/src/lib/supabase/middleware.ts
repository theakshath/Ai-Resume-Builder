import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifyFirebaseIdToken } from '@/lib/auth/firebase-token';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-id.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoyMDE1MDI1MjAwfQ.mock-anon-key-placeholder';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Verified Firebase session (HttpOnly cookie set by /api/auth/session).
    // Legacy `mock-user` / `active_user_session` cookies are client-forgeable and are NOT trusted.
    const firebaseUser = await verifyFirebaseIdToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {}

    const hasActiveSession = !!firebaseUser || !!user;

    // Protected route check for /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard') && !hasActiveSession && process.env.NODE_ENV === 'production') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // Graceful fallback for local dev / preview when Supabase live auth is not attached
  }

  return supabaseResponse;
}
