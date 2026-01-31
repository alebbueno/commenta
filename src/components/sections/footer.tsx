import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = {
  Produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Diferenciais", href: "#diferenciais" },
    { label: "Planos", href: "#planos" },
  ],
  Suporte: [
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Suporte", href: "#suporte" },
    { label: "Contato", href: "#contato" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#termos" },
    { label: "Privacidade", href: "#privacidade" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-lg font-semibold text-white">
                Pronto para aprovar projetos sem caos?
              </p>
              <p className="mt-1 text-sm text-white/70">
                Teste 14 dias grátis. Sem cartão.
              </p>
            </div>
            <Button
              variant="header-accent"
              size="sm"
              className="shrink-0 rounded-full"
              asChild
            >
              <Link href="#planos">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo + descrição */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block" aria-label="Commenta - início">
              <Image
                src="/commenta.png"
                alt="Commenta"
                width={140}
                height={41}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Plugin WordPress para feedback visual. Comentários que viram
              tarefa, direto na página. Aprovação rápida, sem WhatsApp infinito.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/70">
              <Mail className="size-4 shrink-0" />
              <a href="mailto:contato@commenta.com.br" className="hover:text-white">
                contato@commenta.com.br
              </a>
            </div>
          </div>

          {/* Links por grupo */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/90">
                {group}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
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

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Commenta. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#termos" className="text-white/60 hover:text-white/80">
              Termos
            </Link>
            <Link href="#privacidade" className="text-white/60 hover:text-white/80">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
