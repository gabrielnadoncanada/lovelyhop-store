import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";

/** Mots du texte, sans le code ni les balises MDX. */
function words(source: string) {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Table des matières : les titres de niveau 2, avec les mêmes ancres que rehype-slug
 * (même algorithme, github-slugger), pour que les liens tombent toujours juste.
 */
function toc(source: string) {
  const slugger = new GithubSlugger();
  return [...source.replace(/```[\s\S]*?```/g, "").matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const title = m[1].replace(/[*_`]/g, "").trim();
    return { title, id: slugger.slug(title) };
  });
}

/**
 * Guides (blogue). Un dossier par langue : `content/blog/<fr|en>/<slug>.mdx`.
 * Le nom du fichier est l'adresse (traduite) ; `translationKey` relie les versions d'un même guide
 * pour hreflang et le sélecteur de langue. `scripts/check-articles.mjs` refuse un guide qui n'existe
 * que dans une langue.
 */
const articles = defineCollection({
  name: "articles",
  directory: "content/blog",
  include: "**/*.mdx",
  schema: z.object({
    content: z.string(),
    translationKey: z.string(),
    title: z.string(),
    /** Chapeau : affiché sous le titre, sur les cartes et dans la meta description par défaut. */
    excerpt: z.string(),
    /** Thème de filtrage, affiché en surtitre (ex. « Guide », « Idées », « Aménagement »). */
    theme: z.string(),
    /** Âge visé, affiché à côté du thème (« 1 à 3 ans »). */
    age: z.string().optional(),
    publishedAt: z.union([z.string(), z.date()]),
    updatedAt: z.union([z.string(), z.date()]).optional(),
    /** « Lovelyhop » = signé par l'équipe. Un auteur nommé seulement avec son accord. */
    author: z.string().default("Lovelyhop"),
    /** Dessin de couverture du design system, tant qu'il n'y a pas de photo. */
    art: z.enum(["bac", "lumiere", "bibliotheque", "bols"]).default("bac"),
    tone: z.enum(["sage", "sand", "blush"]).default("sage"),
    /** Photo de couverture (chemin /public ou URL Shopify). Remplace le dessin. */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Handles des produits mentionnés (dans la langue du guide) : bloc « Le mobilier de ce guide » + JSON-LD. */
    products: z.array(z.string()).default([]),
    /** Questions fréquentes en fin de guide (rendues et publiées en FAQPage). */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    /** Ordre à date égale (1 = en premier) : guide vedette de l'index et ordre sur l'accueil. */
    pin: z.number().optional(),
    draft: z.boolean().default(false),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] });
    const [locale, ...rest] = doc._meta.path.split(/[\\/]/);
    const handle = rest.join("/");
    if (!locale || !handle || !["fr", "en"].includes(locale)) {
      throw new Error(`Le guide « ${doc._meta.filePath} » doit être dans content/blog/<fr|en>/<slug>.mdx`);
    }
    const wordCount = words(doc.content);
    return {
      ...doc,
      mdx,
      locale: locale as "fr" | "en",
      handle,
      // Date seule (AAAA-MM-JJ) : une date de publication n'a pas d'heure, et une heure UTC décalerait le jour au Québec.
      publishedAt: new Date(doc.publishedAt).toISOString().slice(0, 10),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString().slice(0, 10) : undefined,
      wordCount,
      readingMinutes: Math.max(1, Math.round(wordCount / 200)),
      toc: toc(doc.content),
    };
  },
});

export default defineConfig({ content: [articles] });
