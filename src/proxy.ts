import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tout sauf l'API, les fichiers internes de Next, les fichiers statiques (llms.txt, sitemap.xml…)
  // et les images Open Graph, que Next référence par leur chemin interne (/fr/blog/…/opengraph-image).
  matcher: "/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
