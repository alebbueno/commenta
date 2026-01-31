import Link from "next/link";
import { CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background bg-geometric-pattern">
      <div className="container mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2 md:gap-20 md:py-28 lg:gap-24 lg:py-32">
        <div className="flex flex-col justify-center text-center md:text-left">
          {/* Pre-headline (estilo Agenta) */}
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Plugin WordPress para feedback visual
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.08]">
            Chega de prints perdidos e{" "}
            <span className="text-muted-foreground">
              &ldquo;ajusta ali em cima&rdquo;
            </span>{" "}
            que ninguém entende.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-8 sm:text-xl sm:leading-relaxed">
            Você e seu cliente comentam direto na página do site. Pins, setas,
            círculos — tudo vira tarefa clara, com contexto visual. Sem WhatsApp
            infinito, sem e-mail perdido, sem retrabalho. Só aprovação rápida e
            entrega no prazo.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start sm:mt-12">
            <Button
              size="lg"
              className="min-w-[220px] shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 sm:min-w-[240px]"
              asChild
            >
              <Link href="#planos">Testar Grátis por 14 dias (sem cartão)</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px] border-2 transition-all hover:bg-muted/50 hover:-translate-y-0.5"
              asChild
            >
              <Link href="#planos">Ver planos</Link>
            </Button>
          </div>
          {/* Value props com ícones (estilo Agenta) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4 shrink-0" />
              Sem cartão necessário
            </span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0" />
              14 dias grátis
            </span>
          </div>
          <p className="mt-10 text-sm text-muted-foreground md:mt-12">
            Já usado por +80 agências e freelancers que cansaram do caos de
            aprovação
          </p>
        </div>

        <div className="relative flex items-center justify-center md:justify-end">
          <div className="relative w-full max-w-[420px]">
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
