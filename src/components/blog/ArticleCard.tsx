import { Link } from "@/i18n/navigation";
import { GuideArt, type GuideArtKey } from "./GuideArt";

/** Ce dont une carte de guide a besoin (sérialisable, pour les composants client). */
export type ArticleCardData = {
  handle: string;
  title: string;
  excerpt: string;
  theme: string;
  meta: string;
  art: GuideArtKey;
  tone: "sage" | "sand" | "blush";
  image?: string;
  imageAlt?: string;
};

/** Carte de guide (composant GuideCard du design system : .lh-guide). Toute la carte est cliquable. */
export function ArticleCard({ a, headingLevel = 3, featured = false }: { a: ArticleCardData; headingLevel?: 2 | 3; featured?: boolean }) {
  const H = `h${headingLevel}` as const;
  return (
    <article className={featured ? "lh-guide lh-guide--featured" : "lh-guide"}>
      <div className={`lh-guide__media lh-bg-${a.tone}`}>
        {a.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.image} alt={a.imageAlt ?? ""} loading="lazy" />
        ) : (
          <GuideArt art={a.art} />
        )}
      </div>
      <div className="lh-guide__body">
        <span className="lh-guide__meta">{a.meta}</span>
        <H className="lh-guide__title"><Link href={{ pathname: "/blog/[handle]", params: { handle: a.handle } }}>{a.title}</Link></H>
        <p>{a.excerpt}</p>
      </div>
    </article>
  );
}
