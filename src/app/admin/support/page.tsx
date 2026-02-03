"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TicketRow = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_email: string | null;
  user_name: string | null;
};

const statusLabel: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em atendimento",
  closed: "Fechado",
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const load = (status?: string, page = 1) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));
    fetch(`/api/admin/support?${params}`)
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data) {
          setTickets(data.tickets ?? []);
          setTotal(data.total ?? 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Atendimento
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Suporte
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Tickets abertos pelos usuários PRO. Clique para ver e responder.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Headphones className="size-5 text-header-accent" />
              Chamados ({total})
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Filtre por status e abra para responder.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <select
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em atendimento</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            </div>
          ) : tickets.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nenhum ticket encontrado.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/support/${t.id}`}
                    className={cn(
                      "flex items-center justify-between gap-4 px-2 py-4 text-left transition-colors hover:bg-muted/30 rounded-xl"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{t.subject}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.user_email ?? "—"} · {statusLabel[t.status] ?? t.status} ·{" "}
                        {new Date(t.created_at).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
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
