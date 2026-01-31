"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, CreditCard, User, ChevronRight, HeadphonesIcon } from "lucide-react";
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

type Profile = {
  plan: "free" | "pro";
  stripe_subscription_status?: string;
  created_at?: string;
  email?: string;
  full_name?: string;
};

function getDisplayName(profile: Profile | null, user: { email?: string; user_metadata?: { full_name?: string; name?: string } } | null) {
  if (profile?.full_name) return profile.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user?.user_metadata?.name) return user.user_metadata.name;
  if (user?.email) return user.email.split("@")[0];
  return "there";
}

function formatMemberSince(isoDate: string | undefined, locale: string) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(
  status: string | undefined,
  t: { dashboardStatusActive: string; dashboardStatusCanceled: string; dashboardStatusPastDue: string }
) {
  if (!status || status === "active") return t.dashboardStatusActive;
  if (status === "canceled" || status === "cancelled") return t.dashboardStatusCanceled;
  if (status === "past_due") return t.dashboardStatusPastDue;
  return status;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, locale, pricing } = useLocale();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [interval, setInterval] = useState<"monthly" | "annual">("annual");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.ok && res.json())
      .then((data) => data && setProfile(data))
      .catch(() => {});
  }, []);

  const displayName = getDisplayName(profile, user);
  const price = interval === "annual" ? pricing.annual : pricing.monthly;
  const memberSince = formatMemberSince(profile?.created_at, locale);
  const isPro = profile?.plan === "pro";

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
          interval,
          locale,
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

      {isPro ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {/* Plano ativo */}
          <Card className="rounded-2xl border-0 bg-header-accent shadow-lg shadow-header-accent/25 transition-shadow hover:shadow-xl hover:shadow-header-accent/30">
            <CardHeader className="space-y-1.5 p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="size-3.5" />
                  {t.dashboardPlanActive}
                </span>
                <span className="rounded-full border border-white/40 bg-white/25 px-2.5 py-0.5 text-xs font-medium text-white">
                  {getStatusLabel(profile?.stripe_subscription_status, t)}
                </span>
              </div>
              <CardTitle className="text-xl font-semibold text-white sm:text-2xl">
                {t.dashboardPlanPro}
              </CardTitle>
              <CardDescription className="text-white/90">
                {t.dashboardProBenefits}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Sua conta */}
          <Card className="rounded-2xl border border-border/50 shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader className="space-y-1.5 p-6">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {t.dashboardAccountInfo}
                </span>
              </div>
              <CardTitle className="text-base font-semibold">
                {profile?.email ?? user?.email ?? "—"}
              </CardTitle>
              {memberSince && (
                <CardDescription className="text-muted-foreground">
                  {t.dashboardMemberSince} {memberSince}
                </CardDescription>
              )}
            </CardHeader>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link href="/dashboard/billing">
                  <CreditCard className="mr-2 size-4" />
                  {t.dashboardManageBilling}
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Acesso rápido */}
          <Card className="rounded-2xl border border-border/50 shadow-lg lg:col-span-2">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-semibold">
                {t.dashboardQuickAccess}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t.dashboardQuickAccessDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 p-6 pt-0 sm:grid-cols-2">
              <Button variant="outline" className="h-auto justify-between rounded-xl p-4" asChild>
                <Link href="/dashboard/pro">
                  <span className="flex items-center gap-3">
                    <Sparkles className="size-5 text-header-accent" />
                    {t.dashboardGoToPro}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" className="h-auto justify-between rounded-xl p-4" asChild>
                <Link href="/dashboard/suporte">
                  <span className="flex items-center gap-3">
                    <HeadphonesIcon className="size-5 text-muted-foreground" />
                    {t.dashboardGoToSupport}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
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
              <div className="mt-4 flex gap-2 rounded-xl border border-border/60 bg-muted/30 p-1">
                <button
                  type="button"
                  onClick={() => setInterval("monthly")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    interval === "monthly"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.pricingMonthly}
                </button>
                <button
                  type="button"
                  onClick={() => setInterval("annual")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    interval === "annual"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.pricingAnnual}
                </button>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {pricing.currency} {pricing.format(price)}
                {interval === "annual" ? ` ${t.pricingPerYear}` : ` ${t.pricingPerMonth}`}
              </p>
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
      )}
    </div>
  );
}
