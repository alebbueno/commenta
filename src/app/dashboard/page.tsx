"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useLocale } from "@/contexts/locale-context";

function getDisplayName(user: { email?: string; user_metadata?: { full_name?: string } }) {
  const name = user.user_metadata?.full_name;
  if (name && typeof name === "string") return name;
  return user.email?.split("@")[0] ?? "there";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const displayName = user ? getDisplayName(user) : "there";

  const handleSubscribePro = async () => {
    setLoadingCheckout(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          successUrl: `${origin}/dashboard?success=1`,
          cancelUrl: `${origin}/dashboard`,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error ?? "Failed to create checkout");
    } catch (e) {
      console.error(e);
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t.dashboard}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t.dashboardWelcome}, {displayName}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          {t.dashboardSub}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-2xl border border-border/50 shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-1.5 p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-header-accent/40 bg-header-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-accent">
                {t.dashboardYourPlan}
              </span>
            </div>
            <CardTitle className="text-xl font-semibold sm:text-2xl">
              {t.dashboardPlanFree}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.dashboardFreeShortDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm text-muted-foreground">
              {t.dashboardUpgradeHint}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-header-accent/30 bg-card shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="space-y-1.5 p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-header-accent/40 bg-header-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-header-accent">
                <Sparkles className="size-3.5" />
                {t.dashboardPluginPro}
              </span>
            </div>
            <CardTitle className="text-xl font-semibold sm:text-2xl">
              {t.dashboardPluginProDesc}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.dashboardStripeNote}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-6 pt-0">
            <Button
              variant="header-accent"
              size="lg"
              className="w-full rounded-full font-semibold sm:w-auto"
              onClick={handleSubscribePro}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? "..." : t.dashboardSubscribePro}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
