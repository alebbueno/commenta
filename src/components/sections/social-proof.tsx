"use client";

import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";

const avatarColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500"];

export function SocialProof() {
  const { t } = useLocale();

  return (
    <section
      id="depoimentos"
      className="border-b border-border/40 bg-background py-14 sm:py-20 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t.testimonialsLabel}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {t.testimonialsTitle}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
            {t.testimonialsSub}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.testimonials.map((item, i) => (
            <article
              key={i}
              className={cn(
                "flex flex-col rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:p-6",
                "transition-all duration-200 hover:shadow-lg hover:shadow-foreground/5"
              )}
            >
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <div className="relative mt-4 flex-1">
                <Quote className="absolute -left-0.5 -top-0.5 size-8 text-primary/15" />
                <p className="relative pl-6 text-sm leading-relaxed text-foreground sm:text-base">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm",
                    avatarColors[i]
                  )}
                >
                  {item.initial}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
