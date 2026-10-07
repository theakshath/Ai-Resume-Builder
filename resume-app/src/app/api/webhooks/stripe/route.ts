import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyStripeWebhookEvent } from '@/lib/billing/stripe';

// Stripe IDs are opaque alphanumeric strings with a known prefix.
const CUSTOMER_ID_RE = /^cus_[A-Za-z0-9]{1,255}$/;
const SUBSCRIPTION_ID_RE = /^sub_[A-Za-z0-9]{1,255}$/;
const USER_ID_RE = /^[A-Za-z0-9_-]{1,128}$/;
const ALLOWED_PLANS = new Set(['pro', 'enterprise']);

function asId(value: unknown, pattern: RegExp): string | null {
  return typeof value === 'string' && pattern.test(value) ? value : null;
}

/**
 * POST /api/webhooks/stripe
 * Verified Stripe Webhook Event Handler.
 * The payment provider webhook is the SINGLE SOURCE OF TRUTH for subscription status.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Verify webhook event signature (throws on any failure — fails closed)
    const event = verifyStripeWebhookEvent(rawBody, signature);
    const supabase = await createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created': {
        const session = event.data?.object || {};
        const userId = asId(session.client_reference_id ?? session.metadata?.user_id, USER_ID_RE);
        const customerId = asId(session.customer, CUSTOMER_ID_RE);
        const subscriptionId = asId(session.subscription, SUBSCRIPTION_ID_RE);
        const requestedPlan = session.metadata?.plan_id;
        const planId = typeof requestedPlan === 'string' && ALLOWED_PLANS.has(requestedPlan) ? requestedPlan : 'pro';

        if (userId) {
          await (supabase as any).from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: planId,
            status: 'active',
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed': {
        const invoice = event.data?.object || {};
        const customerId = asId(invoice.customer, CUSTOMER_ID_RE);
        const subscriptionId = asId(invoice.subscription, SUBSCRIPTION_ID_RE);

        const update =
          event.type === 'invoice.payment_succeeded'
            ? {
                status: 'active',
                current_period_start: typeof invoice.period_start === 'number'
                  ? new Date(invoice.period_start * 1000).toISOString()
                  : null,
                current_period_end: typeof invoice.period_end === 'number'
                  ? new Date(invoice.period_end * 1000).toISOString()
                  : null,
                updated_at: new Date().toISOString(),
              }
            : {
                status: 'past_due',
                updated_at: new Date().toISOString(),
              };

        // Use parameterised equality filters instead of building a raw
        // PostgREST `.or()` string from event data (filter injection).
        if (subscriptionId) {
          await (supabase as any).from('subscriptions').update(update).eq('stripe_subscription_id', subscriptionId);
        } else if (customerId) {
          await (supabase as any).from('subscriptions').update(update).eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data?.object || {};
        const subscriptionId = asId(sub.id, SUBSCRIPTION_ID_RE);

        if (subscriptionId) {
          await (supabase as any)
            .from('subscriptions')
            .update({
              plan_id: 'free',
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
