export type Locale = "pt" | "en";

export const LOCALE_STORAGE_KEY = "commenta-locale";

/**
 * Detecta o idioma preferido: primeiro localStorage, depois o navegador (Accept-Language).
 * Usado apenas no client (useEffect); no SSR não há navigator.
 */
export function getPreferredLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "pt") return stored;
  const lang = navigator.language?.toLowerCase() ?? "";
  return lang.startsWith("pt") ? "pt" : "en";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
