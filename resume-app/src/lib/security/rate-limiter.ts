import { ApiError } from '@/lib/errors/api-error';

export type RateLimitCategory =
  | 'login'
  | 'session'
  | 'auth_lookup'
  | 'email'
  | 'ai'
  | 'ats'
  | 'interviews'
  | 'uploads'
  | 'billing';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const CATEGORY_CONFIGS: Record<RateLimitCategory, RateLimitConfig> = {
  login: { windowMs: 60 * 1000, maxRequests: 5 },
  session: { windowMs: 60 * 1000, maxRequests: 10 },
  auth_lookup: { windowMs: 60 * 1000, maxRequests: 5 },
  email: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  ai: { windowMs: 60 * 1000, maxRequests: 10 },
  ats: { windowMs: 60 * 1000, maxRequests: 10 },
  interviews: { windowMs: 60 * 1000, maxRequests: 10 },
  uploads: { windowMs: 60 * 1000, maxRequests: 5 },
  billing: { windowMs: 60 * 1000, maxRequests: 10 },
};

/**
 * NOTE: This store is per server instance. On serverless platforms (Vercel)
 * each instance has its own memory, so this is best-effort only. For strict
 * enforcement, back this with a shared store (e.g. Upstash Redis / Vercel KV).
 */
const requestStore = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 10_000;

export function checkRateLimit(userId: string, category: RateLimitCategory = 'ai'): void {
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.ai;
  const key = `${category}:${userId}`;
  const now = Date.now();

  const timestamps = requestStore.get(key) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < config.windowMs);

  if (validTimestamps.length >= config.maxRequests) {
    throw ApiError.tooManyRequests('Too many requests. Please try again later.');
  }

  validTimestamps.push(now);
  if (!requestStore.has(key) && requestStore.size >= MAX_TRACKED_KEYS) {
    // Evict the oldest-inserted key to keep memory bounded.
    const oldestKey = requestStore.keys().next().value;
    if (oldestKey !== undefined) requestStore.delete(oldestKey);
  }
  requestStore.set(key, validTimestamps);
}

/**
 * Best-effort client IP extraction for rate limiting unauthenticated endpoints.
 * On Vercel, `x-forwarded-for` is set by the platform edge.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim().slice(0, 64);
  return 'unknown';
}

export function checkIpRateLimit(request: Request, category: RateLimitCategory): void {
  checkRateLimit(`ip:${getClientIp(request)}`, category);
}
