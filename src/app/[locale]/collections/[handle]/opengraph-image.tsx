import { getCollection } from "@/lib/catalog";
import { ogCard, OG_SIZE } from "@/lib/seo/og";
import type { Locale } from "@/lib/types";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lovelyhop";

export default async function Image({ params }: { params: Promise<{ locale: string; handle: string }> }) {
  const { locale, handle } = await params;
  const m = locale === "en" ? en : fr;
  const c = await getCollection(handle, locale as Locale);
  return ogCard({
    eyebrow: m.collection.eyebrow,
    title: c?.title ?? m.nav.universIndex,
    image: c?.products.find((p) => p.images[0])?.images[0]?.url ?? null,
    footer: `${m.hero.strip[0]} · ${m.hero.strip[3]}`,
  });
}
