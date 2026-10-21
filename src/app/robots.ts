import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Tout est ouvert, y compris aux moteurs de réponse IA (ChatGPT, Claude, Perplexity, Google) :
 * pour une petite marque, être cité est un canal d'acquisition. Seule l'API est exclue ; la recherche
 * interne reste explorable pour que Google y lise son noindex.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
