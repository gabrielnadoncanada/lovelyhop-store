import { NextResponse, type NextRequest } from "next/server";
import { refreshSession, safeReturn } from "@/lib/shopify/customer";

/**
 * Rafraîchit le jeton d'accès puis revient sur la page demandée. Les pages du compte y renvoient quand le jeton
 * arrive à échéance : un composant serveur ne peut pas réécrire le cookie lui-même.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const returnTo = safeReturn(p.get("return"));
  const locale = p.get("locale") === "en" ? "en" : "fr";
  const s = await refreshSession();
  if (s) return NextResponse.redirect(new URL(returnTo, req.nextUrl.origin));
  return NextResponse.redirect(new URL(`/api/auth/login?locale=${locale}&return=${encodeURIComponent(returnTo)}`, req.nextUrl.origin));
}
