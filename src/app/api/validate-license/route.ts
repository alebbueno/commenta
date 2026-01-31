import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * API chamada pelo plugin WordPress para validar o token de licença.
 * POST /api/validate-license
 * Body: { "token": "<license_key>", "site_url": "<site_url>" }
 * Resposta: { "valid": true, "plan": "pro" } ou { "valid": false, "message": "..." }
 *
 * Conforme PLAN-LICENSE-AUTHENTICATION.md: o plugin envia token + site_url;
 * a dashboard valida o token (licença ativa + usuário Pro) e devolve se o plano é pro.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const siteUrl =
      typeof body?.site_url === "string" ? body.site_url.trim() : "";

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
