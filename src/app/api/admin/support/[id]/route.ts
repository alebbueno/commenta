import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/support/[id]
 * Retorna um ticket e suas mensagens, com dados do usuário.
 */
export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: ticket, error: ticketError } = await admin
    .from("support_tickets")
    .select("id, user_id, subject, status, created_at, updated_at")
    .eq("id", id)
    .single();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("email, full_name")
    .eq("id", ticket.user_id)
    .single();

  const { data: messages, error: msgError } = await admin
    .from("support_ticket_messages")
    .select("id, author_type, author_id, body, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 });
  }

  return NextResponse.json({
    ticket: {
      ...ticket,
      user_email: profile?.email ?? null,
      user_name: profile?.full_name ?? null,
    },
    messages: messages ?? [],
  });
}

/**
 * PATCH /api/admin/support/[id]
 * Atualiza o status do ticket (open | in_progress | closed).
 */
export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const status = body.status;
  if (!status || !["open", "in_progress", "closed"].includes(status)) {
    return NextResponse.json({ error: "status must be open, in_progress or closed" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("support_tickets")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
