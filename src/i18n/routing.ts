import { defineRouting } from "next-intl/routing";

/**
 * Français par défaut, sans préfixe (/table-sensorielle-evolutive) ; anglais sous /en.
 * Les adresses suivent l'arborescence SEO : les fiches produits sont à la racine,
 * avec le handle traduit dans Shopify (Translate & Adapt).
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: false,
  // hreflang : déclarés page par page (les handles produits sont traduits), et pas de cookie de langue (pages en cache)
  alternateLinks: false,
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/[handle]": "/[handle]",
    "/collections": { fr: "/univers", en: "/collections" },
    "/collections/[handle]": { fr: "/univers/[handle]", en: "/collections/[handle]" },
    "/blog": "/guides",
    "/blog/[handle]": "/guides/[handle]",
    "/daycares": { fr: "/garderies-cpe", en: "/daycares" },
    "/search": { fr: "/recherche", en: "/search" },
    "/privacy": { fr: "/confidentialite", en: "/privacy" },
    "/terms": { fr: "/conditions", en: "/terms" },
    "/shipping": { fr: "/livraison-retours", en: "/shipping-returns" },
    "/faq": "/faq",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
