"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useLocale } from "@/contexts/locale-context";
import { Pricing } from "@/components/sections/pricing";
import { ArrowLeft } from "lucide-react";

const appUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function EscolherPlanoPage() {
  const { user, loading } = useAuth();
  const { locale } = useLocale();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login?plan=pro";
    }
  }, [user, loading]);

  const handleProCta = async (interval: "monthly" | "annual") => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interval,
          locale,
          successUrl: `${appUrl}/dashboard?success=1`,
          cancelUrl: `${appUrl}/escolher-plano`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(data?.error);
        alert(data?.error ?? "Erro ao abrir o pagamento.");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      alert("Erro ao abrir o pagamento.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background bg-geometric-pattern px-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-geometric-pattern">
      <div className="container relative z-10 mx-auto max-w-6xl px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao dashboard
        </Link>
      </div>

      <Pricing
        onProCtaClick={handleProCta}
        proCtaLoading={checkoutLoading}
        proCtaHref="/escolher-plano"
        freeCtaHref="/dashboard"
      />
    </main>
  );
}
