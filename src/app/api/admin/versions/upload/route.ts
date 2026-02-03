import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "plugin-releases";
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB (Vercel serverless body limit ~4.5MB; Supabase standard upload até 6MB)

/**
 * Sanitiza a versão para usar como pasta no Storage (apenas números, pontos, hífens).
 */
function sanitizeVersionPath(version: string): string {
  return version.replace(/[^0-9.\-a-zA-Z]/g, "").replace(/^\.+|\.+$/g, "") || "unknown";
}

/**
 * POST /api/admin/versions/upload
 * Upload do .zip do plugin para o bucket plugin-releases.
 * Body: multipart/form-data com "file" (obrigatório) e "version" (opcional, usado como pasta).
 * Retorna { download_url, file_name }.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo .zip é obrigatório" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".zip")) {
    return NextResponse.json({ error: "Apenas arquivos .zip são permitidos" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Máximo ${MAX_SIZE_BYTES / 1024 / 1024}MB.` },
      { status: 400 }
    );
  }

  const versionRaw = (formData.get("version") as string | null)?.trim() || "";
  const folder = versionRaw ? sanitizeVersionPath(versionRaw) : "uploads";
  const path = `${folder}/${file.name}`;

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/zip",
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(data.path);
  return NextResponse.json({
    download_url: urlData.publicUrl,
    file_name: file.name,
  });
}
