import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/versions/[id]
 * Atualiza uma versão do plugin.
 */
export async function PATCH(
  request: Request,
  { params }: Params
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const admin = createAdminClient();

  const updates: Record<string, unknown> = {};
  if (typeof body.version === "string" && body.version.trim()) updates.version = body.version.trim();
  if (body.release_date !== undefined) updates.release_date = body.release_date || null;
  if (typeof body.description === "string") updates.description = body.description.trim() || null;
  if (typeof body.changelog_url === "string") updates.changelog_url = body.changelog_url.trim() || null;
  if (typeof body.changelog_text === "string") updates.changelog_text = body.changelog_text.trim() || null;
  if (typeof body.download_url === "string") updates.download_url = body.download_url.trim() || null;
  if (typeof body.file_name === "string") updates.file_name = body.file_name.trim() || null;
  if (typeof body.is_prerelease === "boolean") updates.is_prerelease = body.is_prerelease;
  if (body.release_channel === "beta" || body.release_channel === "alpha" || body.release_channel === "stable") {
    updates.release_channel = body.release_channel;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await admin
    .from("plugin_versions")
    .update(updates)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Version already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/admin/versions/[id]
 * Remove uma versão do plugin.
 */
export async function DELETE(
  _request: Request,
  { params }: Params
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("plugin_versions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
