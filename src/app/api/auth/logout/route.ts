import { NextResponse, type NextRequest } from "next/server";
import { endSession, safeReturn } from "@/lib/shopify/customer";

export const dynamic = "force-dynamic";

/** Déconnexion : efface la session du site, puis ferme la session Shopify (qui ramène sur /api/auth/logged-out). */
export async function GET(req: NextRequest) {
  const returnTo = safeReturn(req.nextUrl.searchParams.get("return"));
  return NextResponse.redirect(await endSession(returnTo));
}
