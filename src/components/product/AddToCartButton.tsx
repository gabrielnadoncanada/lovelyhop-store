"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/icons";
import type { ArtKey } from "@/lib/types";

export function AddToCartButton({ variantId, name, art, className, label, icon, disabled }: {
  variantId: string | null; name: string; art: ArtKey | null; className: string; label?: string; icon?: boolean; disabled?: boolean;
}) {
  const t = useTranslations("common");
  const { add, pending } = useCart();
  return (
    <button className={className} type="button" disabled={!variantId || disabled || pending} aria-label={label}
      onClick={() => variantId && add([{ variantId, quantity: 1 }], { name, art })}>
      {icon && <Icon name="plus" />}{label && icon ? t("add") : t("addToCart")}
    </button>
  );
}
