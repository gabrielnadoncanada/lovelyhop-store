import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/catalog";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections } = await getSitemapEntries();
  const u = (p: string) => `${SITE_URL}${p}`;
  const pages: MetadataRoute.Sitemap = [
    { url: u("/"), alternates: { languages: { "fr-CA": u("/"), "en-CA": u("/en") } } },
    { url: u("/garderies-cpe"), alternates: { languages: { "fr-CA": u("/garderies-cpe"), "en-CA": u("/en/daycares") } } },
  ];
  for (const c of collections) {
    if (c.fr) pages.push({ url: u(`/univers/${c.fr}`), alternates: { languages: { "fr-CA": u(`/univers/${c.fr}`), ...(c.en ? { "en-CA": u(`/en/collections/${c.en}`) } : {}) } } });
  }
  products.fr.forEach((h, i) => {
    const en = products.en[i];
    pages.push({ url: u(`/${h}`), alternates: { languages: { "fr-CA": u(`/${h}`), ...(en ? { "en-CA": u(`/en/${en}`) } : {}) } } });
  });
  return pages;
}
