import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

/**
 * Compte client sur le site, par la Customer Account API de Shopify (canal Headless, client public + PKCE).
 *
 * Parcours : /api/auth/login → page de connexion Shopify (courriel + code) → /api/auth/callback → cookie de session
 * chiffré (jetons d'accès et de rafraîchissement) → pages /compte rendues ici avec nos gabarits.
 * Les points de terminaison viennent des documents de découverte de la boutique, jamais codés en dur.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_CUSTOMER_CLIENT_ID;
const secret = process.env.AUTH_SECRET;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Faux tant que le canal Headless n'a pas de client Customer Account API configuré. */
export const isCustomerAccountConfigured = Boolean(domain && clientId && secret);

export const SESSION_COOKIE = "lh_session";
const AUTH_COOKIE = "lh_auth";
const SCOPES = "openid email customer-account-api:full";
/** Marge avant l'expiration du jeton d'accès à partir de laquelle on le rafraîchit. */
const REFRESH_MARGIN_S = 90;
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30;

export type Session = { accessToken: string; refreshToken: string; idToken: string; expiresAt: number };
type AuthState = { verifier: string; state: string; nonce: string; returnTo: string; locale: Locale };

export class CustomerAuthError extends Error {
  constructor(message = "Session client invalide ou expirée") { super(message); this.name = "CustomerAuthError"; }
}

/* ---------- Découverte ---------- */

type Discovery = { authorize: string; token: string; logout: string; graphql: string };
let discoveryCache: Promise<Discovery> | null = null;

async function discovery(): Promise<Discovery> {
  if (!discoveryCache) {
    discoveryCache = (async () => {
      const [oidc, api] = await Promise.all([
        fetch(`https://${domain}/.well-known/openid-configuration`, { next: { revalidate: 86400 } }).then((r) => r.json()),
        fetch(`https://${domain}/.well-known/customer-account-api`, { next: { revalidate: 86400 } }).then((r) => r.json()),
      ]);
      return { authorize: oidc.authorization_endpoint, token: oidc.token_endpoint, logout: oidc.end_session_endpoint, graphql: api.graphql_api };
    })().catch((e) => { discoveryCache = null; throw e; });
  }
  return discoveryCache;
}

/* ---------- Chiffrement des cookies (AES-GCM, clé dérivée de AUTH_SECRET) ---------- */

const enc = new TextEncoder();
const dec = new TextDecoder();
let keyCache: Promise<CryptoKey> | null = null;
function key(): Promise<CryptoKey> {
  if (!keyCache) keyCache = crypto.subtle.digest("SHA-256", enc.encode(secret!)).then((d) => crypto.subtle.importKey("raw", d, "AES-GCM", false, ["encrypt", "decrypt"]));
  return keyCache;
}
const b64url = (b: ArrayBuffer | Uint8Array) => Buffer.from(b instanceof Uint8Array ? b : new Uint8Array(b)).toString("base64url");
const fromB64url = (s: string) => new Uint8Array(Buffer.from(s, "base64url"));

async function seal(data: unknown): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(), enc.encode(JSON.stringify(data)));
  return `${b64url(iv)}.${b64url(ct)}`;
}
async function open<T>(value: string | undefined): Promise<T | null> {
  if (!value) return null;
  try {
    const [iv, ct] = value.split(".");
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64url(iv) }, await key(), fromB64url(ct));
    return JSON.parse(dec.decode(pt)) as T;
  } catch {
    return null;
  }
}

const cookieBase = { httpOnly: true, sameSite: "lax" as const, secure: siteUrl.startsWith("https"), path: "/" };

/* ---------- Connexion (PKCE) ---------- */

const random = (bytes = 32) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));

/** Un chemin relatif du site seulement : jamais une adresse externe (redirection ouverte). */
export function safeReturn(path: string | null | undefined, fallback = "/"): string {
  return path && /^\/(?!\/)/.test(path) ? path : fallback;
}

/** Prépare la redirection vers la page de connexion Shopify et pose le cookie éphémère (vérificateur PKCE, état, nonce). */
export async function beginLogin(opts: { returnTo: string; locale: Locale }): Promise<string> {
  const d = await discovery();
  const verifier = random(48);
  const challenge = b64url(await crypto.subtle.digest("SHA-256", enc.encode(verifier)));
  const auth: AuthState = { verifier, state: random(16), nonce: random(16), returnTo: safeReturn(opts.returnTo), locale: opts.locale };
  (await cookies()).set(AUTH_COOKIE, await seal(auth), { ...cookieBase, maxAge: 600 });
  const url = new URL(d.authorize);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("client_id", clientId!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", `${siteUrl}/api/auth/callback`);
  url.searchParams.set("state", auth.state);
  url.searchParams.set("nonce", auth.nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("locale", opts.locale);
  return url.toString();
}

type TokenResponse = { access_token: string; refresh_token?: string; id_token?: string; expires_in: number };

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const d = await discovery();
  const res = await fetch(d.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId!, ...body }),
    cache: "no-store",
  });
  if (!res.ok) throw new CustomerAuthError(`Jeton refusé (${res.status}) : ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as TokenResponse;
}

/** Retour de Shopify : vérifie l'état, échange le code, pose la session. Renvoie le chemin où renvoyer l'utilisateur. */
export async function completeLogin(code: string, state: string): Promise<{ returnTo: string; locale: Locale }> {
  const jar = await cookies();
  const auth = await open<AuthState>(jar.get(AUTH_COOKIE)?.value);
  jar.delete(AUTH_COOKIE);
  if (!auth || auth.state !== state) throw new CustomerAuthError("État de connexion invalide");
  const t = await tokenRequest({ grant_type: "authorization_code", code, redirect_uri: `${siteUrl}/api/auth/callback`, code_verifier: auth.verifier });
  await saveSession(t, "");
  return { returnTo: auth.returnTo, locale: auth.locale };
}

async function saveSession(t: TokenResponse, previousRefresh: string, previousId = ""): Promise<Session> {
  const s: Session = {
    accessToken: t.access_token,
    refreshToken: t.refresh_token ?? previousRefresh,
    idToken: t.id_token ?? previousId,
    expiresAt: Date.now() + t.expires_in * 1000,
  };
  (await cookies()).set(SESSION_COOKIE, await seal(s), { ...cookieBase, maxAge: SESSION_MAX_AGE_S });
  return s;
}

/** Session telle qu'elle est dans le cookie (sans rafraîchir : un composant serveur ne peut pas réécrire un cookie). */
export async function readSession(): Promise<Session | null> {
  if (!isCustomerAccountConfigured) return null;
  return open<Session>((await cookies()).get(SESSION_COOKIE)?.value);
}

export const sessionNeedsRefresh = (s: Session) => s.expiresAt - Date.now() < REFRESH_MARGIN_S * 1000;

/** Rafraîchit le jeton d'accès et réécrit le cookie (à appeler depuis une route ou une action serveur). */
export async function refreshSession(): Promise<Session | null> {
  const s = await readSession();
  if (!s?.refreshToken) return null;
  try {
    const t = await tokenRequest({ grant_type: "refresh_token", refresh_token: s.refreshToken });
    return await saveSession(t, s.refreshToken, s.idToken);
  } catch {
    (await cookies()).delete(SESSION_COOKIE);
    return null;
  }
}

/** Efface la session locale et renvoie l'adresse de déconnexion Shopify (qui ramène ensuite sur le site). */
export async function endSession(returnTo = "/"): Promise<string> {
  const s = await readSession();
  (await cookies()).delete(SESSION_COOKIE);
  if (!s?.idToken) return `${siteUrl}${safeReturn(returnTo)}`;
  const d = await discovery();
  const url = new URL(d.logout);
  url.searchParams.set("id_token_hint", s.idToken);
  url.searchParams.set("post_logout_redirect_uri", `${siteUrl}/api/auth/logged-out`);
  return url.toString();
}

/* ---------- Appels GraphQL ---------- */

type GraphQLResponse<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

/** Requête à la Customer Account API avec le jeton de la session. Lève CustomerAuthError si Shopify refuse le jeton. */
export async function customerQuery<T>(query: string, variables: Record<string, unknown> = {}, session?: Session | null): Promise<T> {
  const s = session ?? (await readSession());
  if (!s) throw new CustomerAuthError();
  const d = await discovery();
  const res = await fetch(d.graphql, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: s.accessToken },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new CustomerAuthError();
  if (!res.ok) throw new Error(`Customer Account API ${res.status} : ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    if (json.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED")) throw new CustomerAuthError();
    throw new Error(json.errors.map((e) => e.message).join(" · "));
  }
  return json.data as T;
}
