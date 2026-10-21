import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/shopify/customer";

/** Adresse de retour déclarée dans Shopify après la déconnexion : on s'assure que la session locale est vide. */
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.nextUrl.origin));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
