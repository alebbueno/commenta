# Commenta — Design System

Design system do projeto Commenta (landing e produto). Use como base para novas páginas e componentes. Referência visual: SaaS premium, pill buttons, padrão geométrico sutil (estilo Agenta).

---

## 1. Princípios

- **Premium SaaS:** tom profissional, hierarquia clara, CTAs evidentes.
- **Pill-first:** botões e pills com `rounded-full`; raios grandes em cards (`rounded-2xl`).
- **Contraste:** header/footer escuros; conteúdo em fundo claro; accent laranja para CTAs e destaques.
- **WordPress-only:** mensagem de produto exclusivo para sites em WordPress.

---

## 2. Cores

Definidas em `src/app/globals.css` e expostas via `@theme` para Tailwind v4.

### Tokens principais

| Token | Valor | Uso |
|-------|--------|-----|
| `--background` | `hsl(0 0% 100%)` | Fundo da página |
| `--foreground` | `hsl(222 47% 11%)` | Texto principal |
| `--primary` | `hsl(221 83% 53%)` | Azul primário (links, focus, alguns CTAs) |
| `--primary-foreground` | `hsl(0 0% 100%)` | Texto sobre primary |
| `--header-bg` | `hsl(0 0% 0%)` | Fundo do header/footer |
| `--header-fg` | `hsl(0 0% 100%)` | Texto no header/footer |
| `--header-accent` | `hsl(24 95% 53%)` | **Laranja** — CTAs principais, pills de destaque, frase em evidência no hero |
| `--card` | `hsl(0 0% 100%)` | Fundo de cards |
| `--muted` | `hsl(210 40% 96%)` | Fundos suaves |
| `--muted-foreground` | `hsl(215 16% 47%)` | Texto secundário |
| `--destructive` | `hsl(0 84% 60%)` | Erro, alertas, problema |
| `--border` | `hsl(214 32% 91%)` | Bordas |

### Uso no Tailwind

- Cores semânticas: `bg-background`, `text-foreground`, `bg-primary`, `text-header-accent`, `bg-muted`, `text-muted-foreground`, `border-border`, etc.
- Opacidade: `bg-black/90`, `text-white/70`, `border-white/10`, `bg-primary/10`.

---

## 3. Tipografia

- **Fontes:** Geist Sans (variável `--font-geist-sans`) e Geist Mono (`--font-geist-mono`), carregadas no `layout.tsx`.
- **Body:** `antialiased`; `font-feature-settings: "rlig" 1, "calt" 1`.

### Escala de títulos

| Elemento | Mobile | sm | md+ | Notas |
|----------|--------|-----|-----|--------|
| H1 (hero) | `text-3xl` | `text-4xl` | `text-5xl` / `lg:text-6xl` | `font-bold tracking-tight` |
| H2 (seção) | `text-2xl` | `text-3xl` | `text-4xl` | `font-bold tracking-tight` |
| H3 (card/sub) | `text-xl` / `text-2xl` | — | `sm:text-3xl` | `font-bold` ou `font-semibold` |

### Corpos e labels

- **Lead / destaque:** `text-base` a `text-xl`, `leading-relaxed`; cor `text-muted-foreground` ou `text-foreground`.
- **Label de seção (pill):** `text-xs` ou `text-sm`, `font-medium` ou `font-semibold`, `uppercase tracking-wider`, `text-muted-foreground`.
- **Caption / apoio:** `text-xs` ou `text-sm`, `text-muted-foreground`.

---

## 4. Espaçamento e layout

### Container

- Classe base: `container mx-auto max-w-6xl px-4 sm:px-6`.
- Seções mais estreitas: `max-w-4xl` ou `max-w-5xl` no container interno.

### Seções

- **Padding vertical:** `py-14 sm:py-20 md:py-24` (padrão de seção).
- **Borda inferior:** `border-b border-border/40` para separar seções.
- **Backgrounds:** `bg-background`, `bg-muted/20`, `bg-muted/30` (alternar levemente).

### Grid

- Hero: `grid gap-8 sm:gap-12 md:grid-cols-2 md:gap-20 lg:gap-24`.
- Listas de cards: `grid gap-4 sm:gap-6`; colunas `sm:grid-cols-2`, `lg:grid-cols-3` conforme necessário.
- Espaço entre título da seção e conteúdo: `mt-8 sm:mt-10 md:mt-14`.

### Scroll

- `html`: `scroll-behavior: smooth`; `scroll-padding-top: 5.5rem` (mobile) e `6rem` a partir de `sm`, para âncoras não ficarem atrás do header fixo.

---

## 5. Raios e bordas

- **Pill (botões, pills de label):** `rounded-full`.
- **Cards e blocos:** `rounded-2xl` (padrão); `rounded-xl` para cards menores ou listas.
- **Inputs / chips:** `rounded-lg` ou `rounded-xl`.
- **Tokens CSS:** `--radius` (0.5rem), `--radius-lg` (0.75rem), `--radius-pill` (9999px).

Bordas: `border border-border/50` ou `border-border/40`; em fundo escuro: `border-white/10`, `border-white/5`.

---

## 6. Componentes

### Button (`src/components/ui/button.tsx`)

- Base: `rounded-full`, `text-sm font-medium`, transições de cor; focus com `ring-2 ring-ring`.
- Utilitário: `cn()` de `@/lib/utils` para mesclar classes.

**Variantes:**

| Variant | Uso |
|---------|-----|
| `default` | CTA primário (azul) |
| `destructive` | Ações destrutivas |
| `outline` | Secundário, borda |
| `secondary` | Fundo muted |
| `ghost` | Sem borda/fundo |
| `link` | Aparência de link |
| `outline-inverse` | Borda branca em fundo escuro (header) |
| `header-accent` | CTA laranja no header/footer |
| `solid-inverse` | Fundo branco, texto laranja (ex.: card PRO) |

**Tamanhos:**

| Size | Altura | Uso |
|------|--------|-----|
| `default` | h-10, px-5 | Padrão |
| `sm` | h-9, px-4, text-xs | Header, footer |
| `lg` | h-12, px-8, text-base | Hero, CTAs principais |
| `xl` | h-14, px-10, text-lg | CTAs de destaque |
| `icon` | size-10 | Apenas ícone |

**Props:** `asChild` (Radix/shadcn pattern) para renderizar como `Link` ou outro elemento.

### Card (`src/components/ui/card.tsx`)

- Container: `rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md`.
- Subcomponentes: `CardHeader` (p-6, space-y-1.5), `CardTitle`, `CardDescription`, `CardContent` (p-6 pt-0), `CardFooter`.

Para cards de seção com visual mais “grande”: usar `rounded-2xl`, `shadow-xl`, `border-border/60`.

---

## 7. Padrão de seção (landing)

Estrutura típica de uma seção com título centralizado:

```tsx
<section id="..." className="border-b border-border/40 bg-background py-14 sm:py-20 md:py-24">
  <div className="container mx-auto max-w-6xl px-4 sm:px-6">
    {/* Cabeçalho da seção */}
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Label (ex.: Diferenciais)
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
        Título da seção
      </h2>
      <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
        Subtítulo opcional
      </p>
    </div>

    {/* Conteúdo */}
    <div className="mt-8 sm:mt-14">
      ...
    </div>
  </div>
</section>
```

### Label em pill (com ícone)

- Com ícone: `inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm`; ícone `size-4`; texto `text-sm font-medium text-muted-foreground`.
- Destaque (ex.: hero): `rounded-full border border-header-accent/40 bg-header-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-accent sm:text-sm`.
- Contexto semântico: ícone `text-destructive` para “problema”, `text-header-accent` para “benefício”.

---

## 8. Header e footer

### Header

- Container: `sticky top-0 z-50`; padding com safe area: classe `.safe-area-inset-top`.
- Barra: `max-w-6xl`, `rounded-2xl`, `bg-black/90 text-white backdrop-blur-xl`, `border border-white/5`, `shadow-lg shadow-black/20`.
- Altura: `h-14 min-h-[52px]` (mobile), `sm:h-16`.
- Nav: links `rounded-full px-4 py-2.5`, `text-white/85 hover:bg-white/10 hover:text-white`.
- CTA principal: variante `header-accent` (laranja).
- Idioma: toggle PT/EN em pills `rounded-full`, ativo `bg-white text-black`.
- Mobile: menu lateral; overlay com `bg-black/60 backdrop-blur-sm`; painel `bg-black/98`, `max-w-[min(100vw,28rem)]`, safe-area no topo e no rodapé; bloqueio de scroll no `body` quando aberto.

### Footer

- Fundo: `bg-black text-white`.
- Bordas: `border-white/10`.
- CTA band: `border-b border-white/10`; botão `header-accent`, em mobile `w-full` com `min-h-[44px]`.
- Links: `text-white/70 hover:text-white`.
- Grid: `sm:grid-cols-2 lg:grid-cols-5`; primeira coluna `lg:col-span-2` para logo + descrição.

---

## 9. Backgrounds e efeitos

- **Padrão geométrico (hero, etc.):** classe `.bg-geometric-pattern` — grid 32px com linhas `hsl(214 32% 91% / 0.4)`.
- **Blur:** `backdrop-blur-xl` (header), `backdrop-blur-sm` (overlay).
- **Sombras:** `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`; em destaque `shadow-primary/25`, `shadow-foreground/5`, etc.

---

## 10. Animações

- **Entrada suave:** classe `.animate-fade-in` (definida em `globals.css`): opacidade 0→1 e `translateY(6px)→0`, 0.25s ease-out.
- **Interação:** `transition-colors`, `transition-all duration-200`; hover com `hover:shadow-md`, `hover:-translate-y-0.5` onde fizer sentido.
- **Mobile (touch):** `active:scale-[0.98]` ou `active:bg-*` para feedback; `touch-manipulation` em botões/toggles; alvos de toque `min-h-[44px]` ou `min-h-[48px]`.

---

## 11. Ícones

- **Biblioteca:** `lucide-react`.
- **Tamanhos:** `size-4` (inline com texto pequeno), `size-5`, `size-6` (títulos e CTAs), `size-8` em destaques.
- Manter consistência de stroke e estilo (padrão Lucide).

---

## 12. Acessibilidade e mobile

- **Focus:** botões e links com `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Âncoras:** IDs estáveis (`#planos`, `#recursos`, `#diferenciais`, `#depoimentos`, etc.); scroll com `scroll-padding-top` para o header fixo.
- **Mobile:** touch targets ≥ 44px; menu com `aria-modal`, `aria-label`; overlay clicável para fechar.
- **Safe area:** `.safe-area-inset-top` e `env(safe-area-inset-bottom)` onde houver conteúdo colado nas bordas do dispositivo.

---

## 13. Utilitários

- **Merge de classes:** `cn(...)` de `@/lib/utils` (clsx + tailwind-merge) em todos os componentes.
- **Cores de ícone em cards:** usar tokens ou cores Tailwind consistentes (ex.: `bg-blue-500`, `bg-emerald-500`, `bg-header-accent`) para ícones em círculos/quadrados.

---

## 14. Checklist para nova página/componente

- [ ] Usar cores e tipografia do design system (tokens CSS / classes semânticas).
- [ ] Seções com `border-b border-border/40` e padding `py-14 sm:py-20 md:py-24`.
- [ ] Botões com variante e size adequados; CTAs principais em `header-accent` ou `default`.
- [ ] Cards com `rounded-2xl` ou `rounded-xl`, borda e sombra suave.
- [ ] Labels de seção em pill com `uppercase tracking-wider` e cor muted ou accent.
- [ ] Container `max-w-6xl` (ou menor) com `px-4 sm:px-6`.
- [ ] Mobile: touch targets ≥ 44px; evitar texto pequeno demais; testar menu e scroll.
- [ ] Textos e CTAs via traduções (`useLocale()`, `t.*`) quando a página for multi-idioma.

---

*Documento gerado a partir do estado atual do projeto Commenta. Atualize este MD ao evoluir o design system.*
