"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale } from "@/lib/locale";
import { getPreferredLocale, setStoredLocale } from "@/lib/locale";
import { translations, pricingByLocale } from "@/lib/translations";

type Translations = (typeof translations)[Locale];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translations;
  pricing: (typeof pricingByLocale)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferred = getPreferredLocale();
    setLocaleState(preferred);
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setStoredLocale(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale, mounted]);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: translations[locale],
    pricing: pricingByLocale[locale],
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
