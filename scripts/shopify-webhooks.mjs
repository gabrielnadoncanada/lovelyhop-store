/**
 * Enregistre (ou vérifie) les webhooks qui rafraîchissent le cache du catalogue :
 * produits, collections et niveaux de stock → https://<site>/api/revalidate.
 *
 * Les abonnements appartiennent à l'app « Lovelyhop site CPE » (Dev Dashboard) ; Shopify les
 * signe avec le secret client de cette app, que src/app/api/revalidate/route.ts vérifie.
 *
 * Lancé par `pnpm build` (donc à chaque déploiement Vercel, où les variables existent) : idempotent,
 * et jamais bloquant — sans variables ou en cas d'erreur, il avertit et laisse le build continuer.
 * Variables lues : SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET,
 * NEXT_PUBLIC_SITE_URL (adresse publique du site).
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lovelyhop.com").replace(/\/$/, "");
const version = process.env.SHOPIFY_API_VERSION ?? "2026-10";
const callbackUrl = `${site}/api/revalidate`;
const TOPICS = ["PRODUCTS_CREATE", "PRODUCTS_UPDATE", "PRODUCTS_DELETE", "COLLECTIONS_UPDATE", "INVENTORY_LEVELS_UPDATE"];

if (!domain || !clientId || !clientSecret || process.env.VERCEL_ENV === "preview") {
  console.log("[webhooks] variables Shopify Admin absentes ou environnement de prévisualisation : rien à faire.");
  process.exit(0);
}

try {
  await register();
} catch (e) {
  console.warn("[webhooks] non enregistrés :", e instanceof Error ? e.message : e);
}

async function register() {
  const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
  });
  if (!tokenRes.ok) throw new Error(`jeton refusé : ${tokenRes.status} ${await tokenRes.text()}`);
  const { access_token: token } = await tokenRes.json();

  async function gql(query, variables = {}) {
    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(" · "));
    return json.data;
  }

  const existing = await gql(`{ webhookSubscriptions(first: 50) { nodes { id topic endpoint { ... on WebhookHttpEndpoint { callbackUrl } } } } }`);
  const have = new Map(existing.webhookSubscriptions.nodes.map((n) => [n.topic, n]));

  for (const topic of TOPICS) {
    const cur = have.get(topic);
    if (cur?.endpoint?.callbackUrl === callbackUrl) { console.log(`[webhooks] = ${topic} déjà en place`); continue; }
    if (cur) {
      const r = await gql(`mutation($id: ID!, $w: WebhookSubscriptionInput!) { webhookSubscriptionUpdate(id: $id, webhookSubscription: $w) { userErrors { message } } }`, { id: cur.id, w: { callbackUrl } });
      const err = r.webhookSubscriptionUpdate.userErrors; if (err.length) throw new Error(err.map((e) => e.message).join(" · "));
      console.log(`[webhooks] ~ ${topic} mis à jour → ${callbackUrl}`); continue;
    }
    const r = await gql(`mutation($t: WebhookSubscriptionTopic!, $w: WebhookSubscriptionInput!) { webhookSubscriptionCreate(topic: $t, webhookSubscription: $w) { userErrors { message } } }`, { t: topic, w: { callbackUrl, format: "JSON" } });
    const err = r.webhookSubscriptionCreate.userErrors; if (err.length) throw new Error(`${topic} : ` + err.map((e) => e.message).join(" · "));
    console.log(`[webhooks] + ${topic} créé → ${callbackUrl}`);
  }
  console.log("[webhooks] terminé.");
}
