"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  author_type: string;
  body: string;
  created_at: string;
};

type Ticket = {
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

export default function SuporteTicketPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLocale();
  const id = params.id as string;
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
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
    if (!id || plan !== "pro") return;
    const supabase = createClient();
    (async () => {
      const { data: ticketData, error: ticketError } = await supabase
        .from("support_tickets")
        .select("id, subject, status, created_at")
        .eq("id", id)
        .single();

      if (ticketError || !ticketData) {
        setLoading(false);
        return;
      }
      setTicket(ticketData as Ticket);

      const { data: messagesData } = await supabase
        .from("support_ticket_messages")
        .select("id, author_type, body, created_at")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });

      setMessages((messagesData ?? []) as Message[]);
      setLoading(false);
    })();
  }, [id, plan]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSending(false);
      return;
    }
    await supabase.from("support_ticket_messages").insert({
      ticket_id: id,
      author_type: "user",
      author_id: user.id,
      body: reply.trim(),
    });
    await supabase
      .from("support_tickets")
      .update({ status: "open" })
      .eq("id", id);

    const { data: newMsg } = await supabase
      .from("support_ticket_messages")
      .select("id, author_type, body, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (newMsg) setMessages((prev) => [...prev, newMsg as Message]);
    setReply("");
    setSending(false);
  };

  if (plan === null || (plan === "pro" && loading && !ticket)) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (plan === "free") {
    router.replace("/dashboard/suporte");
    return null;
  }

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/suporte"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar aos chamados
        </Link>
        <p className="text-muted-foreground">Chamado não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/suporte"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.supportMyTickets}
      </Link>

      <Card className="rounded-2xl border border-border/50">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold">{ticket.subject}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {(typeof t[statusKey[ticket.status] as keyof typeof t] === "string"
              ? t[statusKey[ticket.status] as keyof typeof t]
              : ticket.status) as string}{" "}
            ·{" "}
            {new Date(ticket.created_at).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  msg.author_type === "staff"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/40 bg-muted/30"
                )}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {msg.author_type === "staff" ? "Commenta" : "Você"} ·{" "}
                  {new Date(msg.created_at).toLocaleString("pt-BR")}
                </p>
                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleReply} className="space-y-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={t.supportReplyPlaceholder}
                className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
                disabled={sending}
              />
              <Button
                type="submit"
                variant="header-accent"
                size="default"
                className="rounded-full"
                disabled={sending || !reply.trim()}
              >
                <Send className="size-4" />
                {t.supportSendReply}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
