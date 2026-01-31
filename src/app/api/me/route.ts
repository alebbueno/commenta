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
    .select("plan")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ plan: "free" as const });
  }

  return NextResponse.json({
    plan: (profile.plan === "pro" ? "pro" : "free") as "free" | "pro",
  });
}
