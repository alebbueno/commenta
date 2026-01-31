# Commenta — Landing Page

Landing page de vendas de alta conversão para o plugin WordPress **Commenta**.  
Referência visual e estrutural: Viral Loops (ritmo, grid, alternância texto/imagem, CTAs, sensação SaaS premium).

## Stack

- **Next.js** (App Router)
- **Tailwind CSS** v4
- **shadcn/ui** (Button, Card + utilitários)
- **lucide-react** (ícones)
- **Supabase** (mock em `src/lib/supabase-mock.ts` — sem integração real)
- **Vercel-ready**

## Estrutura da página

1. **Hero** — Headline, subheadline, CTA primário/secundário, prova social, mockup
2. **Problema** — 5 bullets com ícones (fundo cinza claro)
3. **Transição** — Frase única centralizada
4. **Apresentação Commenta** — Texto + mockup (layout alternado)
5. **Como funciona** — 5 passos + área para screenshots/GIFs + legenda
6. **Diferenciais** — Grid de 7 cards (ícone, título, descrição)
7. **Planos** — FREE vs PRO (tabela desktop, cards mobile)
8. **Prova social** — 3 depoimentos
9. **CTA final** — Frase forte, CTA, “Sem cartão necessário”
10. **Footer** — Logo, links, disclaimer

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build e deploy

```bash
npm run build
npm start
```

Deploy na Vercel: conectar o repositório e usar o build padrão do Next.js.

## Código

- **Componentes UI:** `src/components/ui/` (Button, Card)
- **Seções:** `src/components/sections/` (Hero, Problem, Pricing, etc.)
- **Utilitários:** `src/lib/utils.ts` (cn), `src/lib/supabase-mock.ts`
- **Copy:** placeholders em todos os blocos; substituir por copy real depois.

## Performance

- Layout mobile-first
- Componentização clara para tree-shaking
- Sem libs desnecessárias
- Prioridade em LCP (conteúdo acima da dobra no HTML inicial)
