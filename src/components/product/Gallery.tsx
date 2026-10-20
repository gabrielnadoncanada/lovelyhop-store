"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArtDetailAssemblage, ArtLivreeAPlat, ArtTableDeJeu, TablePlateaux } from "@/components/art";
import { ProductArt } from "@/components/art/byKey";
import type { Plateau, Product } from "@/lib/types";

type View = "jeu" | "fermee" | "detail" | "plat";
const STAGE: Record<View, string> = { jeu: "lh-stage", fermee: "lh-stage", detail: "lh-stage lh-stage--blush", plat: "lh-stage lh-stage--sand" };

/** Galerie de la fiche (composant ProductGallery). Les photos Shopify remplacent les dessins quand elles existent. */
export function Gallery({ product }: { product: Product }) {
  const t = useTranslations("product");
  const [plateau, setPlateau] = useState<Plateau>("bacs");
  const [view, setView] = useState<View>("jeu");
  const [img, setImg] = useState(0);
  const withText = t(`with.${plateau}`);

  if (!product.details?.plateaux) {
    const images = product.images;
    return (
      <div className="lh-gallery">
        <div className="lh-stage">
          {images.length ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="lh-stage__view" src={images[img].url} alt={images[img].altText ?? product.title} style={{ objectFit: "contain" }} />
          ) : (
            <ProductArt art={product.art} className="lh-art lh-stage__view" />
          )}
        </div>
        {images.length > 1 && (
          <div className="lh-thumbs" role="group" aria-label={t("views")}>
            {images.slice(0, 4).map((im, i) => (
              <button key={im.url} className="lh-thumb" type="button" aria-pressed={i === img} onClick={() => setImg(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <span className="lh-thumb__img"><img src={im.url} alt="" /></span><span>{i + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const views: View[] = ["jeu", "fermee", "detail", "plat"];
  return (
    <div className="lh-gallery">
      <div className={STAGE[view]}>
        <span className="lh-stage__note" aria-hidden="true">{t("note")}</span>
        <span className="lh-stage__seal" aria-hidden="true"><span><strong>3</strong>{t("seal")}</span></span>
        {view === "jeu" && <TablePlateaux className="lh-stage__view" plateau={plateau} label={t("labels.jeu", { with: withText })} key={`jeu-${plateau}`} />}
        {view === "fermee" && <ArtTableDeJeu className="lh-stage__view" label={t("labels.fermee")} />}
        {view === "detail" && <ArtDetailAssemblage className="lh-stage__view lh-stage__view--detail" label={t("labels.detail")} />}
        {view === "plat" && <ArtLivreeAPlat className="lh-stage__view" label={t("labels.plat")} />}
        <span className="lh-stage__cap">{view === "jeu" ? t("caps.jeu", { with: withText }) : t(`caps.${view}`)}</span>
      </div>

      <div className="lh-gallery__try" role="group" aria-label={t("tryPlateau")}>
        <span className="lh-eyebrow">{t("tryPlateau")}</span>
        {(["bacs", "art", "lumiere"] as Plateau[]).map((p) => (
          <button key={p} className="lh-chip lh-chip--plain" type="button" aria-pressed={plateau === p} onClick={() => { setPlateau(p); setView("jeu"); }}>{t(`plateaux.${p}`)}</button>
        ))}
      </div>

      <div className="lh-thumbs" role="group" aria-label={t("views")}>
        {views.map((v) => (
          <button key={v} className="lh-thumb" type="button" aria-pressed={view === v} onClick={() => setView(v)}>
            <span className="lh-thumb__img">
              {v === "jeu" && <TablePlateaux plateau="bacs" label="" viewBox="10 80 380 185" />}
              {v === "fermee" && <ArtTableDeJeu viewBox="10 80 380 185" />}
              {v === "detail" && <ArtDetailAssemblage numbered={false} />}
              {v === "plat" && <ArtLivreeAPlat />}
            </span>
            <span>{t(`viewNames.${v}`)}</span>
          </button>
        ))}
      </div>

      {view === "detail" && (
        <ol className="lh-legend">
          {(t.raw("legend") as string[]).map((l, i) => <li key={l}><b>{i + 1}</b>{l}</li>)}
        </ol>
      )}
    </div>
  );
}
