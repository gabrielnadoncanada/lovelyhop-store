import { NextResponse, type NextRequest } from "next/server";
import { beginLogin, isCustomerAccountConfigured, safeReturn } from "@/lib/shopify/customer";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Départ de la connexion : pose le cookie PKCE et envoie vers la page de connexion Shopify. ?return= chemin de retour. */
export async function GET(req: NextRequest) {
  if (!isCustomerAccountConfigured) return NextResponse.json({ error: "Comptes clients non configurés" }, { status: 503 });
  const p = req.nextUrl.searchParams;
  const locale = ((routing.locales as readonly string[]).includes(p.get("locale") ?? "") ? p.get("locale") : "fr") as Locale;
  const returnTo = safeReturn(p.get("return"), locale === "fr" ? "/compte" : "/en/account");
  try {
    return NextResponse.redirect(await beginLogin({ returnTo, locale }));
  } catch (e) {
    console.error("[auth/login]", e);
    return NextResponse.redirect(new URL(`${returnTo}${returnTo.includes("?") ? "&" : "?"}auth=error`, req.nextUrl.origin));
  }
}
