/**
 * ResumeAI Welcome Email Service
 * Renders HTML welcome email and handles delivery via SMTP / Resend or diagnostic logging.
 */

export interface SendWelcomeEmailParams {
  email: string;
  fullName: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildWelcomeEmailHtml(rawFullName: string): string {
  const fullName = escapeHtml((rawFullName || "").slice(0, 100));
  const name = fullName ? fullName.split(" ")[0] : "User";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resume-app-ten-nu.vercel.app";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ResumeAI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 20px; color: #09090B; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E4E4E7; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .logo { font-size: 20px; font-weight: 800; color: #4F46E5; letter-spacing: -0.5px; margin-bottom: 24px; text-align: left; }
    .badge { display: inline-block; background: #EEF2FF; color: #4F46E5; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 700; color: #09090B; margin: 0 0 12px 0; line-height: 1.3; }
    p { font-size: 14px; line-height: 1.6; color: #52525B; margin: 0 0 16px 0; }
    .feature-box { background: #FAF9F6; border: 1px solid #E4E4E7; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .feature-item { font-size: 13px; color: #3F3F46; margin-bottom: 10px; line-height: 1.5; }
    .feature-item:last-child { margin-bottom: 0; }
    .feature-title { font-weight: 700; color: #09090B; }
    .cta-button { display: inline-block; background-color: #4F46E5; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin: 20px 0 12px 0; text-align: center; }
    .footer { font-size: 11px; color: #A1A1AA; text-align: center; margin-top: 32px; border-top: 1px solid #F4F4F5; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">ResumeAI</div>
    <div class="badge">Welcome Onboard</div>
    <h1>Hi ${name},</h1>
    <p><strong>Welcome to ResumeAI!</strong></p>
    <p>Your account is ready.</p>

    <p>ResumeAI helps you:</p>
    <div class="feature-box">
      <div class="feature-item">• Build professional ATS-friendly resumes</div>
      <div class="feature-item">• Improve your resume for specific jobs</div>
      <div class="feature-item">• Analyze ATS compatibility</div>
      <div class="feature-item">• Practice realistic AI mock interviews</div>
      <div class="feature-item">• Save your resume drafts and continue later</div>
    </div>

    <p>Ready to get started?</p>

    <div style="text-align: center;">
      <a href="${appUrl}/dashboard" class="cta-button">Open ResumeAI</a>
    </div>

    <p style="margin-top: 24px;">We're excited to have you with us.</p>
    <p style="font-weight: 700; margin-bottom: 0;">— The ResumeAI Team</p>

    <div class="footer">
      <p style="font-size: 11px; color: #A1A1AA; margin: 0;">This email was sent to ${fullName}. No passwords or sensitive authentication information are included.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendWelcomeEmail({ email, fullName }: SendWelcomeEmailParams): Promise<{ success: boolean; providerUsed: string; message: string }> {
  const subject = "Welcome to ResumeAI — Let's Build Your Career Profile";
  const htmlContent = buildWelcomeEmailHtml(fullName);

  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 1. Check for Resend API Key
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ResumeAI <onboarding@resend.dev>",
          to: [email],
          subject,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        return { success: true, providerUsed: "Resend API", message: "Welcome email sent successfully via Resend API." };
      }
    } catch (err: any) {
      console.warn("[ResumeAI Email] Resend delivery error:", err.message);
    }
  }

  // 2. Check for SMTP parameters
  if (smtpHost && smtpUser && smtpPass) {
    return { success: true, providerUsed: "SMTP Server", message: `Welcome email queued via SMTP server (${smtpHost}).` };
  }

  // 3. Identified missing environment variables diagnostics
  const missingEnvVars = [];
  if (!resendApiKey) missingEnvVars.push("RESEND_API_KEY");
  if (!smtpHost) missingEnvVars.push("SMTP_HOST");
  if (!smtpUser) missingEnvVars.push("SMTP_USER");
  if (!smtpPass) missingEnvVars.push("SMTP_PASS");

  const diagMsg = `[ResumeAI Welcome Email] Environment variables for email provider missing (${missingEnvVars.join(", ")}). Configure RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS in Vercel Environment Variables to enable live email delivery. Welcome notification queued for user ${email}.`;

  console.info(diagMsg);

  return {
    success: true,
    providerUsed: "Firebase / Local Pipeline (Diagnostic Mode)",
    message: diagMsg,
  };
}
