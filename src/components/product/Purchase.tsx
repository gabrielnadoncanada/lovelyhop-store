"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/format";
import type { Locale, Product } from "@/lib/types";

/** État d'achat partagé entre le bloc d'achat et la barre collante mobile. */
type Purchase = {
  product: Product;
  addons: Product[];
  variantId: string;
  setVariantId: (id: string) => void;
  chosen: string[];
  toggle: (handle: string) => void;
  qty: number;
  setQty: (n: number) => void;
  buy: () => void;
  pending: boolean;
};
const Ctx = createContext<Purchase | null>(null);
const usePurchase = () => { const c = useContext(Ctx); if (!c) throw new Error("PurchaseProvider manquant"); return c; };

export function PurchaseProvider({ product, addons, children }: { product: Product; addons: Product[]; children: React.ReactNode }) {
  const { add, pending } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [chosen, setChosen] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const value = useMemo<Purchase>(() => ({
    product, addons, variantId, setVariantId, chosen, qty, setQty, pending,
    toggle: (h) => setChosen((c) => (c.includes(h) ? c.filter((x) => x !== h) : [...c, h])),
    buy: () => {
      const v = product.variants.find((x) => x.id === variantId) ?? product.variants[0];
      if (!v) return;
      const extra = addons.filter((a) => chosen.includes(a.handle) && a.variants[0]).map((a) => ({ variantId: a.variants[0].id, quantity: qty }));
      const n = extra.length;
      const name = `${product.title}${v.title ? ` · ${v.title}` : ""}${n ? ` + ${n}` : ""}${qty > 1 ? ` (× ${qty})` : ""}`;
      add([{ variantId: v.id, quantity: qty }, ...extra], { name, art: product.art });
    },
  }), [product, addons, variantId, chosen, qty, pending, add]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Titre : le dernier mot passe en italique terre cuite, comme dans le design system. */
function Title({ text }: { text: string }) {
  const i = text.lastIndexOf(" ");
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)} <em>{text.slice(i + 1)}</em></>;
}

/** Bloc d'achat (composant ProductBuy) : ensemble, accessoires, quantité, ajout au panier. */
export function BuyBox({ eyebrow }: { eyebrow: string }) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { product, addons, variantId, setVariantId, chosen, toggle, qty, setQty, buy, pending } = usePurchase();
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const assure = t.raw("assure") as [string, string][];
  const assureIcons = ["truck", "tool", "cycle", "heart"] as const;
  return (
    <div className="lh-buy">
      <span className="lh-eyebrow">{eyebrow}</span>
      <h1 className="lh-buy__title"><Title text={product.title} /></h1>
      <p className="lh-buy__lead">{product.details?.lead ?? product.description}</p>
      <div className="lh-buy__pricing">
        <span className="lh-price lh-price--lg"><span className="lh-price__now">{formatMoney(variant?.price ?? product.minPrice, locale)}</span></span>
        {product.availableForSale
          ? <span className="lh-stock lh-stock--in">{t("inStock")}</span>
          : <span className="lh-stock lh-stock--out">{t("soldOut")}</span>}
      </div>
      {product.details?.shipping && <p className="lh-buy__ship">{product.details.shipping}</p>}

      {product.variants.length > 1 && (
        <fieldset className="lh-opt">
          <legend className="lh-opt__head"><span className="lh-eyebrow">{t("set")}</span><span className="lh-opt__value">{variant?.title}</span></legend>
          <div className="lh-options">
            {product.variants.map((v) => (
              <button key={v.id} className="lh-option" type="button" aria-pressed={v.id === variantId} onClick={() => setVariantId(v.id)} disabled={!v.availableForSale}>
                <span className="lh-option__dot" aria-hidden="true" />
                <span className="lh-option__txt"><strong>{v.title}</strong>{v.description && <small>{v.description}</small>}</span>
                <span className="lh-option__price">{formatMoney(v.price, locale)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {addons.length > 0 && (
        <fieldset className="lh-opt">
          <legend className="lh-opt__head"><span className="lh-eyebrow">{t("addons")}</span><span className="lh-opt__value">{chosen.length ? t("addonsCount", { count: chosen.length }) : t("optional")}</span></legend>
          <div className="lh-addons">
            {addons.map((a) => (
              <button key={a.handle} className="lh-addon" type="button" aria-pressed={chosen.includes(a.handle)} onClick={() => toggle(a.handle)}>
                <span className="lh-addon__box" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
                <span>{a.title}<small>{a.description}</small></span>
                <span className="lh-addon__price">+{formatMoney(a.minPrice, locale)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="lh-buy__cta">
        <div className="lh-qty" role="group" aria-label={t("qty")}>
          <button type="button" aria-label={t("minus")} aria-disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus" /></button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label={t("plus")} onClick={() => setQty(Math.min(10, qty + 1))}><Icon name="plus" /></button>
        </div>
        <button className="lh-btn lh-btn--primary lh-btn--lg lh-buy__add" type="button" onClick={buy} disabled={pending || !product.availableForSale}>
          <Icon name="bag" />{tc("addToCart")}
        </button>
      </div>

      <div className="lh-pro-box">
        <span className="lh-pro-box__ico"><Icon name="home" /></span>
        <p><strong>{t("proBoxTitle")}</strong>{t("proBoxText")}</p>
        <Link className="lh-link" href="/daycares">{t("proBoxLink")}</Link>
      </div>

      <ul className="lh-assure">
        {assure.map(([b, s], i) => (
          <li key={b}><span className="lh-assure__ico"><Icon name={assureIcons[i]} /></span><span><strong>{b}</strong>{s}</span></li>
        ))}
      </ul>
    </div>
  );
}

/** Barre d'achat collante (mobile, après le bouton principal). */
export function BuyBar() {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { product, variantId, buy, pending } = usePurchase();
  const v = product.variants.find((x) => x.id === variantId) ?? product.variants[0];
  return (
    <div className="lh-buybar" role="region" aria-label={t("buyBar")}>
      <div><span className="lh-buybar__name">{product.title}</span><span className="lh-buybar__price">{v?.title ? `${v.title} · ` : ""}{formatMoney(v?.price ?? product.minPrice, locale)}</span></div>
      <button className="lh-btn lh-btn--primary" type="button" onClick={buy} disabled={pending || !product.availableForSale}>{tc("addToCart")}</button>
    </div>
  );
}
