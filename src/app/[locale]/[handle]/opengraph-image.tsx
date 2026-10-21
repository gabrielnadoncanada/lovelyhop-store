import { getProduct } from "@/lib/catalog";
import { ogCard, OG_SIZE } from "@/lib/seo/og";
import type { Locale } from "@/lib/types";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lovelyhop";

/** Image de partage d'une fiche : titre du produit et sa première photo Shopify quand elle existe. */
export default async function Image({ params }: { params: Promise<{ locale: string; handle: string }> }) {
  const { locale, handle } = await params;
  const m = locale === "en" ? en : fr;
  const p = await getProduct(handle, locale as Locale);
  return ogCard({
    eyebrow: p ? [p.material, p.age.split("·").pop()?.trim()].filter(Boolean).join(" · ") : m.hero.eyebrow,
    title: p?.title ?? "Lovelyhop",
    image: p?.images[0]?.url ?? null,
    footer: `${m.hero.strip[0]} · ${m.hero.strip[3]}`,
  });
}
