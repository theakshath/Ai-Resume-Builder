import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/welcome-email";
import { handleApiError, ApiError } from "@/lib/errors/api-error";
import { requireUser } from "@/lib/auth/get-session";
import { checkRateLimit } from "@/lib/security/rate-limiter";

/**
 * POST /api/auth/welcome-email
 *
 * SECURITY: previously unauthenticated and accepted any recipient address,
 * which allowed anyone to use the app's email provider to spam arbitrary
 * inboxes with attacker-controlled names in the HTML body.
 *
 * Now: requires a verified session, sends ONLY to the signed-in user's own
 * email address, and is rate-limited per user.
 */
export async function POST(_request: NextRequest) {
  try {
    const { user } = await requireUser();
    checkRateLimit(user.id, "email");

    const email = user.email;
    if (!email) {
      throw ApiError.badRequest("No email address is associated with this account");
    }

    const fullName =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      email.split("@")[0];

    const result = await sendWelcomeEmail({ email, fullName });

    // Don't echo provider diagnostics (env var names, hosts) back to the client.
    return NextResponse.json({
      success: true,
      data: { sent: result.success },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
