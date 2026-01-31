/**
 * Supabase — mock apenas (sem integração real).
 * Use para simular dados (ex: planos, depoimentos) até conectar ao Supabase.
 */

export type PlanSlug = "free" | "pro";

export interface MockPlan {
  slug: PlanSlug;
  name: string;
  price: number;
  currency: string;
}

export const mockPlans: MockPlan[] = [
  { slug: "free", name: "FREE", price: 0, currency: "BRL" },
  { slug: "pro", name: "PRO", price: 0, currency: "BRL" }, // placeholder
];

export function getMockPlans(): Promise<MockPlan[]> {
  return Promise.resolve(mockPlans);
}
