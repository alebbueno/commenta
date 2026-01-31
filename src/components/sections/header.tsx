"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";
import type { Locale } from "@/lib/locale";

const navKeys = [
  { key: "navRecursos" as const, href: "#recursos" },
  { key: "navDiferenciais" as const, href: "#diferenciais" },
  { key: "navPlanos" as const, href: "#planos" },
  { key: "navDepoimentos" as const, href: "#depoimentos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const navItems = navKeys.map(({ key, href }) => ({ label: t[key], href }));

  const switchLocale = (next: Locale) => {
    setLocale(next);
    setMobileOpen(false);
  };

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
          aria-label="Commenta"
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

        {/* Nav desktop */}
        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 md:flex"
          aria-label="Main"
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

        {/* Idioma + CTAs desktop */}
        <div className="hidden shrink-0 items-center gap-2 md:flex sm:gap-3">
          <div
            className="flex items-center rounded-full border border-white/20 bg-white/5 p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("pt")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                locale === "pt"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                locale === "en"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              EN
            </button>
          </div>
          <Link
            href="#login"
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white whitespace-nowrap"
          >
            {t.accessAccount}
          </Link>
          <Button
            variant="header-accent"
            size="sm"
            className="rounded-full font-semibold"
            asChild
          >
            <Link href="#planos">{t.buy}</Link>
          </Button>
        </div>

        {/* Mobile: idioma + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <div
            className="flex items-center rounded-full border border-white/20 bg-white/5 p-0.5"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLocale("pt")}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                locale === "pt"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                locale === "en"
                  ? "bg-white text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 hover:text-white"
            aria-label={locale === "pt" ? "Abrir menu" : "Open menu"}
          >
            <Menu className="size-6" />
          </button>
        </div>
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
            aria-label={locale === "pt" ? "Fechar menu" : "Close menu"}
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
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
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-white/70">
              {locale === "pt" ? "Idioma" : "Language"}
            </span>
            <div className="flex rounded-full border border-white/20 bg-white/5 p-0.5">
              <button
                type="button"
                onClick={() => switchLocale("pt")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  locale === "pt"
                    ? "bg-white text-black"
                    : "text-white/80 hover:text-white"
                )}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  locale === "en"
                    ? "bg-white text-black"
                    : "text-white/80 hover:text-white"
                )}
              >
                EN
              </button>
            </div>
          </div>
          <Link
            href="#login"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl px-4 py-3.5 text-center text-base font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            {t.accessAccount}
          </Link>
          <Button
            variant="header-accent"
            size="lg"
            className="w-full rounded-full font-semibold"
            asChild
          >
            <Link href="#planos" onClick={() => setMobileOpen(false)}>
              {t.buy}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
