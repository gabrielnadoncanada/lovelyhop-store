import type { ArtKey, Cart, Money, Product, ProductDetails, ShopImage, UniversKey } from "@/lib/types";

type Meta = { value: string } | null;
export type RawProduct = {
  id: string; handle: string; title: string; description: string; availableForSale: boolean;
  seo: { title: string | null; description: string | null };
  priceRange: { minVariantPrice: Money };
  images: { nodes: ShopImage[] };
  variants: { nodes: { id: string; title: string; availableForSale: boolean; price: Money; description: Meta }[] };
  univers: Meta; age: Meta; materiau: Meta; badge: Meta; dessin: Meta; details: Meta;
};

const UNIVERS: UniversKey[] = ["creer", "imaginer", "ranger", "bouger", "cpe"];
const BADGES = ["phare", "nouveau", "bientot"] as const;

/** Un prix à 0 $ veut dire « pas encore fixé » dans Shopify : affiché « [prix] » comme dans la démo, jamais « 0,00 $ ». */
const price = (m: Money | null | undefined): Money | null => (m && Number(m.amount) > 0 ? m : null);
/** Variante unique de Shopify : « Default Title » n'a rien à faire à l'écran. */
const variantTitle = (t: string) => (t === "Default Title" ? "" : t);

function parseDetails(m: Meta): ProductDetails | null {
  if (!m?.value) return null;
  try { return JSON.parse(m.value) as ProductDetails; } catch { return null; }
}

export function mapProduct(p: RawProduct): Product {
  const univers = UNIVERS.includes(p.univers?.value as UniversKey) ? (p.univers!.value as UniversKey) : null;
  const badge = (BADGES as readonly string[]).includes(p.badge?.value ?? "") ? (p.badge!.value as Product["badge"]) : null;
  return {
    id: p.id, handle: p.handle, title: p.title, description: p.description, univers,
    age: p.age?.value ?? "", material: p.materiau?.value ?? "", badge,
    art: (p.dessin?.value as ArtKey) ?? null, images: p.images.nodes,
    minPrice: price(p.priceRange.minVariantPrice),
    variants: p.variants.nodes.map((v) => ({ id: v.id, title: variantTitle(v.title), price: price(v.price), availableForSale: v.availableForSale, description: v.description?.value })),
    availableForSale: p.availableForSale, seo: p.seo, details: parseDetails(p.details), handles: {},
  };
}

export type RawCart = {
  id: string; checkoutUrl: string; totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: { nodes: { id: string; quantity: number; cost: { totalAmount: Money; amountPerQuantity: Money };
    merchandise: { id: string; title: string; product: { handle: string; title: string; featuredImage: ShopImage | null; dessin: Meta } } }[] };
};

export function mapCart(c: RawCart): Cart {
  return {
    id: c.id, checkoutUrl: c.checkoutUrl, totalQuantity: c.totalQuantity, subtotal: c.cost.subtotalAmount, demo: false,
    lines: c.lines.nodes.map((l) => ({
      id: l.id, quantity: l.quantity, variantId: l.merchandise.id, variantTitle: variantTitle(l.merchandise.title),
      product: { handle: l.merchandise.product.handle, title: l.merchandise.product.title, art: (l.merchandise.product.dessin?.value as ArtKey) ?? null, image: l.merchandise.product.featuredImage },
      unitPrice: l.cost.amountPerQuantity, total: l.cost.totalAmount,
    })),
  };
}
