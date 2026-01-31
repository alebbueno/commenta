"use client";

import Link from "next/link";
import { CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background bg-geometric-pattern">
      <div className="container mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:gap-12 sm:px-6 sm:py-24 md:grid-cols-2 md:gap-20 md:py-28 lg:gap-24 lg:py-32">
        <div className="flex flex-col justify-center text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="inline-flex items-center rounded-full border border-header-accent/40 bg-header-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-accent sm:text-sm">
              {t.heroPreHeadline}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {t.heroPreHeadlineSub}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:mt-3 sm:text-4xl sm:leading-[1.1] md:text-5xl lg:text-6xl lg:leading-[1.08]">
            {t.heroHeadline}
            <span className="text-header-accent">&ldquo;{t.heroHeadlineQuote}&rdquo;</span>
            {t.heroHeadlineEnd}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:mt-8 md:text-xl md:leading-relaxed">
            {t.heroSub}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 md:justify-start md:mt-12">
            <Button
              size="lg"
              className="h-12 w-full min-h-[48px] shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:-translate-y-0.5 sm:min-w-[220px] sm:w-auto md:min-w-[240px]"
              asChild
            >
              <Link href="#planos">{t.heroCtaPrimary}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full min-h-[48px] border-2 transition-all hover:bg-muted/50 active:-translate-y-0.5 sm:min-w-[180px] sm:w-auto"
              asChild
            >
              <Link href="#planos">{t.heroCtaSecondary}</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-8 sm:gap-6 md:justify-start">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4 shrink-0" />
              {t.heroNoCard}
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0" />
              {t.heroDaysFree}
            </span>
          </div>
          <p className="mt-6 text-xs text-muted-foreground sm:mt-10 sm:text-sm md:mt-12">
            {t.heroSocialProof}
          </p>
        </div>

        <div className="relative flex items-center justify-center md:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[420px]">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl shadow-foreground/6 ring-1 ring-border/50">
              <div className="aspect-[4/3] w-full">
                <div className="flex h-full w-full flex-col bg-gradient-to-b from-muted/40 to-muted/20 p-4 sm:p-5">
                  <div className="flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                      <span className="size-2.5 rounded-full bg-muted-foreground/20" />
                      <span className="size-2.5 rounded-full bg-muted-foreground/20" />
                    </div>
                    <div className="ml-2 h-2 flex-1 max-w-[120px] rounded bg-muted/60" />
                  </div>
                  <div className="mt-4 flex flex-1 gap-3">
                    <div className="flex-1 rounded-lg bg-background/60 p-3 shadow-sm">
                      <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                      <div className="mt-2 h-2 w-full rounded bg-muted-foreground/10" />
                      <div className="mt-2 h-2 w-5/6 rounded bg-muted-foreground/10" />
                      <div className="mt-4 flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-primary/20" />
                        <div className="h-6 w-12 rounded-full bg-muted/60" />
                      </div>
                    </div>
                    <div className="w-24 rounded-lg bg-background/60 p-2 shadow-sm">
                      <div className="mx-auto h-8 w-8 rounded-full bg-muted-foreground/20" />
                      <div className="mt-2 h-1.5 w-full rounded bg-muted-foreground/10" />
                      <div className="mt-1 h-1.5 w-4/5 rounded bg-muted-foreground/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "absolute -right-2 top-[15%] w-[45%] rounded-xl border border-border bg-card p-3 shadow-lg shadow-foreground/8 ring-1 ring-border/40",
                "transition-transform hover:translate-y-0 hover:shadow-xl md:-right-4"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary/30" />
                <div className="h-1.5 w-16 rounded bg-muted-foreground/20" />
              </div>
              <div className="mt-2 h-2 w-full rounded bg-muted-foreground/15" />
              <div className="mt-1 h-2 w-4/5 rounded bg-muted-foreground/10" />
            </div>
            <div
              className="absolute -right-6 -top-6 size-20 rounded-2xl bg-primary/15 blur-sm md:-right-8 md:-top-8 md:size-24"
              aria-hidden
            />
            <div
              className="absolute -bottom-4 -left-4 size-14 rounded-full bg-amber-400/20 blur-sm"
              aria-hidden
            />
            <div
              className="absolute right-1/4 top-1/2 size-3 rounded-full bg-primary/25"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
