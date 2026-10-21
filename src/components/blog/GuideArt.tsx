import { ArtBols, ArtGuideBac, ArtGuideBibliotheque, ArtGuideLumiere } from "@/components/art";

export type GuideArtKey = "bac" | "lumiere" | "bibliotheque" | "bols";
const ART = { bac: ArtGuideBac, lumiere: ArtGuideLumiere, bibliotheque: ArtGuideBibliotheque, bols: ArtBols } as const;

/** Dessin de couverture d'un guide (illustrations contreplaqué du design system). */
export function GuideArt({ art }: { art: GuideArtKey }) {
  const A = ART[art] ?? ArtGuideBac;
  return <A />;
}
