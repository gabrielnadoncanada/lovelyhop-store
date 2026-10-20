/** Handles des univers (collections Shopify), identiques dans le catalogue de démo. */
export const UNIVERS_HANDLES = {
  creer: { fr: "creer-et-decouvrir", en: "create-and-discover" },
  imaginer: { fr: "imaginer", en: "imagine" },
  ranger: { fr: "ranger-et-lire", en: "organize-and-read" },
  bouger: { fr: "bouger", en: "move" },
  cpe: { fr: "garderies-cpe", en: "daycare-furniture" },
} as const;

export const FEATURED_HANDLE = { fr: "table-sensorielle-evolutive", en: "expandable-sensory-table" } as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
