/**
 * Vérifie les guides avant le build :
 *  - chaque guide existe dans toutes les langues, ou dans aucune (relié par `translationKey`) ;
 *  - aucun `translationKey` en double dans une même langue ;
 *  - les liens internes `/guides/...` et `/en/guides/...` pointent vers un guide qui existe.
 * Un blogue à moitié traduit est pire qu'un blogue vide.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join("content", "blog");
const LOCALES = ["fr", "en"];
const problems = [];
const byKey = new Map();
const handles = { fr: new Set(), en: new Set() };
const bodies = [];

for (const locale of LOCALES) {
  const dir = join(DIR, locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const src = readFileSync(join(dir, file), "utf8");
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const key = fm.match(/^translationKey:\s*(.+)$/m)?.[1]?.trim();
    const draft = /^draft:\s*true\s*$/m.test(fm);
    const handle = file.replace(/\.mdx$/, "");
    if (!key) { problems.push(`${locale}/${file} : translationKey manquant`); continue; }
    if (draft) continue;
    handles[locale].add(handle);
    bodies.push({ locale, file, src });
    if (!byKey.has(key)) byKey.set(key, new Map());
    const m = byKey.get(key);
    if (m.has(locale)) problems.push(`${locale} : translationKey « ${key} » utilisé par ${m.get(locale)} et ${file}`);
    m.set(locale, file);
  }
}

for (const [key, found] of byKey) {
  const missing = LOCALES.filter((l) => !found.has(l));
  if (missing.length) problems.push(`« ${key} » n'existe pas en : ${missing.join(", ")} (présent : ${[...found.values()].join(", ")})`);
}

for (const { locale, file, src } of bodies) {
  for (const m of src.matchAll(/\]\((\/(?:en\/)?guides\/([^)#?\s]+))/g)) {
    const target = m[1].startsWith("/en/") ? "en" : "fr";
    if (!handles[target].has(m[2])) problems.push(`${locale}/${file} : lien vers un guide inexistant ${m[1]}`);
  }
}

if (problems.length) {
  console.error("Guides à corriger :\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log(`Guides OK : ${byKey.size} guides × ${LOCALES.length} langues.`);
