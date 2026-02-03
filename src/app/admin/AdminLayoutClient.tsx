"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Globe,
  Package,
  Headphones,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/payments", label: "Pagamentos", icon: CreditCard },
  { href: "/admin/sites", label: "Sites em uso", icon: Globe },
  { href: "/admin/support", label: "Suporte", icon: Headphones },
  { href: "/admin/versions", label: "Versões do plugin", icon: Package },
];

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/admin/me")
      .then((res) => {
        if (res.status === 403 || res.status === 401) setAdmin(false);
        else if (res.ok) return res.json();
      })
      .then((data) => data?.admin && setAdmin(true))
      .catch(() => setAdmin(false));
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!loading && user && admin === false) {
      router.replace("/dashboard");
    }
  }, [user, loading, admin, pathname, router]);

  if (loading || admin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2" aria-label="Admin Commenta">
            <Shield className="size-6 text-header-accent" />
            <span className="font-semibold text-foreground">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="truncate text-sm text-muted-foreground max-w-[140px] sm:max-w-[200px]">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-8 flex flex-wrap gap-1 rounded-2xl border border-border/50 bg-muted/20 p-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
