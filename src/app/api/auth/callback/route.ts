import { NextResponse, type NextRequest } from "next/server";
import { completeLogin, isCustomerAccountConfigured } from "@/lib/shopify/customer";

/** Retour de la page de connexion Shopify : échange le code contre les jetons, puis renvoie vers la page demandée. */
export async function GET(req: NextRequest) {
  if (!isCustomerAccountConfigured) return NextResponse.json({ error: "Comptes clients non configurés" }, { status: 503 });
  const p = req.nextUrl.searchParams;
  const code = p.get("code"), state = p.get("state");
  const origin = req.nextUrl.origin;
  if (!code || !state) return NextResponse.redirect(new URL("/compte?auth=error", origin));
  try {
    const { returnTo } = await completeLogin(code, state);
    return NextResponse.redirect(new URL(returnTo, origin));
  } catch (e) {
    console.error("[auth/callback]", e);
    return NextResponse.redirect(new URL("/compte?auth=error", origin));
  }
}
