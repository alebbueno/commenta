"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  author_type: string;
  body: string;
  created_at: string;
};

type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_email: string | null;
  user_name: string | null;
};

const statusLabel: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em atendimento",
  closed: "Fechado",
};

export default function AdminSupportTicketPage() {
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/support/${id}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setTicket(data.ticket);
          setMessages(data.messages ?? []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/admin/support/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) {
      alert(data?.error ?? "Erro ao enviar resposta");
      return;
    }
    if (data.message) setMessages((prev) => [...prev, data.message]);
    setReply("");
    load(); // refresh ticket (status may have changed to in_progress)
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    const res = await fetch(`/api/admin/support/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdatingStatus(false);
    if (res.ok) setTicket((t) => (t ? { ...t, status: newStatus } : null));
  };

  if (loading && !ticket) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/support"
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
        href="/admin/support"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Suporte
      </Link>

      <Card className="rounded-2xl border border-border/50">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 p-6 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">{ticket.subject}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {ticket.user_email ?? "—"}
              {ticket.user_name ? ` · ${ticket.user_name}` : ""} ·{" "}
              {new Date(ticket.created_at).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <select
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
            >
              <option value="open">Aberto</option>
              <option value="in_progress">Em atendimento</option>
              <option value="closed">Fechado</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-6">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-xl border px-4 py-3",
                  msg.author_type === "staff"
                    ? "border-header-accent/30 bg-header-accent/5"
                    : "border-border/40 bg-muted/30"
                )}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {msg.author_type === "staff" ? "Commenta (você)" : ticket.user_email ?? "Cliente"} ·{" "}
                  {new Date(msg.created_at).toLocaleString("pt-BR")}
                </p>
                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleReply} className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Responder</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
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
                {sending ? "Enviando…" : "Enviar resposta"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
