import type { Locale } from "./locale";

export const translations = {
  pt: {
    // Header
    navRecursos: "Recursos",
    navDiferenciais: "Diferenciais",
    navPlanos: "Planos",
    navDepoimentos: "Depoimentos",
    accessAccount: "Acessar conta",
    buy: "Comprar",

    // Hero
    heroPreHeadline: "Plugin WordPress para feedback visual",
    heroHeadline: "Chega de prints perdidos e ",
    heroHeadlineMuted: '"ajusta ali em cima" que ninguém entende.',
    heroSub:
      "Você e seu cliente comentam direto na página do site. Pins, setas, círculos — tudo vira tarefa clara, com contexto visual. Sem WhatsApp infinito, sem e-mail perdido, sem retrabalho. Só aprovação rápida e entrega no prazo.",
    heroCtaPrimary: "Testar Grátis por 14 dias (sem cartão)",
    heroCtaSecondary: "Ver planos",
    heroNoCard: "Sem cartão necessário",
    heroDaysFree: "14 dias grátis",
    heroSocialProof: "Já usado por +80 agências e freelancers que cansaram do caos de aprovação",

    // Problem
    problemLabel: "O problema",
    problemTitle: "O feedback atual está matando sua produtividade ",
    problemTitleMuted: "(e sua sanidade)",
    problemSub: "Se você se reconhece em pelo menos um desses, não é culpa sua — é o processo.",
    problemBullets: [
      "Prints espalhados no WhatsApp que somem no dia seguinte",
      '"Muda aquele botão ali" e ninguém sabe onde é "ali"',
      "Cliente aprova hoje, lembra de 8 coisas amanhã",
      "Histórico some → você refaz o mesmo ajuste 3 vezes",
      "Aprovação que deveria levar 2 dias vira 2 semanas de pingue-pongue",
    ],

    // Commenta presentation (recursos)
    recursosLabel: "O que você ganha",
    recursosTitle: "Resultados melhores de aprovação ",
    recursosTitleLine2: "com mínimo esforço.",
    recursosComments: "Comentários",
    recursosTasksLabel: "Tarefas concluídas",
    recursosMetrics: ["Pins", "Setas", "Áreas"],
    recursosCardTitle: "Feedback que vira código",
    recursosCardSub:
      "Mantenha o time alinhado e leve o feedback do cliente direto para a implementação, sem WhatsApp nem e-mail perdido.",
    recursosFeatures: [
      "Comentários visuais na página — pins, setas, círculos e áreas destacadas.",
      "Cada comentário vira tarefa com screenshot e contexto preservado.",
      "Dashboard para acompanhar, atribuir e fechar tudo em um lugar.",
    ],
    recursosCta: "Experimente agora (grátis)",

    // Differentiators
    diffLabel: "Diferenciais",
    diffTitle: "Por que quem usa não volta atrás",
    diffSub: "Tudo que você precisa para aprovar projetos sem caos.",
    diffCardToolbar: "Toolbar estilo Figma",
    diffCardWordPress: "Qualquer tema WordPress",
    diffCardUsers: "Múltiplos usuários",
    diffCardComments: "Comentários visuais de verdade",
    // Mockup copy
    diffToolbarLabel: "Interface familiar",
    diffToolbarTitle: "Barra de ferramentas moderna e intuitiva. Quem usa Figma já sabe usar.",
    diffToolbarHint: "Ferramentas de anotação sempre à mão, sem sair da página.",
    diffWPLabel: "Compatibilidade",
    diffWPTitle: "Funciona em temas atuais, sem conflitos. Instale, ative e use.",
    diffWPAny: "+ qualquer tema.",
    diffWPZero: "Zero configuração extra.",
    diffUsersLabel: "Colaboração",
    diffUsersTitle: "Time e cliente no mesmo projeto, com atribuição clara. ",
    diffUsersProject: "Projeto: Homepage v2",
    diffUsersTasks: (n: number) => `${n} tarefas`,
    diffCommentsLabel: "Feedback na página",
    diffCommentsTitle: "Pins, setas e círculos direto na página. Seu cliente aponta; você entende na hora.",
    diffCommentsPin: "Ajustar título aqui",
    diffCommentsArrow: "Mover para cima",
    diffCommentsCircle: "Corrigir texto",
    diffCommentsFooter: "Comentários fixos no layout. Clique e responda no contexto.",

    // Pricing (PT: BRL)
    pricingLabel: "Planos e preços",
    pricingTitle: "Preços simples e flexíveis",
    pricingSub:
      "Veja os planos, escolha o que faz sentido para você e comece a aprovar projetos sem caos. Sempre grátis para começar.",
    pricingMonthly: "Mensal",
    pricingAnnual: "Anual",
    pricingSave: "Economize",
    pricingOff: "off",
    pricingProDesc: "Acesso completo: todas as ferramentas visuais, usuários ilimitados e sem branding.",
    pricingPerMonth: "/ mês",
    pricingPerYear: "/ ano",
    pricingBillingAnnual: "Cobrança anual",
    pricingBillingMonthly: "Cobrança mensal. Cancele quando quiser.",
    pricingCtaPro: "Começar agora",
    pricingCtaFree: "Começar grátis",
    pricingFree: "Grátis",
    pricingForever: "Para sempre",
    pricingFreeDesc: "Comece de graça com pins, áreas destacadas e comentários textuais.",
    pricingFreeFeatures: [
      "Pins e áreas destacadas",
      "Comentários textuais",
      "1 usuário",
      "Branding Commenta visível",
      "Dashboard básico",
    ],
    pricingProFeatures: [
      "Todas ferramentas visuais (setas, círculos, textos livres)",
      "Usuários ilimitados",
      "Dashboard completo + filtros e atribuição",
      "Remoção total de branding",
      "Suporte prioritário",
    ],
    pricingFootnote:
      "A maioria começa no FREE e já sente a diferença. Quando o time cresce ou o cliente pede mais clareza → o PRO se paga sozinho na primeira entrega mais rápida.",

    // Social proof
    testimonialsLabel: "Depoimentos",
    testimonialsTitle: "Quem usa não volta atrás",
    testimonialsSub: "Agências, devs e designers aprovando projetos sem caos.",
    testimonials: [
      {
        quote:
          "Antes era print no WhatsApp, e-mail perdido, retrabalho. Com o Commenta o cliente marca direto na página. Aprovação em um dia, sem caos.",
        name: "Carla Mendes",
        role: "Diretora, Agência Flux",
        initial: "C",
      },
      {
        quote:
          "A toolbar é muito intuitiva — quem usa Figma se vira na hora. Instalei no tema que já usamos e não deu conflito. Recomendo.",
        name: "Ricardo Souza",
        role: "Dev freelancer",
        initial: "R",
      },
      {
        quote:
          "Uso com o time e com o cliente no mesmo projeto. Cada um com suas tarefas, tudo visível. O branding removível fez valer o PRO.",
        name: "Fernanda Lima",
        role: "Designer, Studio N",
        initial: "F",
      },
    ],
    testimonialsMore: "Saiba mais",

    // Footer
    footerCtaTitle: "Pronto para aprovar projetos sem caos?",
    footerCtaSub: "Teste 14 dias grátis. Sem cartão.",
    footerCtaButton: "Começar grátis",
    footerDescription:
      "Plugin WordPress para feedback visual. Comentários que viram tarefa, direto na página. Aprovação rápida, sem WhatsApp infinito.",
    footerProduct: "Produto",
    footerSupport: "Suporte",
    footerLegal: "Legal",
    footerTerms: "Termos",
    footerPrivacy: "Privacidade",
    footerCopyright: "Todos os direitos reservados.",
  },

  en: {
    navRecursos: "Features",
    navDiferenciais: "Why us",
    navPlanos: "Pricing",
    navDepoimentos: "Testimonials",
    accessAccount: "Log in",
    buy: "Get started",

    heroPreHeadline: "WordPress plugin for visual feedback",
    heroHeadline: "Stop losing screenshots and ",
    heroHeadlineMuted: '"move that thing up" that nobody understands.',
    heroSub:
      "You and your client comment right on the page. Pins, arrows, circles — everything becomes a clear task with visual context. No endless WhatsApp, no lost emails, no rework. Just fast approval and on-time delivery.",
    heroCtaPrimary: "Try free for 14 days (no card)",
    heroCtaSecondary: "See pricing",
    heroNoCard: "No card required",
    heroDaysFree: "14-day free trial",
    heroSocialProof: "Used by 80+ agencies and freelancers who got tired of approval chaos",

    problemLabel: "The problem",
    problemTitle: "Current feedback is killing your productivity ",
    problemTitleMuted: "(and your sanity)",
    problemSub: "If you recognize at least one of these, it's not your fault — it's the process.",
    problemBullets: [
      "Screenshots scattered on WhatsApp that vanish the next day",
      '"Change that button there" and nobody knows where "there" is',
      "Client approves today, remembers 8 things tomorrow",
      "History disappears → you redo the same fix 3 times",
      "Approval that should take 2 days turns into 2 weeks of back-and-forth",
    ],

    recursosLabel: "What you get",
    recursosTitle: "Better approval results ",
    recursosTitleLine2: "with minimal effort.",
    recursosComments: "Comments",
    recursosTasksLabel: "Tasks completed",
    recursosMetrics: ["Pins", "Arrows", "Areas"],
    recursosCardTitle: "Feedback that turns into code",
    recursosCardSub:
      "Keep the team aligned and bring client feedback straight into implementation — no WhatsApp, no lost emails.",
    recursosFeatures: [
      "Visual comments on the page — pins, arrows, circles, and highlighted areas.",
      "Every comment becomes a task with screenshot and context preserved.",
      "Dashboard to track, assign, and close everything in one place.",
    ],
    recursosCta: "Try it free",

    diffLabel: "Why us",
    diffTitle: "Why users don't look back",
    diffSub: "Everything you need to approve projects without chaos.",
    diffCardToolbar: "Figma-style toolbar",
    diffCardWordPress: "Any WordPress theme",
    diffCardUsers: "Multiple users",
    diffCardComments: "Real visual comments",
    diffToolbarLabel: "Familiar interface",
    diffToolbarTitle: "Modern, intuitive toolbar. If you use Figma, you already know how.",
    diffToolbarHint: "Annotation tools always at hand, without leaving the page.",
    diffWPLabel: "Compatibility",
    diffWPTitle: "Works with current themes, no conflicts. Install, activate, and go.",
    diffWPAny: "+ any theme.",
    diffWPZero: "Zero extra setup.",
    diffUsersLabel: "Collaboration",
    diffUsersTitle: "Team and client in the same project, with clear assignment. ",
    diffUsersProject: "Project: Homepage v2",
    diffUsersTasks: (n: number) => `${n} tasks`,
    diffCommentsLabel: "Feedback on the page",
    diffCommentsTitle: "Pins, arrows, and circles right on the page. Your client points; you get it.",
    diffCommentsPin: "Adjust title here",
    diffCommentsArrow: "Move up",
    diffCommentsCircle: "Fix text",
    diffCommentsFooter: "Comments fixed to the layout. Click and reply in context.",

    pricingLabel: "Plans and pricing",
    pricingTitle: "Simple, flexible pricing",
    pricingSub:
      "See the plans, pick what works for you, and start approving projects without chaos. Always free to start.",
    pricingMonthly: "Monthly",
    pricingAnnual: "Annual",
    pricingSave: "Save",
    pricingOff: "off",
    pricingProDesc: "Full access: all visual tools, unlimited users, no branding.",
    pricingPerMonth: "/ mo",
    pricingPerYear: "/ yr",
    pricingBillingAnnual: "Billed annually",
    pricingBillingMonthly: "Billed monthly. Cancel anytime.",
    pricingCtaPro: "Get started",
    pricingCtaFree: "Start free",
    pricingFree: "Free",
    pricingForever: "Forever",
    pricingFreeDesc: "Start for free with pins, highlighted areas, and text comments.",
    pricingFreeFeatures: [
      "Pins and highlighted areas",
      "Text comments",
      "1 user",
      "Commenta branding visible",
      "Basic dashboard",
    ],
    pricingProFeatures: [
      "All visual tools (arrows, circles, freeform text)",
      "Unlimited users",
      "Full dashboard + filters and assignment",
      "Complete branding removal",
      "Priority support",
    ],
    pricingFootnote:
      "Most start on FREE and feel the difference right away. When the team grows or the client wants more clarity → PRO pays for itself with the first faster delivery.",

    testimonialsLabel: "Testimonials",
    testimonialsTitle: "Users don't look back",
    testimonialsSub: "Agencies, devs, and designers approving projects without chaos.",
    testimonials: [
      {
        quote:
          "Before: screenshots on WhatsApp, lost emails, rework. With Commenta the client marks right on the page. Approval in a day, no chaos.",
        name: "Carla Mendes",
        role: "Director, Flux Agency",
        initial: "C",
      },
      {
        quote:
          "The toolbar is very intuitive — anyone who uses Figma gets it right away. I installed it on our theme and no conflicts. Recommended.",
        name: "Ricardo Souza",
        role: "Freelance dev",
        initial: "R",
      },
      {
        quote:
          "I use it with the team and the client on the same project. Everyone has their tasks, everything visible. Removable branding made PRO worth it.",
        name: "Fernanda Lima",
        role: "Designer, Studio N",
        initial: "F",
      },
    ],
    testimonialsMore: "Learn more",

    footerCtaTitle: "Ready to approve projects without chaos?",
    footerCtaSub: "Try 14 days free. No card.",
    footerCtaButton: "Start free",
    footerDescription:
      "WordPress plugin for visual feedback. Comments that become tasks, right on the page. Fast approval, no endless WhatsApp.",
    footerProduct: "Product",
    footerSupport: "Support",
    footerLegal: "Legal",
    footerTerms: "Terms",
    footerPrivacy: "Privacy",
    footerCopyright: "All rights reserved.",
  },
} as const;

export type TranslationKeys = keyof (typeof translations)["pt"];

// Pricing numbers: PT = BRL, EN = USD
export const pricingByLocale: Record<
  Locale,
  { monthly: number; annual: number; currency: string; format: (n: number) => string }
> = {
  pt: {
    monthly: 39.9,
    annual: 299,
    currency: "R$",
    format: (n) => n.toFixed(2).replace(".", ","),
  },
  en: {
    monthly: 9.99,
    annual: 79,
    currency: "$",
    format: (n) => n.toFixed(2),
  },
};
