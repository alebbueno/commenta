import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "Antes era print no WhatsApp, e-mail perdido, retrabalho. Com o Commenta o cliente marca direto na página. Aprovação em um dia, sem caos.",
    name: "Carla Mendes",
    role: "Diretora, Agência Flux",
    initial: "C",
    color: "bg-blue-500",
  },
  {
    quote:
      "A toolbar é muito intuitiva — quem usa Figma se vira na hora. Instalei no tema que já usamos e não deu conflito. Recomendo.",
    name: "Ricardo Souza",
    role: "Dev freelancer",
    initial: "R",
    color: "bg-emerald-500",
  },
  {
    quote:
      "Uso com o time e com o cliente no mesmo projeto. Cada um com suas tarefas, tudo visível. O branding removível fez valer o PRO.",
    name: "Fernanda Lima",
    role: "Designer, Studio N",
    initial: "F",
    color: "bg-violet-500",
  },
];

export function SocialProof() {
  return (
    <section
      id="depoimentos"
      className="border-b border-border/40 bg-background py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Depoimentos
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Quem usa não volta atrás
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Agências, devs e designers aprovando projetos sem caos.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className={cn(
                "flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm",
                "transition-all duration-200 hover:shadow-lg hover:shadow-foreground/5"
              )}
            >
              {/* Estrelas */}
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mt-4 flex-1">
                <Quote className="absolute -left-0.5 -top-0.5 size-8 text-primary/15" />
                <p className="relative pl-6 text-sm leading-relaxed text-foreground sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Autor */}
              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm",
                    t.color
                  )}
                >
                  {t.initial}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
