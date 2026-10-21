import "server-only";

/**
 * API Admin de Shopify, utilisée seulement côté serveur pour enregistrer les demandes de
 * soumission CPE comme clients. Deux façons de s'authentifier :
 * - SHOPIFY_ADMIN_CLIENT_ID + SHOPIFY_ADMIN_CLIENT_SECRET : app créée dans le Dev Dashboard
 *   (« Lovelyhop site CPE », droits read_customers et write_customers), installée sur la boutique.
 *   Le jeton est demandé par « client credentials grant » et gardé en mémoire jusqu'à son expiration (24 h).
 * - SHOPIFY_ADMIN_ACCESS_TOKEN : jeton fixe d'une ancienne app personnalisée, si on en a un.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-10";

export const isAdminConfigured = Boolean(domain && (staticToken || (clientId && clientSecret)));

let cached: { token: string; expiresAt: number } | null = null;

/** Jeton d'accès Admin : fixe, ou obtenu par client credentials et renouvelé 10 minutes avant l'expiration. */
async function accessToken(): Promise<string> {
  if (staticToken) return staticToken;
  if (cached && cached.expiresAt > Date.now()) return cached.token;
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId!, client_secret: clientSecret! }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify OAuth ${res.status} : ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in - 600) * 1000 };
  return cached.token;
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!isAdminConfigured) throw new Error("API Admin Shopify non configurée (voir .env.example).");
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await accessToken() },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify Admin ${res.status} : ${await res.text()}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(" · "));
  return json.data as T;
}

/** Étiquette fixe : la condition du workflow Shopify Flow « Client créé ». */
export const QUOTE_TAG = "soumission-cpe";
/** Longueur gardée dans la note du client (les demandes récentes d'abord). */
const NOTE_MAX = 4000;

export type QuoteLead = { email: string; name: string; locale: string; note: string };

type Found = { customers: { nodes: { id: string; note: string | null; tags: string[] }[] } };
type Created = { customerCreate: { customer: { id: string } | null; userErrors: { field: string[] | null; message: string }[] } };
type Updated = { customerUpdate: { customer: { id: string } | null; userErrors: { field: string[] | null; message: string }[] } };

const fail = (errors: { message: string }[]) => new Error(errors.map((e) => e.message).join(" · "));

/**
 * Enregistre une demande de soumission comme client Shopify : créé s'il n'existe pas, sinon la
 * note est complétée. Chaque demande ajoute aussi une étiquette datée (`soumission-AAAAMMJJ-HHMM`)
 * pour qu'un workflow « Étiquettes de client ajoutées » puisse réagir aux demandes répétées.
 */
export async function upsertQuoteLead(lead: QuoteLead): Promise<{ id: string; created: boolean }> {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
  const tags = [QUOTE_TAG, `soumission-${stamp}`];
  const [firstName, ...rest] = lead.name.split(/\s+/);
  const header = `Soumission CPE · ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`;
  const note = `${header}\n${lead.note}`;

  const found = await admin<Found>(
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id note tags } } }`,
    { q: `email:${JSON.stringify(lead.email)}` },
  );
  const existing = found.customers.nodes[0];

  if (!existing) {
    const r = await admin<Created>(
      `mutation($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { field message } } }`,
      { input: { email: lead.email, firstName, lastName: rest.join(" ") || undefined, locale: lead.locale, note, tags } },
    );
    if (r.customerCreate.userErrors.length || !r.customerCreate.customer) throw fail(r.customerCreate.userErrors);
    return { id: r.customerCreate.customer.id, created: true };
  }

  const merged = [...new Set([...existing.tags, ...tags])];
  const combined = existing.note ? `${note}\n\n———\n${existing.note}` : note;
  const r = await admin<Updated>(
    `mutation($input: CustomerInput!) { customerUpdate(input: $input) { customer { id } userErrors { field message } } }`,
    { input: { id: existing.id, note: combined.slice(0, NOTE_MAX), tags: merged } },
  );
  if (r.customerUpdate.userErrors.length || !r.customerUpdate.customer) throw fail(r.customerUpdate.userErrors);
  return { id: r.customerUpdate.customer.id, created: false };
}
