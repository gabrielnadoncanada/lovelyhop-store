import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Webhook Shopify (produits, collections, stocks) : rafraîchit le cache du catalogue.
 * Les abonnements sont créés par `node scripts/shopify-webhooks.mjs` au nom de l'app « Lovelyhop site CPE » ;
 * Shopify les signe alors avec SHOPIFY_ADMIN_CLIENT_SECRET. Un webhook créé à la main dans
 * Paramètres › Notifications › Webhooks est signé avec la clé de cette page : SHOPIFY_WEBHOOK_SECRET.
 * Les deux signatures sont acceptées.
 */
export async function POST(request: Request) {
  const secrets = [process.env.SHOPIFY_WEBHOOK_SECRET, process.env.SHOPIFY_ADMIN_CLIENT_SECRET].filter((s): s is string => !!s);
  if (!secrets.length) return new Response("SHOPIFY_WEBHOOK_SECRET ou SHOPIFY_ADMIN_CLIENT_SECRET manquant", { status: 500 });
  const body = await request.text();
  const given = Buffer.from(request.headers.get("x-shopify-hmac-sha256") ?? "");
  const ok = secrets.some((secret) => {
    const expected = Buffer.from(createHmac("sha256", secret).update(body, "utf8").digest("base64"));
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  if (!ok) return new Response("Signature invalide", { status: 401 });
  revalidateTag("catalog", "max");
  return Response.json({ revalidated: true });
}
