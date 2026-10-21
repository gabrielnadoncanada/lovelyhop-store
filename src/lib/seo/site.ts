import { SITE_URL } from "@/lib/constants";

/**
 * Identité de la marque pour les métadonnées, le JSON-LD et llms.txt.
 * Une seule source : rien ici n'est traduit (un nom ou une adresse est une donnée, pas du texte).
 *
 * Ne rien inventer. Un champ vide n'est simplement pas publié.
 */
export const SITE = {
  name: "Lovelyhop",
  url: SITE_URL,
  /** Logo carré ou horizontal servi depuis /public (Google accepte le SVG). */
  logo: "/brand/lovelyhop-logo.svg",
  /** Courriel public du service à la clientèle. À fournir dans .env (NEXT_PUBLIC_CONTACT_EMAIL). */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
  /** Profils officiels (Instagram, Facebook, Pinterest…). À compléter quand ils existent. */
  sameAs: [] as string[],
  /** « Livraison partout au Canada » : pays desservi. */
  areaServed: "CA",
  /** Le texte du site dit « Conçus au Québec ». */
  designedIn: { fr: "Québec, Canada", en: "Quebec, Canada" },
  currency: "CAD",
} as const;

/** Étiquettes BCP 47 : une seule variante par langue, pour le Canada. */
export const LANG_TAG = { fr: "fr-CA", en: "en-CA" } as const;
export const OG_LOCALE = { fr: "fr_CA", en: "en_CA" } as const;
