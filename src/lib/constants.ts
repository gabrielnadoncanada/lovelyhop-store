/** Handles des univers (collections Shopify), identiques dans le catalogue de démo. */
export const UNIVERS_HANDLES = {
  creer: { fr: "creer-et-decouvrir", en: "create-and-discover" },
  imaginer: { fr: "imaginer", en: "imagine" },
  ranger: { fr: "ranger-et-lire", en: "organize-and-read" },
  bouger: { fr: "bouger", en: "move" },
  cpe: { fr: "garderies-cpe", en: "daycare-furniture" },
} as const;

export const FEATURED_HANDLE = { fr: "table-sensorielle-evolutive", en: "expandable-sensory-table" } as const;

/** Fiches de l'univers « Créer et découvrir » listées dans le méga menu ; même ordre que `nav.sub.creer` dans les messages. */
export const NAV_PRODUCTS = {
  creer: [
    { fr: "table-sensorielle-evolutive", en: "expandable-sensory-table" },
    { fr: "table-lumineuse-enfant", en: "light-table-for-kids" },
    { fr: "panneau-activites-modulable", en: "modular-activity-board" },
    { fr: "table-art-enfant-rangement", en: "kids-art-table-storage" },
    { fr: "table-activite-transformable", en: "convertible-activity-table" },
  ],
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Courriel public du service à la clientèle (lien « Nous joindre »). */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@lovelyhop.com";
