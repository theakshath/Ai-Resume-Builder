import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { isMockEnvironment } from '@/lib/env';
import { cookies } from 'next/headers';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { checkIpRateLimit } from '@/lib/security/rate-limiter';

const existsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
});

/**
 * POST /api/auth/exists
 *
 * NOTE: An "does this email have an account?" endpoint inherently allows
 * account enumeration. It is strictly rate-limited per IP and returns only
 * generic errors. Consider removing it and relying on Firebase's own
 * sign-in error flow if the UX allows.
 */
export async function POST(request: NextRequest) {
  try {
    checkIpRateLimit(request, 'auth_lookup');

    const body = await request.json().catch(() => null);
    const parsed = existsSchema.safeParse(body);
    if (!parsed.success) {
      throw ApiError.badRequest('A valid email address is required');
    }
    const normalizedEmail = parsed.data.email;

    // Check mock mode fallback
    if (isMockEnvironment()) {
      const cookieStore = await cookies();
      const mockRegisteredCookie = cookieStore.get('mock-registered-emails');
      let exists = false;
      if (mockRegisteredCookie?.value) {
        try {
          const list = JSON.parse(mockRegisteredCookie.value);
          exists = Array.isArray(list) && list.includes(normalizedEmail);
        } catch {}
      }
      return NextResponse.json({ success: true, exists });
    }

    // Production mode - query Supabase profiles
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error('[AUTH_CHECK] Lookup failed');
      throw ApiError.internal('Unable to process request');
    }

    return NextResponse.json({
      success: true,
      exists: !!data,
    });
  } catch (err) {
    // handleApiError never exposes raw exception messages to the client.
    return handleApiError(err);
  }
}
