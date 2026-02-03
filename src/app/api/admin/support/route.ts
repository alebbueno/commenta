import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/support
 * Lista todos os tickets de suporte com email do usuário.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // open | in_progress | closed
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(10, parseInt(searchParams.get("per_page") ?? "20", 10)));
  const offset = (page - 1) * perPage;

  const admin = createAdminClient();

  let query = admin
    .from("support_tickets")
    .select("id, user_id, subject, status, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (status && ["open", "in_progress", "closed"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data: rows, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = rows ?? [];
  const userIds = [...new Set(list.map((r: { user_id: string }) => r.user_id))];
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, email, full_name").in("id", userIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p: { id: string; email: string | null; full_name: string | null }) => [p.id, p]));

  const tickets = list.map((r: { user_id: string } & Record<string, unknown>) => {
    const p = profileMap.get(r.user_id as string);
    return {
      ...r,
      user_email: p?.email ?? null,
      user_name: p?.full_name ?? null,
    };
  });

  return NextResponse.json({
    tickets,
    total: count ?? 0,
    page,
    per_page: perPage,
  });
}
