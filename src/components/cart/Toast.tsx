"use client";

import { useTranslations } from "next-intl";
import { useCart } from "./CartProvider";
import { ProductArt } from "@/components/art/byKey";
import { Icon } from "@/components/ui/icons";

/** Confirmation d'ajout au panier (composant Toast). */
export function CartToast() {
  const t = useTranslations("cart");
  const { toast, closeToast, setOpen } = useCart();
  if (!toast) return null;
  return (
    <div className="lh lh-toast-dock">
      <div className="lh-toast" role="status">
        <div className="lh-toast__thumb lh-toast__thumb--art"><ProductArt art={toast.art} /></div>
        <div>
          <div className="lh-toast__title"><Icon name="check" />{t("added")}</div>
          <div className="lh-toast__text">{toast.name}</div>
        </div>
        <button className="lh-link" type="button" onClick={() => { closeToast(); setOpen(true); }}>{t("view")}</button>
      </div>
    </div>
  );
}
