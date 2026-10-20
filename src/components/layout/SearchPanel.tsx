"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { quickSearch, type QuickResult } from "@/app/actions";
import { ProductArt } from "@/components/art/byKey";
import { Icon } from "@/components/ui/icons";

/** Recherche instantanée (composant SearchOverlay du design system). */
export function SearchPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("search");
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<QuickResult[] | null>(null);
  const [, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => {
    if (q.trim().length < 2) return;
    const id = setTimeout(() => start(async () => setResults(await quickSearch(q, locale))), 200);
    return () => clearTimeout(id);
  }, [q, locale]);

  const shown = q.trim().length >= 2 ? results : null;
  const highlight = (text: string) => {
    const i = text.toLowerCase().indexOf(q.trim().toLowerCase());
    if (i < 0 || q.trim().length < 2) return text;
    const n = q.trim().length;
    return <>{text.slice(0, i)}<mark>{text.slice(i, i + n)}</mark>{text.slice(i + n)}</>;
  };

  return (
    <div className="lh-search" role="dialog" aria-label={t("label")}>
      <form className="lh-search__bar" action={locale === "fr" ? "/recherche" : "/en/search"} onSubmit={() => onClose()}>
        <Icon name="search" />
        <input ref={input} className="lh-search__input" name="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("input")} placeholder={t("placeholder")} autoComplete="off" />
        <button className="lh-icon-btn lh-icon-btn--outline" type="button" aria-label={t("close")} onClick={onClose}><Icon name="close" /></button>
      </form>
      <div className="lh-search__body">
        <div>
          <h3>{t("popular")}</h3>
          <div className="lh-search__chips">
            {(t.raw("popularTerms") as string[]).map((term) => (
              <button key={term} type="button" className="lh-chip lh-chip--plain" onClick={() => setQ(term)}>{term}</button>
            ))}
          </div>
          <h3>{t("guides")}</h3>
          <span className="lh-search__empty">{t("guide")}</span>
        </div>
        <div aria-live="polite">
          <h3>{t("products")}</h3>
          {shown && shown.length === 0 && <p className="lh-search__empty">{t("empty", { q })}</p>}
          {shown && shown.length > 0 && (
            <>
              <ul className="lh-search__results">
                {shown.map((r) => (
                  <li key={r.handle}>
                    <Link href={{ pathname: "/[handle]", params: { handle: r.handle } }} onClick={onClose}>
                      <span className="lh-search__thumb"><ProductArt art={r.art} /></span>
                      <span><span className="lh-search__name">{highlight(r.title)}</span><span className="lh-search__meta">{r.meta}</span></span>
                      <span className="lh-search__price">{r.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="lh-link" href={{ pathname: "/search", query: { q } }} onClick={onClose}>{t("seeAll")}</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
