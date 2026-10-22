import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProductArt, isNarrowArt } from "@/components/art/byKey";
import { AddToCartButton } from "./AddToCartButton";
import { Icon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/format";
import type { Locale, Product } from "@/lib/types";

/** Carte produit (composant ProductCard) : vignette en arche, dessin ou photo, ajout rapide. */
export async function ProductCard({ product }: { product: Product }) {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const image = product.images[0];
  const badgeClass = product.badge === "phare" ? "lh-badge lh-badge--new" : "lh-badge";
  return (
    <article className="lh-card">
      <div className="lh-card__media">
        <div className="lh-card__scene" />
        <div className={isNarrowArt(product.art) ? "lh-card__art lh-card__art--narrow" : "lh-card__art"}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.altText ?? product.title} width={image.width} height={image.height} loading="lazy" />
          ) : (
            <ProductArt art={product.art} />
          )}
        </div>
        {product.badge && <div className="lh-card__badges"><span className={badgeClass}>{t(`badge.${product.badge}`)}</span></div>}
        <button className="lh-icon-btn lh-icon-btn--solid lh-card__fav" type="button" aria-label={t("favorite", { name: product.title })}><Icon name="heart" /></button>
        <div className="lh-card__add">
          <AddToCartButton className="lh-btn lh-btn--primary lh-btn--block lh-btn--sm" variantId={product.variants[0]?.id ?? null} name={product.title} art={product.art} disabled={!product.availableForSale} />
        </div>
      </div>
      <div className="lh-card__body">
        <span className="lh-card__age">{product.age}</span>
        <h3 className="lh-card__name"><Link href={{ pathname: "/[handle]", params: { handle: product.handle } }}>{product.title}</Link></h3>
        <div className="lh-card__meta">
          <span className="lh-card__material">{product.material}</span>
          <div className="lh-swatches lh-swatches--sm"><span className="lh-swatch lh-dot-wood" /></div>
        </div>
        <div className="lh-card__buy">
          <span className="lh-price"><span className="lh-price__now">{formatMoney(product.minPrice, locale)}</span></span>
          {/* Au toucher, pas de survol : un bouton rond d'ajout rapide à côté du prix, hors de l'image. */}
          <div className="lh-card__quick">
            <AddToCartButton className="lh-card__quick-btn" variantId={product.variants[0]?.id ?? null} name={product.title} art={product.art} label={t("addToCart")} iconOnly disabled={!product.availableForSale} />
          </div>
        </div>
      </div>
    </article>
  );
}
