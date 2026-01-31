"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus, Ticket, ChevronRight } from "lucide-react";
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

type TicketRow = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
};

const statusKey: Record<string, string> = {
  open: "supportStatusOpen",
  in_progress: "supportStatusInProgress",
  closed: "supportStatusClosed",
};

export default function SuportePage() {
  const { t } = useLocale();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

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
    supabase
      .from("support_tickets")
      .select("id, subject, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTickets((data ?? []) as TicketRow[]);
        setLoading(false);
      });
  }, [plan, createdId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      return;
    }
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        status: "open",
      })
      .select("id")
      .single();

    if (error) {
      setSubmitting(false);
      return;
    }

    await supabase.from("support_ticket_messages").insert({
      ticket_id: ticket.id,
      author_type: "user",
      author_id: user.id,
      body: message.trim(),
    });

    setCreatedId(ticket.id);
    setSubject("");
    setMessage("");
    setShowForm(false);
    setSubmitting(false);
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.supportTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">{t.supportSub}</p>
        </div>
        <Card className="rounded-2xl border border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p className="text-muted-foreground">
              O suporte por ticket é exclusivo para assinantes PRO.
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.supportTitle}
          </h1>
          <p className="mt-1 text-muted-foreground">{t.supportSub}</p>
        </div>
        <Button
          variant="header-accent"
          size="default"
          className="rounded-full shrink-0"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageSquarePlus className="size-4" />
          {t.supportNewTicket}
        </Button>
      </div>

      {showForm && (
        <Card className="rounded-2xl border border-border/50">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg font-semibold">{t.supportNewTicket}</CardTitle>
            <CardDescription className="text-muted-foreground">
              Descreva seu problema ou dúvida. Nosso time responderá neste mesmo chamado.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="support-subject" className="text-sm font-medium">
                  {t.supportSubject}
                </label>
                <Input
                  id="support-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Erro ao ativar o plugin"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="support-message" className="text-sm font-medium">
                  {t.supportMessage}
                </label>
                <textarea
                  id="support-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva o problema..."
                  className="mt-1 flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="header-accent"
                  size="default"
                  className="rounded-full"
                  disabled={submitting}
                >
                  {submitting ? "..." : t.supportSubmit}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="rounded-full"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-border/50">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold">{t.supportMyTickets}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acompanhe e responda seus chamados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : tickets.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t.supportNoTickets}
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    href={`/dashboard/suporte/${ticket.id}`}
                    className={cn(
                      "flex items-center justify-between gap-4 px-2 py-4 text-left transition-colors hover:bg-muted/30",
                      "rounded-xl"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {ticket.subject}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(typeof t[statusKey[ticket.status] as keyof typeof t] === "string"
                        ? t[statusKey[ticket.status] as keyof typeof t]
                        : ticket.status) as string} ·{" "}
                        {new Date(ticket.created_at).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
