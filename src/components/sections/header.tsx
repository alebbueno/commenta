"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Recursos", href: "#recursos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Planos", href: "#planos" },
  { label: "Depoimentos", href: "#depoimentos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-5">
      <div
        className={cn(
          "mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/5 px-4 shadow-lg shadow-black/20 sm:h-16 sm:px-5 md:px-6",
          "bg-black/90 text-white backdrop-blur-xl"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 py-2"
          aria-label="Commenta - início"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/commenta.png"
            alt="Commenta"
            width={130}
            height={38}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        {/* Nav desktop: centralizado */}
        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 md:flex"
          aria-label="Principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                "text-white/85 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTAs desktop */}
        <div className="hidden shrink-0 items-center gap-2 md:flex sm:gap-3">
          <Link
            href="#login"
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            Acessar conta
          </Link>
          <Button
            variant="header-accent"
            size="sm"
            className="rounded-full font-semibold"
            asChild
          >
            <Link href="#planos">Comprar</Link>
          </Button>
        </div>

        {/* Botão mobile: abrir menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Overlay + painel mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col gap-6 border-l border-white/10 bg-black/95 p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="py-2"
            aria-label="Commenta"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/commenta.png"
              alt=""
              width={120}
              height={35}
              className="h-7 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex size-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 hover:text-white"
            aria-label="Fechar menu"
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
          <Link
            href="#login"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl px-4 py-3.5 text-center text-base font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Acessar conta
          </Link>
          <Button
            variant="header-accent"
            size="lg"
            className="w-full rounded-full font-semibold"
            asChild
          >
            <Link href="#planos" onClick={() => setMobileOpen(false)}>
              Comprar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
