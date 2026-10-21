import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Les fichiers de /_next/static gardent le même nom d'un build à l'autre et le CDN les cache comme immuables :
  // l'identifiant de déploiement ajoute ?dpl= aux adresses des actifs pour qu'un nouveau build soit vraiment servi.
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// content-collections compile les guides (content/blog) avant Next ; il doit envelopper la config en dernier.
export default withContentCollections(withNextIntl(nextConfig));
