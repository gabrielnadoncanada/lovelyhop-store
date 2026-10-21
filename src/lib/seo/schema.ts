import type { Collection, Locale, Product } from "@/lib/types";
import { LANG_TAG, SITE } from "./site";

/**
 * Constructeurs JSON-LD (schema.org). Chaque page publie un seul bloc `@graph` dont les nœuds
 * se référencent par `@id` : la marque (#organization) et le site (#website) sont décrits une fois,
 * puis chaque page, produit ou article y renvoie. C'est ce qui permet à Google et aux moteurs IA
 * de relier les pages à une même entité.
 *
 * Règle : on ne publie que des données vraies. Pas de prix → pas d'offre ; pas d'avis → pas de note.
 */
export type Node = Record<string, unknown>;

const base = () => SITE.url.replace(/\/$/, "");
export const ORG_ID = () => `${base()}/#organization`;
export const WEBSITE_ID = () => `${base()}/#website`;
const abs = (u: string) => (u.startsWith("http") ? u : `${base()}${u.startsWith("/") ? "" : "/"}${u}`);

export function graph(...nodes: (Node | null | undefined | false)[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

export function organization(description: string): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID(),
    name: SITE.name,
    url: `${base()}/`,
    logo: { "@type": "ImageObject", url: abs(SITE.logo) },
    description,
    areaServed: { "@type": "Country", name: SITE.areaServed },
    ...(SITE.email ? { email: SITE.email, contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: SITE.email, availableLanguage: ["fr", "en"] } } : {}),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function website(locale: Locale, description: string): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID(),
    url: `${base()}/`,
    name: SITE.name,
    description,
    inLanguage: [LANG_TAG.fr, LANG_TAG.en],
    publisher: { "@id": ORG_ID() },
  };
}

/** La page elle-même. `type` : WebPage, CollectionPage, ItemPage, AboutPage, ContactPage… */
export function webPage(o: { url: string; name: string; description: string; locale: Locale; type?: string; breadcrumb?: boolean; dateModified?: string; primaryImage?: string }): Node {
  return {
    "@type": o.type ?? "WebPage",
    "@id": `${o.url}#webpage`,
    url: o.url,
    name: o.name,
    description: o.description,
    inLanguage: LANG_TAG[o.locale],
    isPartOf: { "@id": WEBSITE_ID() },
    publisher: { "@id": ORG_ID() },
    ...(o.breadcrumb ? { breadcrumb: { "@id": `${o.url}#breadcrumb` } } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.primaryImage ? { primaryImageOfPage: { "@type": "ImageObject", url: abs(o.primaryImage) } } : {}),
  };
}

export type Crumb = { name: string; url?: string };

/** Fil d'Ariane. Le dernier élément est la page courante (son URL est celle de la page). */
export function breadcrumb(pageUrl: string, items: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url || i === items.length - 1 ? { item: c.url ?? pageUrl } : {}),
    })),
  };
}

export function faq(pageUrl: string, items: { q: string; a: string }[]): Node | null {
  if (!items.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}

const AVAIL = { in: "https://schema.org/InStock", out: "https://schema.org/OutOfStock" };

/**
 * Produit. Les ensembles (variantes Shopify) deviennent des offres nommées : ce ne sont pas
 * des tailles ou des couleurs, donc pas de ProductGroup/variesBy qui mentirait sur la nature de la variation.
 * Pas de prix fixé → aucune offre publiée.
 */
export function product(p: Product, url: string, o: { locale: Locale; category?: string | null }): Node {
  const images = p.images.map((i) => i.url);
  const offers = p.variants
    .filter((v) => v.price)
    .map((v) => ({
      "@type": "Offer",
      ...(p.variants.length > 1 ? { name: v.title } : {}),
      sku: v.id.split("/").pop(),
      price: v.price!.amount,
      priceCurrency: v.price!.currencyCode,
      availability: v.availableForSale ? AVAIL.in : AVAIL.out,
      itemCondition: "https://schema.org/NewCondition",
      url,
      seller: { "@id": ORG_ID() },
    }));
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.title,
    description: p.seo.description ?? p.description,
    url,
    inLanguage: LANG_TAG[o.locale],
    brand: { "@type": "Brand", name: SITE.name },
    manufacturer: { "@id": ORG_ID() },
    ...(p.variants[0] ? { productID: p.id.split("/").pop() } : {}),
    ...(images.length ? { image: images } : {}),
    ...(p.material ? { material: p.material } : {}),
    ...(o.category ? { category: o.category } : {}),
    ...(p.age ? { audience: { "@type": "PeopleAudience", audienceType: p.age } } : {}),
    ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {}),
  };
}

/** Liste ordonnée de produits (pages d'univers, index des collections). */
export function itemList(pageUrl: string, name: string, items: { url: string; name: string; image?: string }[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#items`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: it.url, name: it.name, ...(it.image ? { image: it.image } : {}) })),
  };
}

export function collectionItems(c: Collection, productUrl: (p: Product) => string) {
  return c.products.map((p) => ({ url: productUrl(p), name: p.title, image: p.images[0]?.url }));
}

/** Blogue (index des guides). */
export function blog(url: string, o: { name: string; description: string; locale: Locale; posts: { url: string; headline: string; datePublished: string }[] }): Node {
  return {
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: o.name,
    description: o.description,
    inLanguage: LANG_TAG[o.locale],
    publisher: { "@id": ORG_ID() },
    blogPost: o.posts.map((p) => ({ "@type": "BlogPosting", "@id": `${p.url}#article`, url: p.url, headline: p.headline, datePublished: p.datePublished })),
  };
}

export function blogPosting(o: {
  url: string;
  headline: string;
  description: string;
  locale: Locale;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  section?: string;
  keywords?: string[];
  wordCount?: number;
  blogUrl: string;
  about?: { url: string; name: string }[];
}): Node {
  return {
    "@type": "BlogPosting",
    "@id": `${o.url}#article`,
    mainEntityOfPage: { "@id": `${o.url}#webpage` },
    url: o.url,
    headline: o.headline,
    description: o.description,
    inLanguage: LANG_TAG[o.locale],
    datePublished: o.datePublished,
    dateModified: o.dateModified ?? o.datePublished,
    // Signé par l'équipe tant qu'aucun auteur nommé n'a accepté de signer.
    author: o.author === SITE.name ? { "@id": ORG_ID() } : { "@type": "Person", name: o.author, worksFor: { "@id": ORG_ID() } },
    publisher: { "@id": ORG_ID() },
    isPartOf: { "@id": `${o.blogUrl}#blog` },
    ...(o.image ? { image: [abs(o.image)] } : {}),
    ...(o.section ? { articleSection: o.section } : {}),
    ...(o.keywords?.length ? { keywords: o.keywords.join(", ") } : {}),
    ...(o.wordCount ? { wordCount: o.wordCount } : {}),
    ...(o.about?.length ? { mentions: o.about.map((a) => ({ "@type": "Product", "@id": `${a.url}#product`, name: a.name, url: a.url })) } : {}),
  };
}
