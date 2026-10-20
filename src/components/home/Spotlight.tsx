"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TablePlateaux } from "@/components/art";
import { Icon } from "@/components/ui/icons";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/format";
import type { Locale, Plateau, Product } from "@/lib/types";

/** Produit phare (composant Spotlight) : la table et ses plateaux interchangeables. */
export function Spotlight({ product }: { product: Product | null }) {
  const t = useTranslations("home");
  const tp = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { add, pending } = useCart();
  const [plateau, setPlateau] = useState<Plateau>("bacs");
  const feats = t.raw("feats") as [string, string][];
  return (
    <section className="lh-sec" id="phare">
      <div className="lh-spotlight">
        <div className="lh-spotlight__art">
          <span className="lh-spotlight__note" aria-hidden="true">{t("phareNote")}</span>
          <TablePlateaux plateau={plateau} label={tp("labels.jeu", { with: tp(`with.${plateau}`) })} />
        </div>
        <div className="lh-spotlight__content">
          <span className="lh-eyebrow">{t("phareEyebrow")}</span>
          <h2 className="lh-spotlight__title">{t("phareTitle")} <em>{t("phareEm")}</em></h2>
          <p className="lh-spotlight__lead">{t("phareLead")}</p>
          <div className="lh-try">
            <span className="lh-eyebrow">{t("phareTry")}</span>
            <div className="lh-try__row" role="group" aria-label={t("phareTry")}>
              {(["bacs", "art", "lumiere"] as Plateau[]).map((p) => (
                <button key={p} type="button" className="lh-chip lh-chip--plain" aria-pressed={plateau === p} onClick={() => setPlateau(p)}>{tp(`plateaux.${p}`)}</button>
              ))}
            </div>
          </div>
          <ul className="lh-feats">
            {feats.map(([b, s]) => (
              <li key={b}><span className="lh-feats__check"><Icon name="check" /></span><span><strong>{b}</strong> {s}</span></li>
            ))}
          </ul>
          <div className="lh-buyline">
            <div><span className="lh-buyline__from">{tc("from")}</span><span className="lh-price">{formatMoney(product?.minPrice, locale)}</span></div>
            <button className="lh-btn lh-btn--primary" type="button" disabled={!product || pending}
              onClick={() => product && add([{ variantId: product.variants[0].id, quantity: 1 }], { name: `${product.title} · ${product.variants[0].title}`, art: product.art })}>
              <Icon name="plus" />{tc("addToCart")}
            </button>
            {product && <Link className="lh-link" href={{ pathname: "/[handle]", params: { handle: product.handle } }}>{t("phareLink")}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
