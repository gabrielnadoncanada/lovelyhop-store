"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArticleCard, type ArticleCardData } from "./ArticleCard";

/**
 * Liste des guides avec filtre par thème. Le filtre est côté client : toutes les cartes sont
 * dans le HTML statique (bon pour l'indexation), et la page reste entièrement en cache.
 */
export function GuideList({ items, themes }: { items: ArticleCardData[]; themes: string[] }) {
  const t = useTranslations("blog");
  const [theme, setTheme] = useState<string | null>(null);
  const shown = theme ? items.filter((a) => a.theme === theme) : items;
  const [first, ...rest] = shown;

  return (
    <>
      {themes.length > 1 && (
        <div className="lh-blog__filters" role="group" aria-label={t("filter")}>
          <button className="lh-chip lh-chip--plain" type="button" aria-pressed={theme === null} onClick={() => setTheme(null)}>{t("all")}</button>
          {themes.map((th) => (
            <button key={th} className="lh-chip lh-chip--plain" type="button" aria-pressed={theme === th} onClick={() => setTheme(th)}>{th}</button>
          ))}
        </div>
      )}
      {!first ? (
        <p className="lh-search__empty">{theme ? t("emptyTheme") : t("empty")}</p>
      ) : (
        <>
          {!theme && <ArticleCard a={first} headingLevel={2} featured />}
          <div className="lh-guides lh-blog__grid">
            {(theme ? shown : rest).map((a) => <ArticleCard key={a.handle} a={a} headingLevel={2} />)}
          </div>
        </>
      )}
    </>
  );
}
