import { ogCard, OG_SIZE } from "@/lib/seo/og";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lovelyhop";

/** Image de partage par défaut (accueil et toute page sans image propre). */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = locale === "en" ? en : fr;
  return ogCard({ eyebrow: m.hero.eyebrow, title: `${m.hero.title1} ${m.hero.title2} ${m.hero.title3}`.replace(/\.$/, ""), footer: `${m.hero.strip[0]} · ${m.hero.strip[3]}` });
}
