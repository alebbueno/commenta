"use client";

import { CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";

export default function DashboardBillingPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t.dashboardManageBilling}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t.dashboardYourPlan}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Gerencie sua assinatura do plugin Commenta PRO. Cobrança via Stripe.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-muted-foreground" />
            <CardTitle className="text-xl font-semibold">
              Stripe Customer Portal
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Atualize método de pagamento, veja faturas ou cancele sua assinatura no portal seguro da Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-sm text-muted-foreground">
            Em breve: link para o portal do cliente Stripe será exibido aqui após você assinar o PRO.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
