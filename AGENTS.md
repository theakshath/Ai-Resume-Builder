## Vibe Coded App Security Checklist
Whenever building backend systems, APIs, or full-stack web applications in this project, you MUST enforce these 15 rules:

**Secrets & Credentials**
1. Secure your API keys.
2. Hide all .env files.
3. Never hardcode secrets.

**Authentication & Authorization**
4. Add authentication.
5. Verify permissions server-side.
6. Don't trust frontend user IDs.
7. Isolate user data.
8. Lock down your database.
9. Secure Supabase and storage.
10. Protect admin routes.

**Inputs & Security**
11. Disable production debug mode.
12. Hide detailed errors.
13. Validate inputs server-side.
14. Sanitize user content.
15. Secure file uploads.
