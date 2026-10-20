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
export async function getSitemapEntries(): Promise<{ products: Record<Locale, string[]>; collections: Partial<Record<Locale, string>>[] }> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  if (!isShopifyConfigured) {
    return {
      products: { fr: demo.allProducts("fr").map((p) => p.handle), en: demo.allProducts("en").map((p) => p.handle) },
      collections: demo.collectionHandles(),
    };
  }
  const products = {} as Record<Locale, string[]>;
  for (const locale of routing.locales) {
    const handles: string[] = [];
    let cursor: string | null = null;
    do {
      type Page = { products: { nodes: { handle: string }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } };
      const data: Page = await storefront<Page>(ALL_PRODUCTS_QUERY, { language: shopifyLanguage(locale), cursor });
      handles.push(...data.products.nodes.map((n) => n.handle));
      cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
    } while (cursor);
    products[locale] = handles;
  }
  return { products, collections: demo.collectionHandles() };
}

export { UNIVERS_HANDLES, FEATURED_HANDLE } from "@/lib/constants";
