"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SiteRow = {
  id: string;
  site_url: string;
  site_name?: string;
  first_validated_at: string;
  last_validated_at: string;
  license_key?: string;
  user_email?: string;
  user_name?: string;
};

export default function AdminSitesPage() {
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/sites?page=${page}&per_page=${perPage}`)
      .then((res) => res.ok && res.json())
      .then((data) => {
        setSites(data?.sites ?? []);
        setTotal(data?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Plugins instalados / sites em uso
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Sites em uso
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Sites onde a licença PRO foi ativada com o plugin.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Globe className="size-5 text-header-accent" />
            Sites ({total})
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            URL, usuário e última validação.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="px-4 py-3 font-medium text-foreground">URL</th>
                      <th className="px-4 py-3 font-medium text-foreground">Nome</th>
                      <th className="px-4 py-3 font-medium text-foreground">Usuário</th>
                      <th className="px-4 py-3 font-medium text-foreground">Última validação</th>
                      <th className="w-10 px-2 py-3" aria-hidden />
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((s) => (
                      <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <a
                            href={s.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-header-accent hover:underline"
                          >
                            {s.site_url}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.site_name ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.user_email ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(s.last_validated_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-2 py-3">
                          <a
                            href={s.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Abrir site"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 size-4" />
            Voltar ao painel
          </Link>
        </Button>
      </div>
    </div>
  );
}
