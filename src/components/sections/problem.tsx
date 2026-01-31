import {
  MessageSquareOff,
  ShieldAlert,
  Loader2,
  Layout,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bullets = [
  {
    icon: MessageSquareOff,
    text: "Prints espalhados no WhatsApp que somem no dia seguinte",
  },
  {
    icon: ShieldAlert,
    text: '"Muda aquele botão ali" e ninguém sabe onde é "ali"',
  },
  {
    icon: Loader2,
    text: "Cliente aprova hoje, lembra de 8 coisas amanhã",
  },
  {
    icon: Layout,
    text: "Histórico some → você refaz o mesmo ajuste 3 vezes",
  },
  {
    icon: Users,
    text: "Aprovação que deveria levar 2 dias vira 2 semanas de pingue-pongue",
  },
];

export function Problem() {
  return (
    <section
      id="problema"
      className="border-b border-border/40 bg-background py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Label em pill + Título */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
            <AlertCircle className="size-4 text-destructive" />
            <span className="text-sm font-medium text-muted-foreground">
              O problema
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            O feedback atual está matando sua produtividade{" "}
            <span className="text-muted-foreground">(e sua sanidade)</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Se você se reconhece em pelo menos um desses, não é culpa sua — é o
            processo.
          </p>
        </div>

        {/* Lista de problemas em cards */}
        <ul className="mt-12 space-y-4 sm:space-y-5">
          {bullets.map(({ icon: Icon, text }) => (
            <li
              key={text.slice(0, 24)}
              className={cn(
                "group flex items-start gap-5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 sm:gap-6 sm:p-6",
                "hover:-translate-y-0.5 hover:shadow-md hover:border-border/80"
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors group-hover:bg-destructive/15 sm:size-12">
                <Icon className="size-5 sm:size-6" />
              </span>
              <p className="flex-1 pt-0.5 text-base font-medium leading-relaxed text-foreground sm:text-lg">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
