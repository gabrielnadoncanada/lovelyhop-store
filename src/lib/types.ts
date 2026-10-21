export type Locale = "fr" | "en";
export type Plateau = "bacs" | "art" | "lumiere";
export type UniversKey = "creer" | "imaginer" | "ranger" | "bouger" | "cpe";

/** Nom du dessin de marque utilisé quand le produit n'a pas encore de photo. */
export type ArtKey =
  | "table-sensorielle" | "table-lumineuse" | "panneau-activites" | "table-art" | "table-activite"
  | "plateau-art" | "plateau-lumineux" | "entonnoirs" | "tamis" | "bacs"
  | "table-garderie" | "casier-garderie" | "range-matelas" | "panneau-mural";

export type Money = { amount: string; currencyCode: string };

export type ShopImage = { url: string; altText: string | null; width: number; height: number };

export type Variant = {
  id: string;
  title: string;
  /** null = prix pas encore fixé (affiché « [prix] ») */
  price: Money | null;
  availableForSale: boolean;
  /** Texte court sous le nom de l'option (ex. « Châssis, 2 bacs et couvercles réversibles ») */
  description?: string;
};

/** Contenu riche de la fiche, stocké dans le métachamp JSON lovelyhop.details (traduisible). */
export type ProductDetails = {
  lead?: string;
  features?: { title: string; text: string }[];
  uses?: { how: string; title: string; text: string }[];
  steps?: { age: string; title: string; text: string; kit: string }[];
  dimensions?: { width: string; height: string; caption: string };
  sections?: { title: string; paragraphs?: string[]; list?: string[]; specs?: { label: string; value: string }[] }[];
  faq?: { q: string; a: string }[];
  /** Handles des accessoires proposés dans le bloc d'achat et dans « Compléter » */
  addons?: string[];
  /** Handles des plateaux et accessoires de la section « Compléter » */
  extras?: string[];
  /** Le produit a une galerie à plateaux (table sensorielle) */
  plateaux?: boolean;
  shipping?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  univers: UniversKey | null;
  age: string;
  material: string;
  badge: "phare" | "nouveau" | "bientot" | null;
  art: ArtKey | null;
  images: ShopImage[];
  minPrice: Money | null;
  variants: Variant[];
  availableForSale: boolean;
  seo: { title: string | null; description: string | null };
  details: ProductDetails | null;
  /** Handle du même produit dans chaque langue (pour le sélecteur de langue et hreflang) */
  handles: Partial<Record<Locale, string>>;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  univers: UniversKey | null;
  products: Product[];
  handles: Partial<Record<Locale, string>>;
};

export type CartLine = {
  id: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  product: { handle: string; title: string; art: ArtKey | null; image: ShopImage | null };
  unitPrice: Money | null;
  total: Money | null;
};

export type Cart = {
  id: string | null;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartLine[];
  subtotal: Money | null;
  demo: boolean;
};
