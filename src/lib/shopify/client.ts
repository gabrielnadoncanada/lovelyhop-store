import "server-only";
import type { Locale } from "@/lib/types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-10";

/** Faux tant que la boutique n'est pas branchée : le site utilise alors le catalogue de démonstration. */
export const isShopifyConfigured = Boolean(domain && token);

export const shopifyLanguage = (locale: Locale) => (locale === "en" ? "EN" : "FR");

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

/**
 * Appel à l'API Storefront. Toutes les requêtes passent par @inContext(language, country)
 * pour recevoir les traductions (Translate & Adapt) et les prix du marché Canada.
 */
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isShopifyConfigured) throw new Error("Shopify n'est pas configuré (voir .env.example).");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token! },
    body: JSON.stringify({ query, variables: { country: "CA", ...variables } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify ${res.status} : ${await res.text()}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(" · "));
  return json.data as T;
}
