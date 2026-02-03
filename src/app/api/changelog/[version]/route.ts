import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ version: string }> };

/**
 * GET /api/changelog/[version]
 * Retorna dados públicos do changelog de uma versão (por string, ex: 1.0.2).
 */
export async function GET(_request: Request, { params }: Params) {
  const { version } = await params;
  if (!version?.trim()) {
    return NextResponse.json({ error: "Version required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("plugin_versions")
    .select("id, version, release_date, description, changelog_text, changelog_url")
    .eq("version", version.trim())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  return NextResponse.json({
    version: data.version,
    release_date: data.release_date,
    description: data.description,
    changelog_text: data.changelog_text,
    changelog_url: data.changelog_url,
  });
}
