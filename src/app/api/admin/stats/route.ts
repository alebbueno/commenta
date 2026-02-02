import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 * Retorna contagens para o overview do painel admin.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const admin = createAdminClient();

  const [
    { count: usersCount },
    { count: proCount },
    { count: sitesCount },
    { count: versionsCount },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    admin.from("license_sites").select("id", { count: "exact", head: true }),
    admin.from("plugin_versions").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    users: usersCount ?? 0,
    pro: proCount ?? 0,
    sites: sitesCount ?? 0,
    versions: versionsCount ?? 0,
  });
}
