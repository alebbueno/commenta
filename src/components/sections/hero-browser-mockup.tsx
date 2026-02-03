"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { src: "/print-admin.png", alt: "Painel Commenta no WordPress" },
  { src: "/print-box-task.png", alt: "Caixa de tarefa e ferramentas" },
  { src: "/print-modal-comments.png", alt: "Modal de comentários" },
  { src: "/print-pin.png", alt: "Pin e anotações na página" },
  { src: "/print-task.png", alt: "Tarefa e conteúdo" },
];

const SLIDE_HEIGHT_PX = 600;

const ROTATE_MS = 4500;

type HeroBrowserMockupProps = {
  variant?: "default" | "fullWidthHalfCut";
};

export function HeroBrowserMockup({ variant = "default" }: HeroBrowserMockupProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const isFullWidth = variant === "fullWidthHalfCut";

  const browserChrome = (
    <div
      className={cn(
        "overflow-hidden border-border/80 bg-muted/30 shadow-xl shadow-foreground/6 ring-1 ring-border/50",
        isFullWidth
          ? "rounded-t-xl border-x-0 border-t border-b-0 sm:border-x border-border/80"
          : "rounded-t-xl border border-b-0"
      )}
    >
      {/* Title bar */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border/60 bg-muted/50 px-3 py-2.5 sm:px-4",
          isFullWidth ? "px-4 sm:px-6 md:px-8" : ""
        )}
      >
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/90" aria-hidden />
          <span className="size-2.5 rounded-full bg-amber-400/90" aria-hidden />
          <span className="size-2.5 rounded-full bg-emerald-400/90" aria-hidden />
        </div>
        <div className="ml-2 flex flex-1 items-center justify-center rounded-md bg-background/80 px-3 py-1.5 text-center">
          <span className="truncate text-xs text-muted-foreground sm:text-sm">
            commenta.site
          </span>
        </div>
        <div className={cn("shrink-0", isFullWidth ? "w-14 sm:w-16" : "w-12 sm:w-14")} aria-hidden />
      </div>

      {/* Window content: slideshow (background-image, bottom center) */}
      <div
        className={cn(
          "relative w-full bg-muted/20",
          isFullWidth ? "" : "aspect-4/3"
        )}
        style={isFullWidth ? { height: SLIDE_HEIGHT_PX } : undefined}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-600 ease-out",
              i === index
                ? "z-10 opacity-100"
                : "z-0 opacity-0 pointer-events-none"
            )}
            style={{
              backgroundImage: `url(${slide.src})`,
              backgroundPosition: "center bottom",
              backgroundSize: "cover",
            }}
            aria-hidden={i !== index}
          />
        ))}
      </div>
    </div>
  );

  const indicators = (
    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ver imagem ${i + 1}`}
          onClick={() => setIndex(i)}
          className={cn(
            "size-2 rounded-full transition-all duration-300",
            i === index
              ? "w-5 bg-header-accent"
              : "bg-white/70 hover:bg-white/90"
          )}
        />
      ))}
    </div>
  );

  if (isFullWidth) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: SLIDE_HEIGHT_PX }}>
        {/* Clip: only top ~50% of the browser is visible; bottom is cut at section border */}
        <div className="absolute left-0 top-0 w-full overflow-hidden" style={{ height: "200%" }}>
          {browserChrome}
        </div>
        {indicators}
      </div>
    );
  }

  const content = (
    <>
      <div className="relative">
        {browserChrome}
        <div
          className="rounded-b-xl border border-t-0 border-border/60 bg-muted/40 py-1.5 sm:py-2"
          aria-hidden
        />
        {indicators}
      </div>
    </>
  );

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[460px]">
      {content}
      <div
        className="absolute -right-6 -top-6 size-20 rounded-2xl bg-primary/15 blur-sm md:-right-8 md:-top-8 md:size-24"
        aria-hidden
      />
      <div
        className="absolute -bottom-4 -left-4 size-14 rounded-full bg-amber-400/20 blur-sm"
        aria-hidden
      />
    </div>
  );
}
