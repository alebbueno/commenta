"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";

export function Footer() {
  const { t, locale } = useLocale();

  const productLabels = [t.navRecursos, t.navDiferenciais, t.navPlanos];
  const supportLabels = [
    t.navDepoimentos,
    locale === "pt" ? "Suporte" : "Support",
    locale === "pt" ? "Contato" : "Contact",
  ];
  const legalLabels = [t.footerTerms, t.footerPrivacy];

  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t.footerProduct,
      links: [
        { label: productLabels[0], href: "#recursos" },
        { label: productLabels[1], href: "#diferenciais" },
        { label: productLabels[2], href: "#planos" },
      ],
    },
    {
      title: t.footerSupport,
      links: [
        { label: supportLabels[0], href: "#depoimentos" },
        { label: supportLabels[1], href: "#suporte" },
        { label: supportLabels[2], href: "#contato" },
      ],
    },
    {
      title: t.footerLegal,
      links: [
        { label: legalLabels[0], href: "#termos" },
        { label: legalLabels[1], href: "#privacidade" },
      ],
    },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="border-b border-white/10">
        <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-base font-semibold text-white sm:text-lg">
                {t.footerCtaTitle}
              </p>
              <p className="mt-1 text-sm text-white/70">{t.footerCtaSub}</p>
            </div>
            <Button
              variant="header-accent"
              size="sm"
              className="h-11 w-full min-h-[44px] shrink-0 rounded-full sm:w-auto"
              asChild
            >
              <Link href="#planos">{t.footerCtaButton}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block" aria-label="Commenta">
              <Image
                src="/commenta.png"
                alt="Commenta"
                width={140}
                height={41}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {t.footerDescription}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <Mail className="size-4 shrink-0" />
              <a
                href="mailto:contato@commenta.com.br"
                className="hover:text-white"
              >
                contato@commenta.com.br
              </a>
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {group.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "text-sm text-white/70 transition-colors hover:text-white"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:flex-row sm:pt-8">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Commenta. {t.footerCopyright}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#termos" className="text-white/60 hover:text-white/80">
              {t.footerTerms}
            </Link>
            <Link
              href="#privacidade"
              className="text-white/60 hover:text-white/80"
            >
              {t.footerPrivacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
