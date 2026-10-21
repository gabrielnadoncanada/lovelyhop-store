import { cacheLife, cacheTag } from "next/cache";
import { getCatalogIndex, getProduct } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import { articleHref, articles } from "@/lib/blog";
import type { Locale, UniversKey } from "@/lib/types";
import fr from "@/messages/fr.json";
import en from "@/messages/en.json";
import { getPage, INFO_PAGES, type InfoKey } from "@/lib/pages";
import { SITE } from "./site";
import { absoluteUrl } from "./urls";

/**
 * llms.txt (https://llmstxt.org) : un résumé Markdown du site pour les moteurs de réponse IA.
 * Généré depuis les mêmes sources que les pages (catalogue Shopify, guides, textes traduits),
 * donc toujours à jour. N'y figure que ce que le site dit déjà publiquement.
 */
const M = { fr, en } as const;
const UNIVERS: UniversKey[] = ["creer", "imaginer", "ranger", "bouger", "cpe"];
const clean = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const firstSentence = (s: string) => clean(s).split(/(?<=[.!?])\s/)[0] ?? "";

async function section(locale: Locale, full: boolean) {
  const m = M[locale];
  const { products } = await getCatalogIndex();
  const lines: string[] = [];
  const isFr = locale === "fr";

  lines.push(`## ${isFr ? "Univers" : "Worlds"}`, "");
  lines.push(`- [${m.nav.universIndex}](${absoluteUrl("/collections", locale)}): ${clean(m.collections.metaDescription)}`);
  for (const u of UNIVERS) {
    lines.push(`- [${m.nav.univers[u]}](${absoluteUrl({ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }, locale)})`);
  }

  lines.push("", `## ${isFr ? "Produits" : "Products"}`, "");
  for (const p of products) {
    const h = p.handles[locale];
    if (!h) continue;
    lines.push(`- [${p.titles[locale]}](${absoluteUrl({ pathname: "/[handle]", params: { handle: h } }, locale)}): ${firstSentence(p.descriptions[locale] ?? "")}`);
    if (full) {
      const prod = await getProduct(h, locale);
      const d = prod?.details;
      if (d?.lead) lines.push(`  ${clean(d.lead)}`);
      for (const f of d?.features ?? []) lines.push(`  - ${f.title} : ${clean(f.text)}`);
      for (const q of d?.faq ?? []) lines.push(`  - Q : ${clean(q.q)} R : ${clean(q.a)}`);
    }
  }

  lines.push("", `## ${m.daycares.eyebrow}`, "");
  lines.push(`- [${clean(m.daycares.metaTitle).replace(/\s*\|\s*Lovelyhop$/, "")}](${absoluteUrl("/daycares", locale)}): ${clean(m.daycares.metaDescription)}`);

  lines.push("", `## ${m.blog.eyebrow}`, "");
  lines.push(`- [${m.blog.all}](${absoluteUrl("/blog", locale)}): ${clean(m.blog.metaDescription)}`);
  for (const a of articles(locale)) {
    lines.push(`- [${a.title}](${absoluteUrl(articleHref(a.handle), locale)}): ${clean(a.excerpt)}`);
  }
  const info = (Object.keys(INFO_PAGES) as InfoKey[]).map((k) => [k, getPage(k, locale)] as const).filter(([, p]) => p && !p.review);
  if (info.length) {
    lines.push("", `## ${isFr ? "Aide" : "Help"}`, "");
    for (const [k, p] of info) lines.push(`- [${p!.title}](${absoluteUrl(INFO_PAGES[k], locale)}): ${clean(p!.description)}`);
  }
  if (full) {
    for (const a of articles(locale)) {
      lines.push("", `### ${a.title}`, "", `${absoluteUrl(articleHref(a.handle), locale)}`, "", a.content.replace(/<Callout title="([^"]+)">\s*/g, "**$1.** ").replace(/\s*<\/Callout>/g, "").trim());
      for (const q of a.faq) lines.push("", `**${q.q}** ${q.a}`);
    }
  }
  return lines.join("\n");
}

export async function buildLlmsTxt(full: boolean): Promise<string> {
  "use cache";
  cacheTag("catalog");
  cacheLife("hours");
  const base = SITE.url.replace(/\/$/, "");
  const out = [
    `# ${SITE.name}`,
    "",
    `> ${clean(fr.footer.brand)}`,
    "",
    clean(fr.hero.lead),
    "",
    `- ${fr.hero.strip.join(" · ")}`,
    `- Site en français (${base}/) et en anglais (${base}/en). English summary below.`,
    `- Paiement : passerelle sécurisée Shopify. Prix en dollars canadiens.`,
    "",
    await section("fr", full),
    "",
    "## English",
    "",
    `> ${clean(en.footer.brand)}`,
    "",
    (await section("en", full)).replace(/^## /gm, "### "),
    "",
    "## Optional",
    "",
    `- [Sitemap](${base}/sitemap.xml)`,
    full ? "" : `- [Version complète / Full version](${base}/llms-full.txt): fiches et guides en entier / full product details and guides`,
  ];
  return out.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n").trim() + "\n";
}
