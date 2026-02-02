import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * API chamada pelo plugin WordPress para validar o token de licença.
 * POST /api/validate-license
 * Body: { "token": "<license_key>", "site_url": "<site_url>", "site_name"?: "<nome>" }
 * - token: obrigatório.
 * - site_url: obrigatório para gravar o site; ao validar PRO, o backend registra/atualiza o site.
 * - site_name: opcional (ex.: nome do site no WordPress).
 * Resposta: { "valid": true, "plan": "pro" } ou { "valid": false, "message": "..." }
 */
function normalizeSiteUrl(input: string): string {
  let url = input.trim().toLowerCase();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const u = new URL(url);
    url = u.origin; // scheme + host + port (sem path)
  } catch {
    return input.trim().toLowerCase();
  }
  return url.replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const siteUrlRaw =
      typeof body?.site_url === "string" ? body.site_url.trim() : "";
    const siteName =
      typeof body?.site_name === "string" ? body.site_name.trim() : "";

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token é obrigatório." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: license, error: licenseError } = await supabase
      .from("licenses")
      .select("id, user_id, status")
      .eq("license_key", token)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { valid: false, message: "Token inválido ou expirado." },
        { status: 200 }
      );
    }

    if (license.status !== "active") {
      return NextResponse.json(
        { valid: false, message: "Licença revogada." },
        { status: 200 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", license.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { valid: false, message: "Conta não encontrada." },
        { status: 200 }
      );
    }

    if (profile.plan !== "pro") {
      return NextResponse.json(
        { valid: false, message: "Plano não é Pro." },
        { status: 200 }
      );
    }

    // Sempre gravar o site quando token PRO é válido e site_url foi enviado
    if (siteUrlRaw) {
      const siteUrl = normalizeSiteUrl(siteUrlRaw);
      if (siteUrl) {
        await supabase.rpc("upsert_license_site", {
          p_license_id: license.id,
          p_site_url: siteUrl,
          p_site_name: siteName || null,
        });
      }
    }

    return NextResponse.json({
      valid: true,
      plan: "pro",
    });
  } catch (err) {
    console.error("validate-license error:", err);
    return NextResponse.json(
      { valid: false, message: "Erro ao validar licença." },
      { status: 500 }
    );
  }
}
