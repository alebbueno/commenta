const steps = [
  { number: 1, title: "Instale o plugin no WordPress e ative." },
  { number: 2, title: "Acesse o site logado (você ou seu cliente)." },
  {
    number: 3,
    title:
      "A toolbar aparece flutuante — escolha pin, seta, círculo, área ou texto.",
  },
  {
    number: 4,
    title: "Clique no lugar exato → escreva o comentário → salve.",
  },
  {
    number: 5,
    title:
      "Tudo aparece no dashboard: tarefas claras, com status, atribuídas e histórico completo.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-b border-border/40 bg-muted/30 py-20 sm:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Passo a passo
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Como o Commenta funciona{" "}
          <span className="text-muted-foreground">(em menos de 2 minutos)</span>
        </h2>
        <div className="mt-16 space-y-12 md:space-y-16">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-2">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </span>
                <div className="h-px w-8 bg-border md:h-8 md:w-px" />
              </div>
              <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                {/* Área reservada para screenshot/GIF */}
                <div className="mt-6 aspect-video w-full max-w-md rounded-lg border border-border bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
                  Screenshot / GIF — placeholder
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm font-medium text-muted-foreground sm:text-base">
          Sem lentidão para visitantes. Sem iframes quebrados. React só carrega
          para quem usa.
        </p>
      </div>
    </section>
  );
}
