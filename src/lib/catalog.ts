import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { demo } from "@/lib/demo/catalog";
import { isShopifyConfigured, shopifyLanguage, storefront } from "@/lib/shopify/client";
import { mapProduct, type RawProduct } from "@/lib/shopify/map";
import {
  ALL_PRODUCTS_QUERY, COLLECTION_HANDLE_QUERY, COLLECTION_QUERY, PRODUCT_HANDLE_QUERY, PRODUCT_QUERY,
  PRODUCTS_BY_HANDLES_QUERY, SEARCH_QUERY,
} from "@/lib/shopify/queries";
import type { Collection, Locale, Product } from "@/lib/types";
import { routing } from "@/i18n/routing";

/**
 * Accès au catalogue. Tout est mis en cache (« use cache ») avec l'étiquette « catalog » :
 * le webhook /api/revalidate la rafraîchit quand un produit change dans Shopify.
 */

const other = (l: Locale): Locale => (l === "fr" ? "en" : "fr");

async function withHandles<T extends { handles: Partial<Record<Locale, string>> }>(item: T, id: string, locale: Locale, query: string, key: "product" | "collection"): Promise<T> {
  const alt = other(locale);
  const data = await storefront<Record<string, { handle: string } | null>>(query, { id, language: shopifyLanguage(alt) });
  return { ...item, handles: { [locale]: (item as unknown as { handle: string }).handle, [alt]: data[key]?.handle } };
}

export async function getProduct(handle: string, locale: Locale): Promise<Product | null> {
  "use cache";
  cacheTag("catalog", `product:${handle}`);
  cacheLife("hours");
  if (!isShopifyConfigured) return demo.product(handle, locale);
  const data = await storefront<{ product: RawProduct | null }>(PRODUCT_QUERY, { handle, language: shopifyLanguage(locale) });
  if (!data.product) return null;
  return withHandles(mapProduct(data.product), data.product.id, locale, PRODUCT_HANDLE_QUERY, "product");
}

export async function getProducts(handles: string[], locale: Locale): Promise<Product[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  if (!handles.length) return [];
  if (!isShopifyConfigured) return demo.products(handles, locale);
  const query = handles.map((h) => `handle:${h}`).join(" OR ");
  const data = await storefront<{ products: { nodes: RawProduct[] } }>(PRODUCTS_BY_HANDLES_QUERY, { query, language: shopifyLanguage(locale) });
  const byHandle = new Map(data.products.nodes.map((p) => [p.handle, mapProduct(p)]));
  return handles.map((h) => byHandle.get(h)).filter((p): p is Product => !!p);
}

export async function getCollection(handle: string, locale: Locale): Promise<Collection | null> {
  "use cache";
  cacheTag("catalog", `collection:${handle}`);
  cacheLife("hours");
  if (!isShopifyConfigured) return demo.collection(handle, locale);
  type Raw = { id: string; handle: string; title: string; description: string; univers: { value: string } | null; products: { nodes: RawProduct[] } };
  const data = await storefront<{ collection: Raw | null }>(COLLECTION_QUERY, { handle, language: shopifyLanguage(locale) });
  const c = data.collection;
  if (!c) return null;
  const col: Collection = {
    handle: c.handle, title: c.title, description: c.description,
    univers: (c.univers?.value as Collection["univers"]) ?? null,
    products: c.products.nodes.map(mapProduct), handles: {},
  };
  return withHandles(col, c.id, locale, COLLECTION_HANDLE_QUERY, "collection");
}

export async function searchProducts(q: string, locale: Locale): Promise<Product[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife("minutes");
  if (q.trim().length < 2) return [];
  if (!isShopifyConfigured) return demo.search(q, locale);
  const data = await storefront<{ predictiveSearch: { products: RawProduct[] } | null }>(SEARCH_QUERY, { q, language: shopifyLanguage(locale) });
  return (data.predictiveSearch?.products ?? []).map(mapProduct);
}

/** Pour le plan du site : handles de tous les produits et collections, dans chaque langue. */
/** Un produit du catalogue dans les deux langues, pour le sitemap, llms.txt et le prérendu des fiches. */
export type CatalogEntry = {
  id: string;
  handles: Partial<Record<Locale, string>>;
  titles: Partial<Record<Locale, string>>;
  descriptions: Partial<Record<Locale, string>>;
  univers: string | null;
  image: string | null;
  updatedAt: string | null;
};

/** Index complet du catalogue (toutes les pages de produits, les deux langues, reliées par l'identifiant Shopify). */
export async function getCatalogIndex(): Promise<{ products: CatalogEntry[]; collections: Partial<Record<Locale, string>>[] }> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  if (!isShopifyConfigured) {
    const fr = demo.allProducts("fr"), en = demo.allProducts("en");
    return {
      products: fr.map((p, i) => ({
        id: p.id, handles: p.handles, titles: { fr: p.title, en: en[i]?.title }, descriptions: { fr: p.description, en: en[i]?.description },
        univers: p.univers, image: p.images[0]?.url ?? null, updatedAt: null,
      })),
      collections: demo.collectionHandles(),
    };
  }
  const byId = new Map<string, CatalogEntry>();
  for (const locale of routing.locales) {
    let cursor: string | null = null;
    do {
      type Node = { id: string; handle: string; title: string; description: string; updatedAt: string; featuredImage: { url: string } | null; univers: { value: string } | null };
      type Page = { products: { nodes: Node[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } };
      const data: Page = await storefront<Page>(ALL_PRODUCTS_QUERY, { language: shopifyLanguage(locale), cursor });
      for (const n of data.products.nodes) {
        const e = byId.get(n.id) ?? { id: n.id, handles: {}, titles: {}, descriptions: {}, univers: n.univers?.value ?? null, image: n.featuredImage?.url ?? null, updatedAt: n.updatedAt };
        e.handles[locale] = n.handle;
        e.titles[locale] = n.title;
        e.descriptions[locale] = n.description;
        byId.set(n.id, e);
      }
      cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
    } while (cursor);
  }
  return { products: [...byId.values()], collections: demo.collectionHandles() };
}

export { UNIVERS_HANDLES, FEATURED_HANDLE } from "@/lib/constants";
