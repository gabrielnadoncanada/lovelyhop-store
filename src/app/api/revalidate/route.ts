import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Webhook Shopify (produits, collections, stocks) : rafraîchit le cache du catalogue.
 * Dans Shopify : Paramètres › Notifications › Webhooks › « Mise à jour de produit » etc.,
 * URL https://<domaine>/api/revalidate, format JSON. La clé de signature va dans SHOPIFY_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return new Response("SHOPIFY_WEBHOOK_SECRET manquant", { status: 500 });
  const body = await request.text();
  const given = request.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", secret).update(body, "utf8").digest("base64");
  const ok = given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return new Response("Signature invalide", { status: 401 });
  revalidateTag("catalog", "max");
  return Response.json({ revalidated: true });
}
