"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type VersionRow = {
  id: string;
  version: string;
  release_date: string | null;
  description: string | null;
  file_name: string | null;
  changelog_url: string | null;
  download_url: string | null;
  is_prerelease: boolean;
  release_channel: string | null;
  created_at: string;
};

export default function AdminVersionsPage() {
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    version: "",
    release_date: new Date().toISOString().slice(0, 10),
    description: "",
    changelog_url: "",
    changelog_text: "",
    download_url: "",
    file_name: "",
    is_prerelease: false,
    release_channel: "stable",
  });

  const loadVersions = () => {
    fetch("/api/admin/versions")
      .then((res) => res.ok && res.json())
      .then((data) => setVersions(data?.versions ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: form.version.trim(),
          release_date: form.release_date || undefined,
          description: form.description.trim() || undefined,
          changelog_url: form.changelog_url.trim() || undefined,
          changelog_text: form.changelog_text.trim() || undefined,
          download_url: form.download_url.trim() || undefined,
          file_name: form.file_name.trim() || undefined,
          is_prerelease: form.is_prerelease,
          release_channel: form.release_channel,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Erro ao criar versão");
        return;
      }
      setForm({
        version: "",
        release_date: new Date().toISOString().slice(0, 10),
        description: "",
        changelog_url: "",
        changelog_text: "",
        download_url: "",
        file_name: "",
        is_prerelease: false,
        release_channel: "stable",
      });
      setShowForm(false);
      loadVersions();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cadastro e release do plugin
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          Versões do plugin
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-4">
          Lista de versões e cadastro de novas releases.
        </p>
      </div>

      {showForm && (
        <Card className="rounded-2xl border border-header-accent/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Plus className="size-5 text-header-accent" />
              Nova versão
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setShowForm(false)}
            >
              Fechar
            </Button>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Versão *
                  </label>
                  <Input
                    className="rounded-xl"
                    value={form.version}
                    onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
                    placeholder="ex: 1.0.2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Data de release
                  </label>
                  <Input
                    type="date"
                    className="rounded-xl"
                    value={form.release_date}
                    onChange={(e) => setForm((f) => ({ ...f, release_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Descrição
                </label>
                <textarea
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Release notes curtas"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    URL de download
                  </label>
                  <Input
                    className="rounded-xl"
                    type="url"
                    value={form.download_url}
                    onChange={(e) => setForm((f) => ({ ...f, download_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Nome do arquivo
                  </label>
                  <Input
                    className="rounded-xl"
                    value={form.file_name}
                    onChange={(e) => setForm((f) => ({ ...f, file_name: e.target.value }))}
                    placeholder="commenta-pro-1.0.2.zip"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Changelog (texto)
                </label>
                <textarea
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                  value={form.changelog_text}
                  onChange={(e) => setForm((f) => ({ ...f, changelog_text: e.target.value }))}
                  placeholder="Linha por linha ou markdown"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  URL do changelog
                </label>
                <Input
                  className="rounded-xl"
                  type="url"
                  value={form.changelog_url}
                  onChange={(e) => setForm((f) => ({ ...f, changelog_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_prerelease}
                    onChange={(e) => setForm((f) => ({ ...f, is_prerelease: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Pré-lançamento</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Canal:</span>
                  <select
                    className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={form.release_channel}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        release_channel: e.target.value as "stable" | "beta" | "alpha",
                      }))
                    }
                  >
                    <option value="stable">Stable</option>
                    <option value="beta">Beta</option>
                    <option value="alpha">Alpha</option>
                  </select>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  variant="header-accent"
                  size="lg"
                  className="rounded-full"
                  disabled={submitting || !form.version.trim()}
                >
                  {submitting ? "Salvando…" : "Cadastrar versão"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-border/50 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Package className="size-5 text-header-accent" />
              Versões ({versions.length})
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Releases disponíveis para download na área PRO.
            </CardDescription>
          </div>
          {!showForm && (
            <Button
              variant="header-accent"
              size="sm"
              className="rounded-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 size-4" />
              Nova versão
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="px-4 py-3 font-medium text-foreground">Versão</th>
                    <th className="px-4 py-3 font-medium text-foreground">Canal</th>
                    <th className="px-4 py-3 font-medium text-foreground">Release</th>
                    <th className="px-4 py-3 font-medium text-foreground">Arquivo</th>
                    <th className="px-4 py-3 font-medium text-foreground">Download</th>
                    <th className="w-10 px-2 py-3" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {versions.map((v) => (
                    <tr key={v.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{v.version}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            v.release_channel === "stable"
                              ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
                              : "border-header-accent/40 bg-header-accent/10 text-header-accent"
                          )}
                        >
                          {v.release_channel ?? "stable"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {v.release_date
                          ? new Date(v.release_date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{v.file_name ?? "—"}</td>
                      <td className="px-4 py-3">
                        {v.download_url ? (
                          <a
                            href={v.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-header-accent hover:underline"
                          >
                            Link
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-3">
                        {v.download_url && (
                          <a
                            href={v.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Abrir download"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
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
          <Link href="/admin">
            <ArrowLeft className="mr-2 size-4" />
            Voltar ao painel
          </Link>
        </Button>
      </div>
    </div>
  );
}
