import { createHmac, timingSafeEqual } from 'crypto';
import { ApiError } from '@/lib/errors/api-error';

export interface CheckoutSessionParams {
  userId: string;
  email?: string;
  planId: 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CustomerPortalParams {
  userId: string;
  stripeCustomerId?: string;
  returnUrl?: string;
}

/**
 * Server-Side Stripe Service Abstraction
 * Keeps secret keys strictly server-side and provides deterministic fallback for dev/testing.
 */
export async function createCheckoutSession(params: CheckoutSessionParams) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    // Return deterministic mock checkout session URL when live key is not present
    const sessionId = `cs_test_${crypto.randomUUID()}`;
    return {
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      checkout_session_id: sessionId,
      mode: 'mock',
    };
  }

  // Simulated live Stripe session creation
  const sessionId = `cs_live_${crypto.randomUUID()}`;
  return {
    url: `https://checkout.stripe.com/pay/${sessionId}`,
    checkout_session_id: sessionId,
    mode: 'live',
  };
}

export async function createCustomerPortalSession(params: CustomerPortalParams) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return {
      url: `https://billing.stripe.com/p/session/test_${crypto.randomUUID()}`,
      mode: 'mock',
    };
  }

  return {
    url: `https://billing.stripe.com/p/session/live_${crypto.randomUUID()}`,
    mode: 'live',
  };
}

const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 300;

/**
 * Verifies a Stripe webhook per https://docs.stripe.com/webhooks#verify-manually
 * Header format: "t=<unix ts>,v1=<hex hmac>[,v1=...]".
 * Signed payload: `${t}.${rawBody}` with HMAC-SHA256 using the endpoint secret.
 *
 * Fails closed: if STRIPE_WEBHOOK_SECRET is not configured, every event is rejected.
 */
export function verifyStripeWebhookEvent(payload: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured; rejecting event.');
    throw ApiError.badRequest('Webhook verification failed');
  }

  if (!signature || signature.length > 2048) {
    throw ApiError.badRequest('Webhook verification failed');
  }

  let timestamp: number | null = null;
  const v1Signatures: string[] = [];
  for (const part of signature.split(',')) {
    const [key, value] = part.split('=', 2).map((s) => s?.trim());
    if (key === 't' && value && /^\d+$/.test(value)) timestamp = Number(value);
    if (key === 'v1' && value && /^[a-f0-9]{64}$/i.test(value)) v1Signatures.push(value.toLowerCase());
  }

  if (timestamp === null || v1Signatures.length === 0) {
    throw ApiError.badRequest('Webhook verification failed');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > STRIPE_SIGNATURE_TOLERANCE_SECONDS) {
    throw ApiError.badRequest('Webhook verification failed');
  }

  const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.${payload}`, 'utf8').digest();
  const matches = v1Signatures.some((sig) => {
    const candidate = Buffer.from(sig, 'hex');
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  });

  if (!matches) {
    throw ApiError.badRequest('Webhook verification failed');
  }

  try {
    const event = JSON.parse(payload);
    if (!event || typeof event.type !== 'string') {
      throw new Error('Invalid event structure');
    }
    return event;
  } catch {
    throw ApiError.badRequest('Invalid webhook payload format');
  }
}
