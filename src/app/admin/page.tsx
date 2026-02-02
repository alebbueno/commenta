"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CreditCard, Globe, Package, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stats = { users: number; pro: number; sites: number; versions: number } | null;

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.ok && res.json())
      .then((data) => data && setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    { href: "/admin/users", label: "Usuários", value: stats?.users ?? "—", icon: Users },
    { href: "/admin/payments", label: "Assinantes PRO", value: stats?.pro ?? "—", icon: CreditCard },
    { href: "/admin/sites", label: "Sites em uso", value: stats?.sites ?? "—", icon: Globe },
    { href: "/admin/versions", label: "Versões do plugin", value: stats?.versions ?? "—", icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Painel administrativo
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Visão geral
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Controle de usuários, pagamentos, sites ativos e releases do plugin.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full rounded-2xl border border-border/50 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                  {label}
                </CardTitle>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-header-accent/10">
                  <Icon className="size-5 text-header-accent" />
                </span>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="mt-1 flex items-center text-sm font-medium text-header-accent">
                  Ver lista
                  <ChevronRight className="ml-0.5 size-4" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
