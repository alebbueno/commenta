"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Package,
  Terminal,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/contexts/locale-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type PluginVersion = {
  id: string;
  version: string;
  release_date: string | null;
  changelog_url: string | null;
  changelog_text: string | null;
  download_url: string | null;
  file_name: string | null;
  description: string | null;
  release_channel: string | null;
  is_prerelease: boolean;
};

export default function DashboardProPage() {
  const { t } = useLocale();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [versions, setVersions] = useState<PluginVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PluginVersion | null>(
    null
  );
  const [openInstall, setOpenInstall] = useState<string | null>("manual");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
    const supabase = createClient();
    (async () => {
      setLicenseLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_or_create_license");
        if (!error && data?.[0]) {
          setLicenseKey(data[0].license_key ?? null);
        }
      } finally {
        setLicenseLoading(false);
      }
    })();
  }, [plan]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("plugin_versions")
      .select("id, version, release_date, changelog_url, changelog_text, download_url, file_name, description, release_channel, is_prerelease")
      .order("is_prerelease", { ascending: true })
      .order("release_date", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as PluginVersion[];
        setVersions(list);
        if (list.length > 0 && !selectedVersion) setSelectedVersion(list[0]);
      });
  }, [selectedVersion === null]);

  const copyLicense = () => {
    if (!licenseKey) return;
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (plan === null) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (plan === "free") {
    return (
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.proTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.proRequiresPro}</p>
        </div>
        <Card className="rounded-2xl border border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <Sparkles className="size-12 text-header-accent" />
            <p className="text-muted-foreground">{t.proRequiresPro}</p>
            <Button variant="header-accent" size="lg" className="rounded-full" asChild>
              <Link href="/dashboard">{t.proUpgradeCta}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latest = versions[0];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.proTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.proSubscription} · {t.dashboardPlanPro}
          </p>
        </div>
      </div>

      {/* License Key */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold">{t.proLicenseKey}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Use esta chave no plugin WordPress para ativar o Commenta PRO.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex gap-2">
            <Input
              readOnly
              value={licenseLoading ? "..." : licenseKey ?? ""}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-xl"
              onClick={copyLicense}
              disabled={licenseLoading || !licenseKey}
            >
              <Copy className="size-4" />
            </Button>
          </div>
          {copied && (
            <p className="mt-2 text-xs text-muted-foreground">{t.proCopied}</p>
          )}
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card className="rounded-2xl border border-border/50 shadow-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold">{t.proDownloads}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Baixe a versão do plugin para instalar no WordPress.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="flex h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm"
              value={selectedVersion?.id ?? ""}
              onChange={(e) => {
                const v = versions.find((x) => x.id === e.target.value);
                if (v) setSelectedVersion(v);
              }}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.version}
                  {v.release_channel === "beta"
                    ? " (Beta)"
                    : v.release_channel === "stable"
                      ? " (Produção)"
                      : v.is_prerelease
                        ? " (pré-lançamento)"
                        : ""}
                  {latest?.id === v.id ? " — " + t.proLatestVersion : ""}
                </option>
              ))}
            </select>
            <Button
              variant="header-accent"
              size="default"
              className="rounded-full"
              asChild={!!selectedVersion?.download_url}
              disabled={!selectedVersion?.download_url}
            >
              {selectedVersion?.download_url ? (
                <a
                  href={selectedVersion.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="size-4" />
                  {t.proDownload}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Download className="size-4" />
                  {t.proDownload}
                </span>
              )}
            </Button>
          </div>
          {selectedVersion && (
            <div className="rounded-xl border border-border/40 bg-muted/30 px-4 py-4 text-sm space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{t.proVersion}</span>{" "}
                {selectedVersion.version}
                {selectedVersion.release_channel && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                      selectedVersion.release_channel === "stable"
                        ? "bg-primary/15 text-primary"
                        : "bg-header-accent/15 text-header-accent"
                    )}
                  >
                    {selectedVersion.release_channel === "stable"
                      ? "Produção"
                      : selectedVersion.release_channel}
                  </span>
                )}
                {selectedVersion.release_date && (
                  <span className="text-muted-foreground">
                    {t.proReleased}{" "}
                    {new Date(selectedVersion.release_date).toLocaleDateString(
                      "pt-BR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </span>
                )}
                {selectedVersion.changelog_url && (
                  <a
                    href={selectedVersion.changelog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {t.proChangelog}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              {selectedVersion.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {selectedVersion.description}
                </p>
              )}
              {selectedVersion.file_name && (
                <p className="text-xs text-muted-foreground">
                  Arquivo: <code className="rounded bg-muted px-1.5 py-0.5">{selectedVersion.file_name}</code>
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Installation instructions */}
      <Card className="rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {t.proInstallTitle}
          </CardTitle>
          <CardDescription className="mt-1.5 text-muted-foreground">
            {t.proInstallSub}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2 space-y-3">
          {[
            {
              id: "manual",
              label: t.proInstallManual,
              desc: t.proInstallManualDesc,
              icon: Package,
            },
            {
              id: "composer",
              label: t.proInstallComposer,
              desc: t.proInstallComposerDesc,
              icon: Terminal,
            },
            {
              id: "prerelease",
              label: t.proInstallPrerelease,
              desc: t.proInstallPrereleaseDesc,
              icon: FlaskConical,
            },
          ].map(({ id, label, desc, icon: Icon }) => (
            <div
              key={id}
              className={cn(
                "rounded-2xl border transition-colors",
                openInstall === id
                  ? "border-border bg-muted/20"
                  : "border-border/40 bg-card hover:border-border/60"
              )}
            >
              <button
                type="button"
                className="flex w-full items-start gap-4 px-5 py-4 text-left"
                onClick={() => setOpenInstall(openInstall === id ? null : id)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
                </div>
                <span className="shrink-0 pt-1 text-muted-foreground">
                  {openInstall === id ? (
                    <ChevronUp className="size-5" />
                  ) : (
                    <ChevronDown className="size-5" />
                  )}
                </span>
              </button>
              {openInstall === id && (
                <div className="border-t border-border/40 px-5 pb-5 pt-4">
                  {id === "manual" && (
                    <ol className="space-y-5">
                      {[
                        t.proManualStep1,
                        t.proManualStep2,
                        t.proManualStep3,
                        t.proManualStep4,
                      ].map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-header-accent/15 text-xs font-bold text-header-accent">
                            {i + 1}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                  {id === "composer" && (
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-header-accent/15 text-xs font-bold text-header-accent">
                          1
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground leading-relaxed mb-2">
                            {t.proComposerStep1}
                          </p>
                          <CodeBlock
                            code="composer require commenta/commenta-pro"
                            blockId="composer-require"
                            copiedCode={copiedCode}
                            onCopy={copyCode}
                            tCopy={t.proCopyCode}
                            tCopied={t.proCodeCopied}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-header-accent/15 text-xs font-bold text-header-accent">
                          2
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground leading-relaxed mb-2">
                            {t.proComposerStep2}
                          </p>
                          <CodeBlock
                            code={t.proComposerWpCli}
                            blockId="wp-cli"
                            copiedCode={copiedCode}
                            onCopy={copyCode}
                            tCopy={t.proCopyCode}
                            tCopied={t.proCodeCopied}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {id === "prerelease" && (
                    <div className="rounded-xl border border-border/60 bg-muted/50 px-4 py-3 text-sm text-foreground">
                      <p className="leading-relaxed">{t.proPrereleaseNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CodeBlock({
  code,
  blockId,
  copiedCode,
  onCopy,
  tCopy,
  tCopied,
}: {
  code: string;
  blockId: string;
  copiedCode: string | null;
  onCopy: (text: string, id: string) => void;
  tCopy: string;
  tCopied: string;
}) {
  const isCopied = copiedCode === blockId;
  return (
    <div className="relative rounded-xl border border-border/50 bg-muted/50 font-mono text-sm">
      <pre className="overflow-x-auto px-4 py-3 pr-24 text-foreground">
        <code>{code}</code>
      </pre>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 rounded-lg text-xs text-muted-foreground hover:text-foreground"
        onClick={() => onCopy(code, blockId)}
      >
        {isCopied ? tCopied : tCopy}
      </Button>
    </div>
  );
}
