import type { Locale, Money } from "@/lib/types";

/** « 249,00 $ » en français, « $249.00 » en anglais ; prix inconnu : « [prix] ». */
export function formatMoney(m: Money | null | undefined, locale: Locale): string {
  if (!m) return locale === "fr" ? "[prix] $" : "$[price]";
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
