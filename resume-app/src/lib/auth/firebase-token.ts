import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

/**
 * Server-side verification of Firebase Auth ID tokens.
 *
 * Firebase ID tokens are RS256 JWTs signed by Google. We verify the signature
 * against Google's published JWKS, plus issuer / audience / expiry, exactly as
 * documented in "Verify ID tokens using a third-party JWT library":
 * https://firebase.google.com/docs/auth/admin/verify-id-tokens
 *
 * This avoids needing a Firebase Admin service-account credential.
 */

/** Name of the HttpOnly cookie that carries the verified Firebase ID token. */
export const SESSION_COOKIE_NAME = '__session';

const FIREBASE_JWKS_URL = new URL(
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
);

// Cached across invocations within the same server instance.
const jwks = createRemoteJWKSet(FIREBASE_JWKS_URL);

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string;
  /** Token expiry, seconds since epoch. */
  exp: number;
}

function getProjectId(): string | null {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  return projectId && projectId.trim().length > 0 ? projectId.trim() : null;
}

/**
 * Verifies a Firebase ID token. Returns null for ANY failure (bad signature,
 * expired, wrong project, malformed) so callers can't leak why it failed.
 */
export async function verifyFirebaseIdToken(token: string | undefined | null): Promise<VerifiedFirebaseUser | null> {
  if (!token || typeof token !== 'string' || token.length > 4096) {
    return null;
  }

  const projectId = getProjectId();
  if (!projectId) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ['RS256'],
    });

    return toVerifiedUser(payload);
  } catch {
    return null;
  }
}

function toVerifiedUser(payload: JWTPayload): VerifiedFirebaseUser | null {
  const uid = payload.sub;
  // Firebase requires a non-empty `sub` of at most 128 chars.
  if (!uid || typeof uid !== 'string' || uid.length > 128) {
    return null;
  }

  const authTime = payload.auth_time;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (typeof authTime !== 'number' || authTime > nowSeconds + 60) {
    return null;
  }

  return {
    uid,
    email: typeof payload.email === 'string' ? payload.email : '',
    emailVerified: payload.email_verified === true,
    name: typeof payload.name === 'string' ? payload.name : '',
    picture: typeof payload.picture === 'string' ? payload.picture : '',
    exp: typeof payload.exp === 'number' ? payload.exp : nowSeconds,
  };
}
