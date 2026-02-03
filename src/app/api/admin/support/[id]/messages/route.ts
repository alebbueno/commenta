import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/support/[id]/messages
 * Adiciona uma resposta do staff ao ticket.
 * Body: { body: string }
 */
export async function POST(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const messageBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!messageBody) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: ticket } = await admin.from("support_tickets").select("id").eq("id", id).single();
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const { data: msg, error } = await admin
    .from("support_ticket_messages")
    .insert({
      ticket_id: id,
      author_type: "staff",
      author_id: null,
      body: messageBody,
    })
    .select("id, author_type, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Marcar como em atendimento se estava open
  await admin
    .from("support_tickets")
    .update({ status: "in_progress" })
    .eq("id", id)
    .eq("status", "open");

  return NextResponse.json({ message: msg });
}
