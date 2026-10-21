import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/lib/types";

/** Une route de l'app, telle que next-intl la comprend (`"/"`, `{ pathname: "/[handle]", params }`…). */
export type Href = Parameters<typeof getPathname>[0]["href"];

/** Une même page dans chaque langue. Les handles Shopify et les slugs d'articles sont traduits, donc chaque langue a sa propre route. */
export type LocalizedHref = Partial<Record<Locale, Href>>;

export const LOCALES: Locale[] = ["fr", "en"];

/** Chemin public (`/univers/imaginer`, `/en/collections/imagine`). */
export function pathFor(href: Href, locale: Locale): string {
  return getPathname({ href, locale });
}

/** URL absolue, pour le canonique, hreflang, le JSON-LD et le sitemap. */
export function absoluteUrl(href: Href, locale: Locale): string {
  return `${SITE_URL.replace(/\/$/, "")}${pathFor(href, locale)}`;
}

/** Même route pour les deux langues (pages fixes). */
export function sameRoute(href: Href): LocalizedHref {
  return { fr: href, en: href };
}

/** Langues réellement disponibles → URL absolue. Une langue absente n'a pas d'entrée (jamais de hreflang vers une page qui n'existe pas). */
export function localizedUrls(hrefs: LocalizedHref): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of LOCALES) {
    const h = hrefs[l];
    if (h) out[l] = absoluteUrl(h, l);
  }
  return out;
}

/** Chemins relatifs par langue, pour le sélecteur de langue de l'en-tête. */
export function localizedPaths(hrefs: LocalizedHref): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of LOCALES) {
    const h = hrefs[l];
    if (h) out[l] = pathFor(h, l);
  }
  return out;
}
