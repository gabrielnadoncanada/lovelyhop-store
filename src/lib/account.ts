import "server-only";
import { redirect } from "next/navigation";
import { getPathname } from "@/i18n/navigation";
import { CustomerAuthError, readSession, sessionNeedsRefresh, type Session } from "@/lib/shopify/customer";
import type { Locale } from "@/lib/types";

/** Pages du compte : chemins localisés et garde de session. */

export type AccountPath = "/account" | "/account/orders" | "/account/addresses" | "/account/profile";

export const accountPath = (pathname: AccountPath, locale: Locale) => getPathname({ href: { pathname }, locale });
export const loginUrl = (locale: Locale, returnTo: string) => `/api/auth/login?locale=${locale}&return=${encodeURIComponent(returnTo)}`;
const refreshUrl = (locale: Locale, returnTo: string) => `/api/auth/refresh?locale=${locale}&return=${encodeURIComponent(returnTo)}`;

/** Session valide ou redirection : vers la connexion s'il n'y en a pas, vers le rafraîchissement si le jeton expire. */
export async function requireSession(locale: Locale, returnTo: string): Promise<Session> {
  const s = await readSession();
  if (!s) redirect(loginUrl(locale, returnTo));
  if (sessionNeedsRefresh(s)) redirect(refreshUrl(locale, returnTo));
  return s;
}

/** Exécute une lecture du compte ; si Shopify refuse le jeton, on passe par le rafraîchissement puis on revient. */
export async function withSession<T>(locale: Locale, returnTo: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof CustomerAuthError) redirect(refreshUrl(locale, returnTo));
    throw e;
  }
}

export const orderNumber = (gid: string) => gid.split("/").pop() ?? gid;
export const orderGid = (id: string) => `gid://shopify/Order/${id.replace(/\D/g, "")}`;
