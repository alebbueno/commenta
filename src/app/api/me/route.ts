import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan, stripe_subscription_status, created_at, email, full_name")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({
      plan: "free" as const,
      email: user.email ?? undefined,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
    });
  }

  return NextResponse.json({
    plan: (profile.plan === "pro" ? "pro" : "free") as "free" | "pro",
    stripe_subscription_status: profile.stripe_subscription_status ?? undefined,
    created_at: profile.created_at ?? undefined,
    email: profile.email ?? user.email ?? undefined,
    full_name: profile.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
  });
}
