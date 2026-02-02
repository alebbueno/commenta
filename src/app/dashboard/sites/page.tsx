"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";

type SiteRow = {
  site_url: string;
  site_name?: string;
  first_validated_at: string;
  last_validated_at: string;
};

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function DashboardSitesPage() {
  const { t, locale } = useLocale();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me");
      if (!res.ok) return;
      const data = await res.json();
      setPlan(data.plan ?? "free");
    })();
  }, []);

  useEffect(() => {
    if (plan !== "pro") return;
    fetch("/api/me/sites")
      .then((res) => res.ok && res.json())
      .then((data) => setSites(data?.sites ?? []))
      .finally(() => setLoading(false));
  }, [plan]);

  if (plan === null || (plan === "pro" && loading && sites.length === 0)) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (plan === "free") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.sitesTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.sitesSub}</p>
        </div>
        <Card className="rounded-2xl border border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p className="text-muted-foreground">
              A lista de sites é exclusiva para assinantes PRO.
            </p>
            <Button variant="header-accent" size="lg" className="rounded-full" asChild>
              <Link href="/dashboard">{t.proUpgradeCta}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t.sitesTitle}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t.dashboardActiveSites}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          {t.sitesSub}
        </p>
      </div>

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Globe className="size-5 text-header-accent" />
            {t.sitesTitle}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {sites.length === 0
              ? t.sitesEmptyHint
              : `${sites.length} ${sites.length === 1 ? "site" : "sites"} ${t.dashboardActiveSitesCount}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {sites.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-12 text-center">
              <Globe className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-3 font-medium text-muted-foreground">
                {t.sitesEmpty}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.sitesEmptyHint}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="px-4 py-3 font-medium text-foreground">
                      {t.sitesUrl}
                    </th>
                    <th className="px-4 py-3 font-medium text-foreground">
                      {t.sitesName}
                    </th>
                    <th className="hidden px-4 py-3 font-medium text-foreground sm:table-cell">
                      {t.sitesFirstSeen}
                    </th>
                    <th className="px-4 py-3 font-medium text-foreground">
                      {t.sitesLastValidated}
                    </th>
                    <th className="w-10 px-2 py-3" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr
                      key={site.site_url}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={site.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-header-accent hover:underline"
                        >
                          {site.site_url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {site.site_name || "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {formatDate(site.first_validated_at, locale)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(site.last_validated_at, locale)}
                      </td>
                      <td className="px-2 py-3">
                        <a
                          href={site.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={t.sitesOpenSite}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Button variant="outline" size="sm" className="rounded-full" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 size-4" />
            {t.dashboardBack}
          </Link>
        </Button>
      </div>
    </div>
  );
}
