import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/me/sites
 * Retorna a quantidade e a lista de sites onde a licença PRO foi ativada (license_sites).
 * Apenas para usuários com plano Pro; caso contrário retorna { count: 0, sites: [] }.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (!profile || profile.plan !== "pro") {
      return NextResponse.json({ count: 0, sites: [] });
    }

    const { data: license } = await admin
      .from("licenses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!license) {
      return NextResponse.json({ count: 0, sites: [] });
    }

    const { data: sites, error } = await admin
      .from("license_sites")
      .select("site_url, site_name, first_validated_at, last_validated_at")
      .eq("license_id", license.id)
      .order("last_validated_at", { ascending: false });

    if (error) {
      console.error("me/sites error:", error);
      return NextResponse.json({ count: 0, sites: [] });
    }

    const list = sites ?? [];
    return NextResponse.json({
      count: list.length,
      sites: list.map((s) => ({
        site_url: s.site_url,
        site_name: s.site_name ?? undefined,
        first_validated_at: s.first_validated_at,
        last_validated_at: s.last_validated_at,
      })),
    });
  } catch (err) {
    console.error("me/sites error:", err);
    return NextResponse.json({ count: 0, sites: [] });
  }
}
