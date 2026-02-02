import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/sites
 * Lista sites (license_sites) com dados da licença e do usuário.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(10, parseInt(searchParams.get("per_page") ?? "20", 10)));
  const offset = (page - 1) * perPage;

  const admin = createAdminClient();

  const { data: rows, error } = await admin
    .from("license_sites")
    .select("id, site_url, site_name, first_validated_at, last_validated_at, license_id")
    .order("last_validated_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await admin
    .from("license_sites")
    .select("id", { count: "exact", head: true });

  const list = rows ?? [];
  const licenseIds = [...new Set(list.map((r: { license_id: string }) => r.license_id))];
  const { data: licenses } = licenseIds.length
    ? await admin.from("licenses").select("id, license_key, user_id").in("id", licenseIds)
    : { data: [] };
  const userIds = [...new Set((licenses ?? []).map((l: { user_id: string }) => l.user_id))];
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, email, full_name").in("id", userIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p: { id: string; email?: string; full_name?: string }) => [p.id, p]));
  const licenseMap = new Map((licenses ?? []).map((l: { id: string; license_key: string; user_id: string }) => [l.id, l]));

  const sites = list.map((r: { id: string; site_url: string; site_name: string | null; first_validated_at: string; last_validated_at: string; license_id: string }) => {
    const lic = licenseMap.get(r.license_id);
    const prof = lic ? profileMap.get(lic.user_id) : null;
    return {
      id: r.id,
      site_url: r.site_url,
      site_name: r.site_name ?? undefined,
      first_validated_at: r.first_validated_at,
      last_validated_at: r.last_validated_at,
      license_key: lic?.license_key,
      user_email: prof?.email,
      user_name: prof?.full_name,
    };
  });

  return NextResponse.json({
    sites,
    total: count ?? 0,
    page,
    per_page: perPage,
  });
}
