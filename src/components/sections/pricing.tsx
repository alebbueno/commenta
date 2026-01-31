"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t, pricing } = useLocale();

  const priceMonthly = pricing.monthly;
  const priceAnnual = pricing.annual;
  const priceAnnualPerMonth = pricing.format(priceAnnual / 12);
  const savingsPct = Math.round(
    (1 - priceAnnual / (priceMonthly * 12)) * 100
  );

  return (
    <section
      id="planos"
      className="border-b border-border/40 bg-muted/30 py-14 sm:py-20 md:py-24"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <Zap className="size-4 text-header-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              {t.pricingLabel}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:mt-6 sm:text-3xl md:text-4xl">
            {t.pricingTitle}
          </h2>
          <p className="mt-3 text-muted-foreground sm:mt-4">{t.pricingSub}</p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 sm:mt-10">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={cn(
                "min-h-[44px] touch-manipulation rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                !isAnnual
                  ? "bg-header-accent text-white shadow"
                  : "text-muted-foreground hover:text-foreground active:bg-muted/50"
              )}
            >
              {t.pricingMonthly}
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={cn(
                "min-h-[44px] touch-manipulation rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                isAnnual
                  ? "bg-header-accent text-white shadow"
                  : "text-muted-foreground hover:text-foreground active:bg-muted/50"
              )}
            >
              {t.pricingAnnual}
            </button>
          </div>
          {isAnnual && (
            <p className="text-sm font-medium text-header-accent">
              {t.pricingSave} {savingsPct}%
            </p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-[6fr_4fr] lg:gap-8">
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
                  {savingsPct}% {t.pricingOff}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/90">{t.pricingProDesc}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                {pricing.currency} {pricing.format(isAnnual ? priceAnnual : priceMonthly)}
              </span>
              <span className="text-lg text-white/90">
                {isAnnual ? t.pricingPerYear : t.pricingPerMonth}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/80">
              {isAnnual
                ? `${pricing.currency} ${priceAnnualPerMonth} ${t.pricingPerMonth} — ${t.pricingBillingAnnual}`
                : t.pricingBillingMonthly}
            </p>
            <Button
              variant="solid-inverse"
              className="mt-6 w-full"
              size="lg"
              asChild
            >
              <Link href="#planos">{t.pricingCtaPro}</Link>
            </Button>
            <ul className="mt-6 space-y-3">
              {t.pricingProFeatures.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-white" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={cn(
              "flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-sm min-w-0",
              "lg:p-7"
            )}
          >
            <h3 className="text-xl font-bold text-foreground">FREE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.pricingFreeDesc}
            </p>
            <p className="mt-5 text-3xl font-bold tracking-tight text-foreground">
              {t.pricingFree}
            </p>
            <p className="text-sm text-muted-foreground">{t.pricingForever}</p>
            <Button
              variant="outline"
              className="mt-6 w-full border-2 border-header-accent text-header-accent hover:bg-header-accent/10"
              size="lg"
              asChild
            >
              <Link href="#planos">{t.pricingCtaFree}</Link>
            </Button>
            <ul className="mt-6 space-y-3">
              {t.pricingFreeFeatures.map((f, i) => (
                <li
                  key={i}
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
          {t.pricingFootnote}
        </p>
      </div>
    </section>
  );
}
