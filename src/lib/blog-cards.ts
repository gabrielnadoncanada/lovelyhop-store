import type { Article } from "@/lib/blog";
import type { ArticleCardData } from "@/components/blog/ArticleCard";

/** Guide → données de carte. `minutes` : libellé déjà traduit (« 5 min de lecture »). */
export function toCard(a: Article, minutes: (n: number) => string): ArticleCardData {
  return {
    handle: a.handle,
    title: a.title,
    excerpt: a.excerpt,
    theme: a.theme,
    meta: [a.theme, a.age, minutes(a.readingMinutes)].filter(Boolean).join(" · "),
    art: a.art,
    tone: a.tone,
    image: a.image,
    imageAlt: a.imageAlt,
  };
}
