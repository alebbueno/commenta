"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PaymentRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
  updated_at: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/payments?page=${page}&per_page=${perPage}`)
      .then((res) => res.ok && res.json())
      .then((data) => {
        setPayments(data?.payments ?? []);
        setTotal(data?.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Controle de pagamento
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Pagamentos
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Assinantes PRO e dados Stripe (customer, subscription).
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CreditCard className="size-5 text-header-accent" />
            Assinantes PRO ({total})
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Status da assinatura via Stripe.
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
                      <th className="px-4 py-3 font-medium text-foreground">E-mail</th>
                      <th className="px-4 py-3 font-medium text-foreground">Nome</th>
                      <th className="px-4 py-3 font-medium text-foreground">Status</th>
                      <th className="px-4 py-3 font-medium text-foreground">Customer ID</th>
                      <th className="px-4 py-3 font-medium text-foreground">Atualizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 text-foreground">{p.email ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.full_name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              p.stripe_subscription_status === "active"
                                ? "rounded-full border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400"
                                : "rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {p.stripe_subscription_status ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {p.stripe_customer_id ? p.stripe_customer_id.slice(0, 20) + "…" : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(p.updated_at).toLocaleDateString("pt-BR", {
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
