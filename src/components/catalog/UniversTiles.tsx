import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";
import { Icon } from "@/components/ui/icons";
import { ArtUniversBouger, ArtUniversCreer, ArtUniversImaginer, ArtUniversRanger } from "@/components/art";

const TILES = [
  { u: "creer", cls: "lh-tile lh-tile--sage", Art: ArtUniversCreer },
  { u: "imaginer", cls: "lh-tile lh-tile--blush", Art: ArtUniversImaginer },
  { u: "ranger", cls: "lh-tile", Art: ArtUniversRanger },
  { u: "bouger", cls: "lh-tile lh-tile--sand", Art: ArtUniversBouger },
] as const;

/** Tuiles des quatre univers (composant UniversTile), partagées par l'accueil et l'index des univers. */
export async function UniversTiles({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const H = `h${headingLevel}` as const;
  return (
    <div className="lh-tiles">
      {TILES.map(({ u, cls, Art }) => (
        <Link key={u} className={cls} href={{ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }}>
          {u === "bouger" && <span className="lh-badge lh-tile__soon">{t("common.soon")}</span>}
          <div className="lh-tile__art"><Art /></div>
          <div className="lh-tile__foot">
            <div><span className="lh-tile__eyebrow">{t(`home.tiles.${u}`)}</span><H className="lh-tile__title">{t(`nav.univers.${u}`)}</H></div>
            <span className="lh-tile__go"><Icon name="arrow" /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}
