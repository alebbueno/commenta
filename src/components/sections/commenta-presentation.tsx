import Link from "next/link";
import { Check, Sparkles, MessageSquare, MousePointer, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
const features = [
  "Comentários visuais na página — pins, setas, círculos e áreas destacadas.",
  "Cada comentário vira tarefa com screenshot e contexto preservado.",
  "Dashboard para acompanhar, atribuir e fechar tudo em um lugar.",
];

const metrics = [
  { icon: MessageSquare, label: "Pins", value: 85 },
  { icon: MousePointer, label: "Setas", value: 72 },
  { icon: Layout, label: "Áreas", value: 90 },
];

export function CommentaPresentation() {
  return (
    <section
      id="recursos"
      className="border-b border-border/40 bg-muted/20 py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Label em pill + Título em 2 linhas */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <Sparkles className="size-4 text-header-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              O que você ganha
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Resultados melhores de aprovação{" "}
            <span className="block text-foreground">com mínimo esforço.</span>
          </h2>
        </div>

        {/* Card grande: visual à esquerda, texto à direita */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-foreground/5">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:gap-12 lg:p-10">
            {/* Lado esquerdo: cards sobrepostos (estilo data viz) */}
            <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[320px]">
              {/* Card de fundo (recuado) */}
              <div className="absolute right-0 top-1/2 w-[85%] -translate-y-1/2 rounded-2xl border border-border/60 bg-muted/40 p-5 shadow-lg">
                <p className="text-xs font-medium text-muted-foreground">
                  Comentários
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  94
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {m.value}%
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary/40 to-header-accent/60"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Card em destaque (frente) */}
              <div className="relative z-10 w-[90%] rounded-2xl border border-border bg-card p-6 shadow-xl">
                <p className="text-sm font-medium text-muted-foreground">
                  Tarefas concluídas
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  87%
                </p>
                <div className="mt-5 space-y-4">
                  {metrics.map(({ icon: Icon, label, value }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Icon className="size-4" />
                          </span>
                          {label}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {value}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary/50 to-header-accent/70"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lado direito: texto + bullets + CTA */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Feedback que vira código
              </h3>
              <p className="mt-4 text-muted-foreground">
                Mantenha o time alinhado e leve o feedback do cliente direto para
                a implementação, sem WhatsApp nem e-mail perdido.
              </p>
              <ul className="mt-6 space-y-4">
                {features.map((text) => (
                  <li key={text.slice(0, 30)} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground/20 bg-muted/50">
                      <Check className="size-3.5 text-foreground" />
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8 w-fit" asChild>
                <Link href="#planos">Experimente agora (grátis)</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
