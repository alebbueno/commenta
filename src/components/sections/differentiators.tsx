"use client";

import { useState } from "react";
import {
  MessageCircle,
  MousePointer,
  Plug,
  Users,
  Circle,
  Square,
  Pencil,
  Pin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  {
    icon: MousePointer,
    title: "Toolbar estilo Figma",
    iconBg: "bg-sky-500",
    content: <ToolbarMockup />,
  },
  {
    icon: Plug,
    title: "Qualquer tema WordPress",
    iconBg: "bg-teal-600",
    content: <WordPressMockup />,
  },
  {
    icon: Users,
    title: "Múltiplos usuários",
    iconBg: "bg-violet-600",
    content: <UsersMockup />,
  },
  {
    icon: MessageCircle,
    title: "Comentários visuais de verdade",
    iconBg: "bg-blue-600",
    content: <CommentsMockup />,
  },
];

function ToolbarMockup() {
  const tools = [
    { Icon: MousePointer, label: "Seleção", active: true },
    { Icon: MessageCircle, label: "Comentário" },
    { Icon: ArrowRight, label: "Seta" },
    { Icon: Circle, label: "Círculo" },
    { Icon: Square, label: "Área" },
    { Icon: Pencil, label: "Desenho" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Interface familiar
        </p>
        <p className="mt-1 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          Barra de ferramentas moderna e intuitiva. Quem usa Figma já sabe usar.
        </p>
      </div>
      <div className="rounded-2xl bg-muted/40 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border/50 bg-card px-3 py-2.5 shadow-sm">
          {tools.map(({ Icon, label, active }) => (
            <button
              key={label}
              type="button"
              className={cn(
                "flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted hover:text-foreground"
              )}
              title={label}
            >
              <Icon className="size-5" />
            </button>
          ))}
          <span className="mx-2 h-5 w-px bg-border" />
          <span className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            Commenta
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Ferramentas de anotação sempre à mão, sem sair da página.
        </p>
      </div>
    </div>
  );
}

function WordPressMockup() {
  const themes = [
    { name: "Astra", slug: "astra" },
    { name: "Kadence", slug: "kadence" },
    { name: "GeneratePress", slug: "generatepress" },
    { name: "OceanWP", slug: "oceanwp" },
    { name: "Neve", slug: "neve" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Compatibilidade
        </p>
        <p className="mt-1 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          Funciona em temas atuais, sem conflitos. Instale, ative e use.
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {themes.map(({ name, slug }) => (
            <div
              key={slug}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <span className="truncate text-sm font-medium text-foreground">
                {name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Plug className="size-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">+ qualquer tema.</span>{" "}
            Zero configuração extra.
          </p>
        </div>
      </div>
    </div>
  );
}

function UsersMockup() {
  const people = [
    { name: "Maria", role: "Cliente", color: "bg-blue-500", tasks: 2 },
    { name: "João", role: "Dev", color: "bg-emerald-500", tasks: 5 },
    { name: "Ana", role: "Design", color: "bg-amber-500", tasks: 3 },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Colaboração
        </p>
        <p className="mt-1 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          Time e cliente no mesmo projeto, com atribuição clara.{" "}
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-sm font-medium text-primary">
            PRO
          </span>
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50 p-4 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Projeto: Homepage v2
        </p>
        <div className="space-y-3">
          {people.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 rounded-xl border border-border/40 bg-background p-3 transition-shadow hover:shadow-sm"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm",
                  p.color
                )}
              >
                {p.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {p.tasks} tarefas
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsMockup() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Feedback na página
        </p>
        <p className="mt-1 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          Pins, setas e círculos direto na página. Seu cliente aponta; você
          entende na hora.
        </p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-sm">
        {/* Browser chrome fake */}
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-3 py-2">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 flex-1 rounded bg-muted/60 py-1 text-center text-[10px] text-muted-foreground">
            meusite.com.br/pagina
          </span>
        </div>
        <div className="relative aspect-video bg-gradient-to-b from-muted/30 to-muted/50 p-5">
          {/* Conteúdo fake da página */}
          <div className="mx-auto max-w-md space-y-2 rounded-lg bg-background/80 p-4">
            <div className="h-2.5 w-4/5 rounded bg-muted-foreground/20" />
            <div className="h-2.5 w-3/4 rounded bg-muted-foreground/15" />
            <div className="h-2.5 w-full rounded bg-muted-foreground/10" />
            <div className="h-2.5 w-2/3 rounded bg-muted-foreground/10" />
          </div>
          {/* Pin */}
          <div className="absolute left-6 top-8 flex flex-col items-start gap-1">
            <span className="flex size-9 items-center justify-center rounded-lg border-2 border-amber-500/80 bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-950/30 dark:text-amber-400">
              <Pin className="size-4" />
            </span>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-sm dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              Ajustar título aqui
            </span>
          </div>
          {/* Seta */}
          <div className="absolute right-8 top-1/2 flex flex-col items-end gap-1">
            <span className="flex size-9 items-center justify-center rounded-lg border-2 border-blue-500/80 bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950/30 dark:text-blue-400">
              <ArrowRight className="size-4" />
            </span>
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 shadow-sm dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
              Mover para cima
            </span>
          </div>
          {/* Círculo */}
          <div className="absolute bottom-10 left-1/2 flex flex-col items-center gap-1">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-rose-500/80 bg-rose-50 text-rose-600 shadow-sm dark:bg-rose-950/30 dark:text-rose-400">
              <Circle className="size-4" strokeWidth={3} />
            </span>
            <span className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 shadow-sm dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
              Corrigir texto
            </span>
          </div>
        </div>
        <p className="border-t border-border/40 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
          Comentários fixos no layout. Clique e responda no contexto.
        </p>
      </div>
    </div>
  );
}

export function Differentiators() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = cards[activeIndex];

  return (
    <section
      id="diferenciais"
      className="border-b border-border/40 bg-muted/30 py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Diferenciais
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Por que quem usa não volta atrás
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tudo que você precisa para aprovar projetos sem caos.
          </p>
        </div>

        <div className="mt-14 grid min-h-[480px] gap-8 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          {/* Coluna esquerda: cards empilhados */}
          <div className="flex flex-col gap-2.5">
            {cards.map(({ icon: Icon, title, iconBg }, i) => (
              <article
                key={title}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-200",
                  activeIndex === i
                    ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                    : "border-border/50 bg-card shadow-sm hover:border-border hover:bg-muted/40 hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
                    iconBg
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold leading-snug text-foreground">
                  {title}
                </h3>
              </article>
            ))}
          </div>

          {/* Coluna direita: mockup com transição */}
          <div className="min-h-[420px] md:pl-2">
            <div
              key={activeIndex}
              className="animate-fade-in"
            >
              {active?.content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
