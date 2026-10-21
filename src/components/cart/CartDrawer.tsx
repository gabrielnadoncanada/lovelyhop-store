"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartProvider";
import { ProductArt } from "@/components/art/byKey";
import { ArtTableSensorielle } from "@/components/art";
import { Icon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/format";
import { FEATURED_HANDLE } from "@/lib/constants";
import type { Locale } from "@/lib/types";

/** Panier latéral (composant CartDrawer du design system). Le paiement se fait sur le checkout Shopify. */
export function CartDrawer() {
  const t = useTranslations("cart");
  const tp = useTranslations("product");
  const locale = useLocale() as Locale;
  const { cart, open, setOpen, setQuantity, pending, error } = useCart();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, setOpen]);

  if (!open) return null;
  const lines = cart?.lines ?? [];

  return (
    <div className="lh lh-overlay lh-overlay--right">
      <div className="lh-scrim" onClick={() => setOpen(false)} />
      <aside className="lh-drawer" aria-label={t("title")} role="dialog" aria-modal="true" ref={panel} aria-busy={pending}>
        <div className="lh-drawer__head">
          <h2 className="lh-drawer__title">{t("title")}{cart && cart.totalQuantity > 0 && <sup>{cart.totalQuantity}</sup>}</h2>
          <button className="lh-icon-btn lh-icon-btn--outline" type="button" aria-label={t("close")} onClick={() => setOpen(false)}><Icon name="close" /></button>
        </div>

        {lines.length === 0 ? (
          <div className="lh-empty" style={{ flex: 1, padding: "32px 24px" }}>
            <div className="lh-empty__art" style={{ display: "grid", placeItems: "end center", width: 220, margin: "0 auto" }}><ArtTableSensorielle /></div>
            <h3 className="lh-empty__title">{t("empty")}</h3>
            <p>{t("emptyText")}</p>
            <Link className="lh-btn lh-btn--primary" href={{ pathname: "/[handle]", params: { handle: FEATURED_HANDLE[locale] } }} onClick={() => setOpen(false)}>{t("emptyCta")}</Link>
          </div>
        ) : (
          <ul className="lh-drawer__items">
            {lines.map((l) => (
              <li className="lh-line" key={l.id}>
                <div className="lh-line__thumb" style={{ background: "var(--sage-soft)", display: "grid", placeItems: "end center", padding: "0 8% 10%" }}>
                  <ProductArt art={l.product.art} />
                </div>
                <div>
                  <h3 className="lh-line__name"><Link href={{ pathname: "/[handle]", params: { handle: l.product.handle } }} onClick={() => setOpen(false)}>{l.product.title}</Link></h3>
                  <p className="lh-line__variant">{l.variantTitle}</p>
                  <div className="lh-qty lh-qty--sm" role="group" aria-label={tp("qty")}>
                    <button type="button" aria-label={tp("minus")} disabled={l.quantity <= 1 || pending} onClick={() => setQuantity(l.id, l.quantity - 1)}><Icon name="minus" /></button>
                    <output aria-live="polite">{l.quantity}</output>
                    <button type="button" aria-label={tp("plus")} disabled={pending} onClick={() => setQuantity(l.id, l.quantity + 1)}><Icon name="plus" /></button>
                  </div>
                </div>
                <div className="lh-line__side">
                  <span className="lh-price">{formatMoney(l.total, locale)}</span>
                  <button className="lh-line__remove" type="button" disabled={pending} onClick={() => setQuantity(l.id, 0)}>{t("remove")}</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="lh-drawer__foot">
            {error && <div className="lh-notice lh-notice--danger" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{t("error")}</div></div>}
            <div className="lh-drawer__row"><span>{t("subtotal")}</span><strong>{formatMoney(cart?.subtotal, locale)}</strong></div>
            {cart?.checkoutUrl ? (
              <a className="lh-btn lh-btn--primary lh-btn--block lh-btn--lg" style={{ justifyContent: "space-between" }} href={cart.checkoutUrl}>
                {t("checkout")}<span className="lh-btn__arrow"><Icon name="arrow" /></span>
              </a>
            ) : (
              <button className="lh-btn lh-btn--primary lh-btn--block lh-btn--lg" style={{ justifyContent: "space-between" }} type="button" disabled>
                {t("checkout")}<span className="lh-btn__arrow"><Icon name="arrow" /></span>
              </button>
            )}
            <span className="lh-help" style={{ justifyContent: "center", textAlign: "center" }}>{cart?.demo ? t("demo") : t("taxes")}</span>
          </div>
        )}
      </aside>
    </div>
  );
}
