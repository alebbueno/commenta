import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Verifica se o usuário autenticado está em admin_users.
 * Usar em API routes do painel admin.
 */
export async function requireAdmin(): Promise<{ ok: true; userId: string } | { ok: false; status: number; body: unknown }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, body: { error: "Unauthorized" } };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, status: 503, body: { error: "Admin not configured" } };
  }

  const admin = createAdminClient();
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRow) {
    return { ok: false, status: 403, body: { error: "Forbidden" } };
  }

  return { ok: true, userId: user.id };
}
