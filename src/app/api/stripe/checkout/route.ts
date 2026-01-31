import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : (null as unknown as Stripe);

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { successUrl, cancelUrl, interval, locale } = (body || {}) as {
      successUrl?: string;
      cancelUrl?: string;
      interval?: "monthly" | "annual";
      locale?: "pt" | "en";
    };

    const isBR = locale !== "en";
    const isAnnual = interval === "annual";
    const priceKey =
      locale === "en"
        ? isAnnual
          ? "STRIPE_PRICE_US_ANNUAL"
          : "STRIPE_PRICE_US_MONTHLY"
        : isAnnual
          ? "STRIPE_PRICE_BR_ANNUAL"
          : "STRIPE_PRICE_BR_MONTHLY";
    let priceId = process.env[priceKey];
    if (!priceId) {
      priceId = process.env.STRIPE_PRICE_ID_PRO;
    }
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured. Set STRIPE_PRICE_* or STRIPE_PRICE_ID_PRO." },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl ?? `${appUrl}/dashboard?success=1`,
      cancel_url: cancelUrl ?? `${appUrl}/dashboard`,
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
