"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/locale-context";
import { HeroFloatingIcons } from "./hero-floating-icons";
import { HeroBrowserMockup } from "./hero-browser-mockup";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background bg-geometric-pattern">
      <HeroFloatingIcons />
      <div className="container relative z-10 mx-auto px-4 pt-14 sm:px-6 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
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
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg md:mt-8 md:text-xl md:leading-relaxed">
            {t.heroSub}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-12">
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
          <p className="mt-6 text-xs text-muted-foreground sm:mt-10 sm:text-sm md:mt-12">
            {t.heroSocialProof}
          </p>
        </div>
      </div>

      {/* Browser mockup: inside container, slightly narrower than layout */}
      <div className="container relative z-10 mx-auto mt-10 max-w-5xl px-4 sm:mt-14 sm:px-6 md:mt-16">
        <HeroBrowserMockup variant="fullWidthHalfCut" />
      </div>
    </section>
  );
}
