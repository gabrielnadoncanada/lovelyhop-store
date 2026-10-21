import { getArticle } from "@/lib/blog";
import { ogCard, OG_SIZE } from "@/lib/seo/og";
import { SITE } from "@/lib/seo/site";
import type { Locale } from "@/lib/types";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Lovelyhop";

export default async function Image({ params }: { params: Promise<{ locale: string; handle: string }> }) {
  const { locale, handle } = await params;
  const m = locale === "en" ? en : fr;
  const a = getArticle(handle, locale as Locale);
  const image = a?.image ? (a.image.startsWith("http") ? a.image : `${SITE.url.replace(/\/$/, "")}${a.image}`) : null;
  return ogCard({
    eyebrow: a ? [m.blog.eyebrow, a.theme].join(" · ") : m.blog.eyebrow,
    title: a?.title ?? m.blog.all,
    image,
    footer: a ? m.blog.readingTime.replace("{minutes}", String(a.readingMinutes)) : undefined,
  });
}
