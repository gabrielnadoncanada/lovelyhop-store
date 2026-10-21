import type { MetadataRoute } from "next";
import { getCatalogIndex } from "@/lib/catalog";
import { allPublishedArticles, articleHref, articleHrefs } from "@/lib/blog";
import { absoluteUrl, localizedUrls, sameRoute, type LocalizedHref } from "@/lib/seo/urls";
import type { Locale } from "@/lib/types";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Une entrée par langue et par page, chacune avec la carte hreflang réciproque
 * (fr-CA, en-CA, x-default → français). Les dates ne sont publiées que lorsqu'elles sont vraies
 * (mise à jour Shopify, date d'un guide) : une date « maintenant » à chaque build n'apprend rien à Google.
 */
function entries(hrefs: LocalizedHref, extra: Omit<Entry, "url" | "alternates"> = {}): Entry[] {
  const urls = localizedUrls(hrefs);
  const languages: Record<string, string> = {};
  if (urls.fr) languages["fr-CA"] = urls.fr;
  if (urls.en) languages["en-CA"] = urls.en;
  if (urls.fr ?? urls.en) languages["x-default"] = (urls.fr ?? urls.en)!;
  return (Object.keys(urls) as Locale[]).map((l) => ({ url: urls[l]!, alternates: { languages }, ...extra }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections } = await getCatalogIndex();

  const pages = (["/", "/collections", "/blog", "/daycares"] as const).flatMap((h) => entries(sameRoute(h)));

  const univers = collections.flatMap((c) =>
    entries({
      fr: c.fr ? { pathname: "/collections/[handle]", params: { handle: c.fr } } : undefined,
      en: c.en ? { pathname: "/collections/[handle]", params: { handle: c.en } } : undefined,
    }),
  );

  const fiches = products.flatMap((p) =>
    entries(
      {
        fr: p.handles.fr ? { pathname: "/[handle]", params: { handle: p.handles.fr } } : undefined,
        en: p.handles.en ? { pathname: "/[handle]", params: { handle: p.handles.en } } : undefined,
      },
      { ...(p.updatedAt ? { lastModified: p.updatedAt } : {}), ...(p.image ? { images: [p.image] } : {}) },
    ),
  );

  // Un guide n'a d'entrée que dans la langue de son fichier ; ses alternates viennent du translationKey.
  const guides = allPublishedArticles().map((a): Entry => {
    const url = absoluteUrl(articleHref(a.handle), a.locale);
    const own = entries(articleHrefs(a)).find((e) => e.url === url) ?? { url };
    return { ...own, lastModified: a.updatedAt ?? a.publishedAt };
  });

  return [...pages, ...univers, ...fiches, ...guides];
}
