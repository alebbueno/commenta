import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Lista usuários (profiles) com plan, email, created_at.
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

  const { data: users, error } = await admin
    .from("profiles")
    .select("id, email, full_name, plan, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    users: users ?? [],
    total: count ?? 0,
    page,
    per_page: perPage,
  });
}
