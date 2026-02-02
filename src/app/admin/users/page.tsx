"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserRow = { id: string; email: string | null; full_name: string | null; plan: string; created_at: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?page=${page}&per_page=${perPage}`)
      .then((res) => res.ok && res.json())
      .then((data) => {
        setUsers(data?.users ?? []);
        setTotal(data?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Controle de usuários
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Usuários
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Lista de usuários cadastrados na plataforma.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <UsersIcon className="size-5 text-header-accent" />
            Usuários ({total})
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Planos FREE e PRO.
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
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/30">
                      <th className="px-4 py-3 font-medium text-foreground">E-mail</th>
                      <th className="px-4 py-3 font-medium text-foreground">Nome</th>
                      <th className="px-4 py-3 font-medium text-foreground">Plano</th>
                      <th className="px-4 py-3 font-medium text-foreground">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 text-foreground">{u.email ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.full_name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              u.plan === "pro"
                                ? "rounded-full border border-header-accent/40 bg-header-accent/10 px-2 py-0.5 text-xs font-medium text-header-accent"
                                : "rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {u.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
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
