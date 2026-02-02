export type Locale = "pt" | "en";

export const LOCALE_STORAGE_KEY = "commenta-locale";
export const COUNTRY_COOKIE = "commenta-country";

/**
 * Considera pt-BR ou Brasil como português; qualquer outro idioma/região abre em inglês.
 * 1) Se o usuário já escolheu idioma (localStorage), respeita.
 * 2) Se o país é Brasil (cookie setado pelo middleware a partir de geo), usa português.
 * 3) Se o navegador é pt-BR ou "pt", usa português.
 * 4) Caso contrário (en, es, pt-PT, etc.), usa inglês.
 * Usado apenas no client; no SSR não há navigator.
 */
export function getPreferredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "pt") return stored;
  if (typeof document !== "undefined" && document.cookie.includes(`${COUNTRY_COOKIE}=BR`)) {
    return "pt";
  }
  const lang = navigator.language?.toLowerCase() ?? "";
  const isPtBr =
    lang === "pt-br" ||
    lang === "pt" ||
    lang.startsWith("pt-br");
  return isPtBr ? "pt" : "en";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
