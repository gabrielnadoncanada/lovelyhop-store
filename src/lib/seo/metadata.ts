import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { OG_LOCALE, SITE } from "./site";
import { localizedUrls, type LocalizedHref } from "./urls";

type Image = { url: string; width?: number; height?: number; alt?: string };

export type PageMetaOptions = {
  locale: Locale;
  /** Titre court : le gabarit « %s | Lovelyhop » du layout l'allonge. `absolute` pour un titre déjà complet. */
  title: string | { absolute: string };
  description: string;
  /** La page dans chaque langue où elle existe. */
  hrefs: LocalizedHref;
  /** Image Open Graph explicite. Sans image, l'opengraph-image.tsx du segment s'applique. */
  image?: Image | null;
  type?: "website" | "article";
  article?: { publishedTime: string; modifiedTime?: string; authors?: string[]; section?: string; tags?: string[] };
  noindex?: boolean;
};

/**
 * Métadonnées d'une page : canonique, hreflang réciproques (fr-CA, en-CA, x-default → français),
 * Open Graph et Twitter. Toutes les pages passent par ici pour qu'aucune n'oublie un morceau.
 */
export function pageMetadata(o: PageMetaOptions): Metadata {
  const urls = localizedUrls(o.hrefs);
  const canonical = urls[o.locale];
  const languages: Record<string, string> = {};
  if (urls.fr) languages["fr-CA"] = urls.fr;
  if (urls.en) languages["en-CA"] = urls.en;
  if (urls.fr ?? urls.en) languages["x-default"] = (urls.fr ?? urls.en)!;
  const other: Locale = o.locale === "fr" ? "en" : "fr";
  const ogTitle = typeof o.title === "string" ? o.title : o.title.absolute;
  const images = o.image ? [{ ...o.image, alt: o.image.alt ?? ogTitle }] : undefined;

  return {
    title: o.title,
    description: o.description,
    alternates: { canonical, languages },
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: o.type ?? "website",
      siteName: SITE.name,
      url: canonical,
      title: ogTitle,
      description: o.description,
      locale: OG_LOCALE[o.locale],
      alternateLocale: urls[other] ? [OG_LOCALE[other]] : undefined,
      ...(images ? { images } : {}),
      ...(o.type === "article" && o.article
        ? {
            publishedTime: o.article.publishedTime,
            modifiedTime: o.article.modifiedTime ?? o.article.publishedTime,
            authors: o.article.authors,
            section: o.article.section,
            tags: o.article.tags,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: o.description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}
