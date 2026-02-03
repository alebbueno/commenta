import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/versions
 * Lista versões do plugin (plugin_versions).
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data: versions, error } = await admin
    .from("plugin_versions")
    .select("id, version, release_date, description, file_name, changelog_url, changelog_text, download_url, is_prerelease, release_channel, created_at")
    .order("release_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ versions: versions ?? [] });
}

/**
 * POST /api/admin/versions
 * Cria uma nova versão do plugin.
 * Body: { version, release_date?, description?, changelog_url?, changelog_text?, download_url?, file_name?, is_prerelease?, release_channel? }
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  const body = await request.json().catch(() => ({}));
  const version = typeof body.version === "string" ? body.version.trim() : "";
  if (!version) {
    return NextResponse.json({ error: "version is required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: insertError } = await admin.from("plugin_versions").insert({
    version,
    release_date: body.release_date ?? new Date().toISOString().slice(0, 10),
    description: typeof body.description === "string" ? body.description.trim() || null : null,
    changelog_url: typeof body.changelog_url === "string" ? body.changelog_url.trim() || null : null,
    changelog_text: typeof body.changelog_text === "string" ? body.changelog_text.trim() || null : null,
    download_url: typeof body.download_url === "string" ? body.download_url.trim() || null : null,
    file_name: typeof body.file_name === "string" ? body.file_name.trim() || null : null,
    is_prerelease: Boolean(body.is_prerelease),
    release_channel: body.release_channel === "beta" || body.release_channel === "alpha" ? body.release_channel : "stable",
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "Version already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
