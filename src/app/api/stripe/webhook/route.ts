import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : (null as unknown as Stripe);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Webhook Stripe: ao confirmar pagamento, atualiza profile (plan=pro) e cria licença.
 * Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted.
 */
export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id as string | undefined;
        if (!userId) {
          console.warn("checkout.session.completed: missing supabase_user_id in metadata");
          break;
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        await supabase
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subscriptionId ?? null,
            stripe_subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        const { data: existing } = await supabase
          .from("licenses")
          .select("id")
          .eq("user_id", userId)
          .single();

        if (!existing) {
          const licenseKey = generateLicenseKey();
          await supabase.from("licenses").insert({
            user_id: userId,
            license_key: licenseKey,
            status: "active",
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        const isActive = status === "active" || status === "trialing";
        await supabase
          .from("profiles")
          .update({
            plan: isActive ? "pro" : "free",
            stripe_subscription_id: subscription.id,
            stripe_subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (!customerId) break;

        await supabase
          .from("profiles")
          .update({
            plan: "free",
            stripe_subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      default:
        // outros eventos ignorados
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

function generateLicenseKey(): string {
  const b64 = randomBytes(24).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_");
}
