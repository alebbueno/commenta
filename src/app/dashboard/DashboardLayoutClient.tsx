"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, CreditCard, Sparkles, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useLocale } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

const baseNavKeys = [
  { href: "/dashboard", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/dashboard/billing", key: "dashboardManageBilling" as const, icon: CreditCard },
];

const proNavKeys = [
  { href: "/dashboard/pro", key: "proTitle" as const, icon: Sparkles },
  { href: "/dashboard/suporte", key: "supportTitle" as const, icon: HeadphonesIcon },
];

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const { t } = useLocale();
  const pathname = usePathname();
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/me")
      .then((res) => res.ok && res.json())
      .then((data) => data?.plan && setPlan(data.plan))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `/login?next=/dashboard`;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0" aria-label="Commenta">
            <Image
              src="/commenta-pt.png"
              alt="Commenta"
              width={130}
              height={40}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="truncate text-sm text-muted-foreground max-w-[120px] sm:max-w-[180px]">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              <LogOut className="size-4" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="shrink-0 lg:w-56">
            <nav className="flex flex-col gap-1" aria-label="Dashboard">
              {baseNavKeys.map(({ href, key, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {t[key]}
                </Link>
              ))}
              {plan === "pro" &&
                proNavKeys.map(({ href, key, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      pathname === href || (href === "/dashboard/suporte" && pathname.startsWith("/dashboard/suporte/"))
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    {t[key]}
                  </Link>
                ))}
            </nav>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
