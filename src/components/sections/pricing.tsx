"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "Pins e áreas destacadas",
  "Comentários textuais",
  "1 usuário",
  "Branding Commenta visível",
  "Dashboard básico",
];

const proFeatures = [
  "Todas ferramentas visuais (setas, círculos, textos livres)",
  "Usuários ilimitados",
  "Dashboard completo + filtros e atribuição",
  "Remoção total de branding",
  "Suporte prioritário",
];

const PRICE_MONTHLY = 39.9;
const PRICE_ANNUAL = 299;
const PRICE_ANNUAL_PER_MONTH = (PRICE_ANNUAL / 12).toFixed(2);
const SAVINGS_PCT = Math.round((1 - PRICE_ANNUAL / (PRICE_MONTHLY * 12)) * 100);

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="planos"
      className="border-b border-border/40 bg-muted/30 py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Label + Título + Descrição */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <Zap className="size-4 text-header-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              Planos e preços
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Preços simples e flexíveis
          </h2>
          <p className="mt-4 text-muted-foreground">
            Veja os planos, escolha o que faz sentido para você e comece a
            aprovar projetos sem caos. Sempre grátis para começar.
          </p>
        </div>

        {/* Toggle Mensal / Anual (acima dos cards, estilo pill) */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                !isAnnual
                  ? "bg-header-accent text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                isAnnual
                  ? "bg-header-accent text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Anual
            </button>
          </div>
          {isAnnual && (
            <p className="text-sm font-medium text-header-accent">
              Economize {SAVINGS_PCT}%
            </p>
          )}
        </div>

        {/* Cards: PRO (destaque, ~60%) à esquerda | FREE (~40%) à direita */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-[6fr_4fr] lg:gap-8">
          {/* Card PRO — laranja, em destaque, maior */}
          <article
            className={cn(
              "relative flex flex-col rounded-2xl bg-header-accent p-6 text-white shadow-lg min-w-0",
              "lg:p-8"
            )}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">PRO</h3>
              {isAnnual && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/90 px-2 py-0.5 text-xs font-semibold text-amber-950">
                  <Flame className="size-3" />
                  {SAVINGS_PCT}% off
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/90">
              Acesso completo: todas as ferramentas visuais, usuários ilimitados
              e sem branding.
            </p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                R${" "}
                {isAnnual
                  ? PRICE_ANNUAL.toFixed(2).replace(".", ",")
                  : PRICE_MONTHLY.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-lg text-white/90">
                {isAnnual ? "/ ano" : "/ mês"}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/80">
              {isAnnual
                ? `R$ ${PRICE_ANNUAL_PER_MONTH.replace(".", ",")}/mês — cobrança anual`
                : "Cobrança mensal. Cancele quando quiser."}
            </p>
            <Button
              variant="solid-inverse"
              className="mt-6 w-full bg-white text-header-accent hover:bg-white/95 hover:text-header-accent"
              size="lg"
              asChild
            >
              <Link href="#planos">Começar agora</Link>
            </Button>
            <ul className="mt-6 space-y-3">
              {proFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-white" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Card FREE — branco, menor */}
          <article
            className={cn(
              "flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm min-w-0",
              "lg:p-7"
            )}
          >
            <h3 className="text-xl font-bold text-foreground">FREE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece de graça com pins, áreas destacadas e comentários textuais.
            </p>
            <p className="mt-5 text-3xl font-bold tracking-tight text-foreground">
              Grátis
            </p>
            <p className="text-sm text-muted-foreground">Para sempre</p>
            <Button
              variant="outline"
              className="mt-6 w-full border-2 border-header-accent text-header-accent hover:bg-header-accent/10"
              size="lg"
              asChild
            >
              <Link href="#planos">Começar grátis</Link>
            </Button>
            <ul className="mt-6 space-y-3">
              {freeFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          A maioria começa no FREE e já sente a diferença. Quando o time cresce
          ou o cliente pede mais clareza → o PRO se paga sozinho na primeira
          entrega mais rápida.
        </p>
      </div>
    </section>
  );
}
