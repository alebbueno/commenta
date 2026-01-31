"use client";

import { cn } from "@/lib/utils";

/**
 * Ícones SVG estilo Figma (stroke, 24x24) para o hero — comentário, pencil, text, caixa de texto.
 * Flutuantes com animação suave.
 */
const icons = [
  {
    id: "comment",
    className: "left-[8%] top-[18%] text-primary/50",
    animation: "animate-float-hero",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 sm:size-10"
        aria-hidden
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "pencil",
    className: "left-[12%] bottom-[22%] text-header-accent/50",
    animation: "animate-float-hero-delay-1",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7 sm:size-9"
        aria-hidden
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-1.5 2-2 1.5 1.5-2 2z" />
      </svg>
    ),
  },
  {
    id: "text-box",
    className: "right-[15%] top-[25%] text-muted-foreground/40",
    animation: "animate-float-hero-delay-2",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 sm:size-10"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M7 8h10M7 11h8M7 14h6" />
      </svg>
    ),
  },
  {
    id: "box",
    className: "right-[10%] bottom-[28%] text-primary/40",
    animation: "animate-float-hero-delay-3",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7 sm:size-9"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    id: "comment-2",
    className: "left-[5%] top-[45%] text-header-accent/35 hidden sm:flex",
    animation: "animate-float-hero-delay-4",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6 sm:size-8"
        aria-hidden
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "text-box-2",
    className: "right-[8%] top-[50%] text-muted-foreground/30 hidden sm:flex",
    animation: "animate-float-hero",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6 sm:size-8"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M7 8h10M7 11h8M7 14h6" />
      </svg>
    ),
  },
];

export function HeroFloatingIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {icons.map(({ id, className, animation, svg }) => (
        <div
          key={id}
          className={cn(
            "absolute flex items-center justify-center",
            className,
            animation
          )}
        >
          {svg}
        </div>
      ))}
    </div>
  );
}
