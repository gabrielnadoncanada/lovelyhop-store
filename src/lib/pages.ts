import { allPages, type Page } from "content-collections";
import type { Locale } from "@/lib/types";

export type { Page };

/** Les pages d'information et leur route (l'adresse traduite vient de src/i18n/routing.ts). */
export const INFO_PAGES = {
  privacy: "/privacy",
  terms: "/terms",
  shipping: "/shipping",
  faq: "/faq",
} as const;
export type InfoKey = keyof typeof INFO_PAGES;

export const getPage = (key: InfoKey, locale: Locale) => allPages.find((p) => p.key === key && p.locale === locale);

/** Pages encore à valider (avis affiché, noindex, exclues du sitemap). */
export const isPublished = (p: Page) => !p.review;
