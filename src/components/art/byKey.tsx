import type { ArtKey } from "@/lib/types";
import * as A from "./index";

/** Dessin de marque d'un produit (en attendant ses photos). */
const MAP: Record<ArtKey, (p: { className?: string }) => React.ReactElement> = {
  "table-sensorielle": A.ArtTableSensorielle,
  "table-lumineuse": A.ArtTableLumineuse,
  "panneau-activites": A.ArtPanneauActivites,
  "table-art": A.ArtTableArt,
  "plateau-art": A.ArtPlateauArt,
  "plateau-lumineux": A.ArtPlateauLumineux,
  entonnoirs: A.ArtEntonnoirs,
  tamis: A.ArtTamis,
  bacs: A.ArtToast,
  "table-garderie": A.ArtTableGarderie,
  "casier-garderie": A.ArtCasierGarderie,
  "range-matelas": A.ArtRangeMatelas,
  "panneau-mural": A.ArtPanneauMural,
};

export function ProductArt({ art, className }: { art: ArtKey | null; className?: string }) {
  const C = (art && MAP[art]) || A.ArtTableSensorielle;
  return <C className={className} />;
}

/** Les dessins hauts (panneau, casier) prennent une vignette plus étroite. */
export const isNarrowArt = (art: ArtKey | null) => art === "panneau-activites" || art === "casier-garderie" || art === "panneau-mural";
