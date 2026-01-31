import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden border-b border-border/40 bg-primary py-20 sm:py-24"
    >
      {/* Decorative shapes (Viral Loops style) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/5" />
        <div className="absolute right-1/3 top-1/2 size-8 rounded-full bg-white/20" />
      </div>
      <div className="container relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          Pare de perder noites com feedback bagunçado.
        </h2>
        <p className="mt-6 text-lg text-primary-foreground/90">
          Transforme comentários em ação — direto no site, com clareza e
          contexto. Aprovação rápida. Entrega no prazo. Menos estresse.
        </p>
        <Button
          size="lg"
          className="mt-10 min-w-[220px] bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          asChild
        >
          <Link href="#cta">Testar Grátis agora</Link>
        </Button>
        <p className="mt-4 text-sm text-primary-foreground/80">
          Sem cartão necessário. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
