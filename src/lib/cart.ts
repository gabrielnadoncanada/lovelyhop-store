import "server-only";
import { cookies } from "next/headers";
import { demo } from "@/lib/demo/catalog";
import { isShopifyConfigured, shopifyLanguage, storefront } from "@/lib/shopify/client";
import { mapCart, type RawCart } from "@/lib/shopify/map";
import { CART_ADD, CART_CREATE, CART_QUERY, CART_REMOVE, CART_UPDATE } from "@/lib/shopify/queries";
import type { Cart, Locale } from "@/lib/types";

/**
 * Panier. Avec Shopify : Cart API, identifiant du panier dans un cookie, paiement sur le checkout Shopify.
 * En démonstration : les lignes sont gardées dans le cookie, sans paiement.
 */

const COOKIE = "lh_cart";
/** Le panier de démonstration a son propre cookie : un ancien panier démo ne doit jamais être envoyé à Shopify. */
const DEMO_COOKIE = "lh_cart_demo";
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 };
type DemoLine = { v: string; q: number };

const empty = (demoMode: boolean): Cart => ({ id: null, checkoutUrl: null, totalQuantity: 0, lines: [], subtotal: null, demo: demoMode });

function demoCart(lines: DemoLine[], locale: Locale): Cart {
  const out: Cart = empty(true);
  for (const l of lines) {
    const found = demo.variant(l.v, locale);
    if (!found) continue;
    out.lines.push({
      id: l.v, quantity: l.q, variantId: l.v, variantTitle: found.variant.title,
      product: { handle: found.product.handle, title: found.product.title, art: found.product.art, image: null },
      unitPrice: null, total: null,
    });
    out.totalQuantity += l.q;
  }
  return out;
}

async function readDemo(): Promise<DemoLine[]> {
  const raw = (await cookies()).get(DEMO_COOKIE)?.value;
  try { return raw ? (JSON.parse(raw) as DemoLine[]) : []; } catch { return []; }
}
async function writeDemo(lines: DemoLine[]) {
  (await cookies()).set(DEMO_COOKIE, JSON.stringify(lines.filter((l) => l.q > 0)), cookieOptions);
}

/** Identifiant de panier Shopify valide, ou null (cookie absent, ancien format, valeur abîmée). */
async function shopifyCartId(): Promise<string | null> {
  const id = (await cookies()).get(COOKIE)?.value;
  return id && id.startsWith("gid://shopify/Cart/") ? id : null;
}

/** Oublie le panier (expiré, déjà payé ou invalide). Sans effet pendant un rendu, où les cookies sont en lecture seule. */
async function forgetCart() {
  try { (await cookies()).delete(COOKIE); } catch { /* rendu serveur : rien à faire */ }
}

export async function getCart(locale: Locale): Promise<Cart> {
  if (!isShopifyConfigured) return demoCart(await readDemo(), locale);
  const id = await shopifyCartId();
  if (!id) {
    if ((await cookies()).get(COOKIE)) await forgetCart();
    return empty(false);
  }
  try {
    const data = await storefront<{ cart: RawCart | null }>(CART_QUERY, { id, language: shopifyLanguage(locale) });
    if (data.cart) return mapCart(data.cart);
  } catch (e) {
    console.error("Panier Shopify illisible, on repart d'un panier vide", e);
  }
  await forgetCart();
  return empty(false);
}

export async function addLines(lines: { variantId: string; quantity: number }[], locale: Locale): Promise<Cart> {
  if (!isShopifyConfigured) {
    const current = await readDemo();
    for (const l of lines) {
      const ex = current.find((c) => c.v === l.variantId);
      if (ex) ex.q += l.quantity; else current.push({ v: l.variantId, q: l.quantity });
    }
    await writeDemo(current);
    return demoCart(current, locale);
  }
  const input = lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity }));
  const jar = await cookies();
  const id = await shopifyCartId();
  const language = shopifyLanguage(locale);
  if (id) {
    try {
      const data = await storefront<{ cartLinesAdd: { cart: RawCart | null } }>(CART_ADD, { id, lines: input, language });
      if (data.cartLinesAdd.cart) return mapCart(data.cartLinesAdd.cart);
    } catch (e) {
      // Panier expiré ou déjà converti en commande : on en crée un nouveau.
      console.error("Ajout au panier Shopify refusé, nouveau panier", e);
    }
  }
  const created = await storefront<{ cartCreate: { cart: RawCart } }>(CART_CREATE, { lines: input, language });
  jar.set(COOKIE, created.cartCreate.cart.id, cookieOptions);
  return mapCart(created.cartCreate.cart);
}

export async function updateLine(lineId: string, quantity: number, locale: Locale): Promise<Cart> {
  if (!isShopifyConfigured) {
    const current = (await readDemo()).map((l) => (l.v === lineId ? { ...l, q: quantity } : l));
    await writeDemo(current);
    return demoCart(current.filter((l) => l.q > 0), locale);
  }
  const id = await shopifyCartId();
  if (!id) return empty(false);
  const language = shopifyLanguage(locale);
  if (quantity <= 0) {
    const data = await storefront<{ cartLinesRemove: { cart: RawCart } }>(CART_REMOVE, { id, lineIds: [lineId], language });
    return mapCart(data.cartLinesRemove.cart);
  }
  const data = await storefront<{ cartLinesUpdate: { cart: RawCart } }>(CART_UPDATE, { id, lines: [{ id: lineId, quantity }], language });
  return mapCart(data.cartLinesUpdate.cart);
}
