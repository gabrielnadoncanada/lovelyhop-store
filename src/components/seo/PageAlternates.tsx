import { SetAlternates } from "@/components/layout/Alternates";
import { localizedPaths, type LocalizedHref } from "@/lib/seo/urls";

/** Déclare la page dans chaque langue pour le lien FR/EN de l'en-tête (mêmes routes que hreflang). */
export function PageAlternates({ hrefs }: { hrefs: LocalizedHref }) {
  const p = localizedPaths(hrefs);
  return <SetAlternates fr={p.fr} en={p.en} />;
}
