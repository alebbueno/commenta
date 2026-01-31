import {
  Header,
  Hero,
  Problem,
  CommentaPresentation,
  Differentiators,
  Pricing,
  SocialProof,
  Footer,
} from "@/components/sections";

/**
 * Commenta — Landing Page de vendas (SaaS premium)
 * Estrutura: Hero → Problema → Apresentação → Diferenciais → Planos → Depoimentos → Footer
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Problem />
      <CommentaPresentation />
      <Differentiators />
      <Pricing />
      <SocialProof />
      <Footer />
    </main>
  );
}
