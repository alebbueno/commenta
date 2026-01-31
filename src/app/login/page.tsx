"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { HeroFloatingIcons } from "@/components/sections/hero-floating-icons";

type AuthMode = "login" | "signup";

function LoginContent() {
  const { t } = useLocale();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    user,
    loading,
  } = useAuth();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "auth";

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      window.location.href = "/dashboard";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background bg-geometric-pattern px-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </main>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError(t.authEmailRequired);
      return;
    }
    if (!password) {
      setFormError(t.authPasswordRequired);
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setFormError(t.authWeakPassword);
      return;
    }

    setSubmitLoading(true);
    const err =
      mode === "login"
        ? await signInWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password);
    setSubmitLoading(false);

    if (err) {
      const msg =
        err.message.toLowerCase().includes("invalid") ||
        err.message.toLowerCase().includes("credentials")
          ? t.authInvalidLogin
          : err.message;
      setFormError(msg);
      return;
    }

    if (mode === "signup") {
      setEmailSent(true);
      setPassword("");
    }
  };

  const showFormError = formError || urlError;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background bg-geometric-pattern">
      <HeroFloatingIcons />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          {t.backToHome}
        </Link>
      </div>

      <section className="relative z-10 border-b border-border/40 pt-6 pb-14 sm:pt-8 sm:pb-20 md:pt-10 md:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-md">
            <div className="animate-fade-in text-center">
              <Link href="/" className="inline-block" aria-label="Commenta">
                <Image
                  src="/commenta-pt.png"
                  alt="Commenta"
                  width={140}
                  height={44}
                  className="h-8 w-auto sm:h-9"
                  priority
                />
              </Link>
              <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {t.loginTitle}
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-4">
                {t.loginSub}
              </p>
            </div>

            <Card className="mt-8 rounded-2xl border border-border/50 shadow-xl transition-shadow hover:shadow-xl sm:mt-10">
              <CardHeader className="space-y-1.5 p-6 pb-4">
                <div className="flex gap-1 rounded-full border border-border/60 bg-muted/30 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setFormError(null);
                      setEmailSent(false);
                    }}
                    className={cn(
                      "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                      mode === "login"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.authTabLogin}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setFormError(null);
                      setEmailSent(false);
                    }}
                    className={cn(
                      "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                      mode === "signup"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.authTabSignUp}
                  </button>
                </div>
                <CardTitle className="text-xl font-semibold sm:text-2xl">
                  {mode === "login" ? t.authSignIn : t.authCreateAccount}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {mode === "login"
                    ? t.loginOrSignUp
                    : t.authHasAccount + " " + t.authSignIn + " abaixo."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {emailSent ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 text-sm text-foreground">
                    <p className="font-medium">{t.authConfirmEmail}</p>
                    <p className="mt-1 text-muted-foreground">
                      {t.authConfirmEmailSent}
                    </p>
                  </div>
                ) : (
                  <>
                    {showFormError && (
                      <p className="mb-4 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {urlError ? t.loginError : formError}
                      </p>
                    )}
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label
                          htmlFor="auth-email"
                          className="text-sm font-medium text-foreground"
                        >
                          {t.authEmail}
                        </label>
                        <Input
                          id="auth-email"
                          type="email"
                          autoComplete="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl"
                          disabled={submitLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="auth-password"
                          className="text-sm font-medium text-foreground"
                        >
                          {t.authPassword}
                        </label>
                        <Input
                          id="auth-password"
                          type="password"
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl"
                          disabled={submitLoading}
                          minLength={mode === "signup" ? 6 : undefined}
                        />
                        {mode === "signup" && (
                          <p className="text-xs text-muted-foreground">
                            {t.authPasswordMinHint}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        variant="header-accent"
                        size="lg"
                        className="w-full rounded-full font-semibold"
                        disabled={submitLoading}
                      >
                        {submitLoading
                          ? "..."
                          : mode === "login"
                            ? t.authSignIn
                            : t.authCreateAccount}
                      </Button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t.authOrDivider}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full font-medium"
                      onClick={() => signInWithGoogle()}
                      disabled={submitLoading}
                    >
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {t.loginWithGoogle}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link
                href="/termos"
                className="text-primary underline-offset-4 hover:underline"
              >
                Termos
              </Link>{" "}
              e{" "}
              <Link
                href="/privacidade"
                className="text-primary underline-offset-4 hover:underline"
              >
                Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40 bg-muted/20 py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Link href="/" className="shrink-0" aria-label="Commenta">
              <Image
                src="/commenta-pt.png"
                alt="Commenta"
                width={120}
                height={38}
                className="h-6 w-auto"
              />
            </Link>
            <span className="text-xs text-muted-foreground">
              Exclusivo para WordPress · Feedback que vira código
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background bg-geometric-pattern px-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
