import { allArticles, type Article } from "content-collections";
import type { Locale } from "@/lib/types";
import type { LocalizedHref } from "@/lib/seo/urls";

export type { Article };

/**
 * Guides compilés par content-collections. Les brouillons n'atteignent jamais le site,
 * l'ordre est toujours du plus récent au plus ancien, et un guide ne s'affiche que dans sa langue.
 */
const published: Article[] = allArticles
  .filter((a) => !a.draft)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || (a.pin ?? 99) - (b.pin ?? 99) || a.title.localeCompare(b.title));

export const articles = (locale: Locale) => published.filter((a) => a.locale === locale);

/** Tous les guides de toutes les langues (sitemap, llms.txt). */
export const allPublishedArticles = () => published;

export const getArticle = (handle: string, locale: Locale) => published.find((a) => a.handle === handle && a.locale === locale);

/** Le même guide dans une autre langue, par `translationKey` (les slugs sont traduits). */
export const translatedArticle = (a: Article, locale: Locale) => published.find((c) => c.translationKey === a.translationKey && c.locale === locale);

export const articleHref = (handle: string) => ({ pathname: "/blog/[handle]" as const, params: { handle } });

/** Le guide dans chaque langue où il existe : hreflang, sélecteur de langue, sitemap. */
export function articleHrefs(a: Article): LocalizedHref {
  const out: LocalizedHref = {};
  for (const l of ["fr", "en"] as Locale[]) {
    const t = translatedArticle(a, l);
    if (t) out[l] = articleHref(t.handle);
  }
  return out;
}

export const articleThemes = (locale: Locale) => [...new Set(articles(locale).map((a) => a.theme))];

/** Autres guides de la même langue : même thème d'abord, puis produits en commun. */
export function relatedArticles(a: Article, limit = 3): Article[] {
  const score = (c: Article) => (c.theme === a.theme ? 2 : 0) + c.products.filter((p) => a.products.includes(p)).length * 0.5;
  return articles(a.locale as Locale)
    .filter((c) => c.handle !== a.handle)
    .sort((x, y) => score(y) - score(x))
    .slice(0, limit);
}

/** Guides qui mentionnent un produit (bloc « Guides » de la fiche produit). */
export const articlesForProduct = (handle: string, locale: Locale) => articles(locale).filter((a) => a.products.includes(handle));
