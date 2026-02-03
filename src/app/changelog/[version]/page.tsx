import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ version: string }> };

async function getChangelog(version: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/changelog/${encodeURIComponent(version)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<{
    version: string;
    release_date: string | null;
    description: string | null;
    changelog_text: string | null;
    changelog_url: string | null;
  }>;
}

export default async function ChangelogVersionPage({ params }: Props) {
  const { version } = await params;
  const data = await getChangelog(version);
  if (!data) notFound();

  const releaseDate = data.release_date
    ? new Date(data.release_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-background bg-geometric-pattern">
      <div className="container relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>

        <article className="mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
          <header className="border-b border-border/40 pb-4">
            <Link href="/" className="inline-block" aria-label="Commenta">
              <Image
                src="/commenta-pt.png"
                alt="Commenta"
                width={120}
                height={38}
                className="h-7 w-auto"
              />
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Changelog — v{data.version}
            </h1>
            {releaseDate && (
              <p className="mt-1 text-sm text-muted-foreground">{releaseDate}</p>
            )}
            {data.description && (
              <p className="mt-2 text-muted-foreground">{data.description}</p>
            )}
          </header>

          <div className="prose prose-sm dark:prose-invert mt-6 max-w-none">
            {data.changelog_text ? (
              <div
                className="changelog-body [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                dangerouslySetInnerHTML={{ __html: data.changelog_text }}
              />
            ) : (
              <p className="text-muted-foreground">Nenhum changelog registrado.</p>
            )}
          </div>

          {data.changelog_url && (
            <p className="mt-6 text-sm text-muted-foreground">
              <a
                href={data.changelog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Ver changelog externo
              </a>
            </p>
          )}
        </article>
      </div>
    </main>
  );
}
