"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { quickSearch, type QuickResult } from "@/app/actions";
import { ProductArt } from "@/components/art/byKey";
import { Icon, type IconName } from "@/components/ui/icons";

type Item = { key: string; href: Parameters<ReturnType<typeof useRouter>["push"]>[0]; title: string; meta?: string; price?: string; art?: QuickResult["art"]; icon?: IconName };

/**
 * Recherche en palette de commandes : fenêtre centrée, résultats instantanés, navigation au clavier
 * (flèches, Entrée, Échap). Ouverte depuis la loupe de l'en-tête ou avec Ctrl/⌘ + K.
 */
export function SearchPalette({ onClose }: { onClose: () => void }) {
  const t = useTranslations("search");
  const tn = useTranslations("nav");
  const tf = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<QuickResult[] | null>(null);
  const [active, setActive] = useState(0);
  const [, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const query = q.trim();
  const onChange = (v: string) => { setQ(v); setActive(0); if (v.trim().length < 2) setResults(null); };
  useEffect(() => {
    if (query.length < 2) return;
    const id = setTimeout(() => start(async () => { const r = await quickSearch(query, locale); setResults(r); setActive(0); }), 180);
    return () => clearTimeout(id);
  }, [query, locale]);

  const suggestions = useMemo<Item[]>(() => [
    { key: "univers", href: "/collections", title: tn("universIndex"), icon: "layers" },
    { key: "cpe", href: "/daycares", title: tn("univers.cpe"), icon: "home" },
    { key: "guides", href: "/blog", title: tn("guides"), icon: "heart" },
    { key: "shipping", href: "/shipping", title: tf("shipping"), icon: "truck" },
    { key: "contact", href: "/contact", title: tf("contact"), icon: "mail" },
  ], [tn, tf]);

  const items: Item[] = query.length >= 2
    ? (results ?? []).map((r) => ({ key: r.handle, href: { pathname: "/[handle]", params: { handle: r.handle } }, title: r.title, meta: r.meta, price: r.price, art: r.art }))
    : suggestions;
  const showAll = query.length >= 2 && (results?.length ?? 0) > 0;
  const total = items.length + (showAll ? 1 : 0);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (i: number) => {
    const it = items[i];
    if (it) { router.push(it.href); onClose(); return; }
    if (showAll && i === items.length) { router.push({ pathname: "/search", query: { q: query } }); onClose(); }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (total ? (a + 1) % total : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (total ? (a - 1 + total) % total : 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (total) go(active); else if (query) { router.push({ pathname: "/search", query: { q: query } }); onClose(); } }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };
  const highlight = (text: string) => {
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0 || query.length < 2) return text;
    return <>{text.slice(0, i)}<mark>{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
  };

  return (
    <div className="lh-palette-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lh-palette" role="dialog" aria-modal="true" aria-label={t("label")} onKeyDown={onKey}>
        <div className="lh-palette__bar">
          <Icon name="search" />
          <input ref={input} className="lh-palette__input" type="search" value={q} onChange={(e) => onChange(e.target.value)} aria-label={t("input")} placeholder={t("placeholder")} autoComplete="off" spellCheck={false} role="combobox" aria-expanded aria-controls="lh-palette-list" aria-activedescendant={total ? `lh-palette-${active}` : undefined} />
          <button className="lh-palette__close" type="button" onClick={onClose} aria-label={t("close")}><kbd>esc</kbd></button>
        </div>
        <div className="lh-palette__body" ref={list} id="lh-palette-list" role="listbox">
          {query.length < 2 && (
            <>
              <div className="lh-palette__group">
                <h3>{t("popular")}</h3>
                <div className="lh-palette__chips">
                  {(t.raw("popularTerms") as string[]).map((term) => <button key={term} type="button" className="lh-chip lh-chip--plain" onClick={() => onChange(term)}>{term}</button>)}
                </div>
              </div>
              <div className="lh-palette__group"><h3>{t("quickLinks")}</h3></div>
            </>
          )}
          {query.length >= 2 && <div className="lh-palette__group"><h3>{t("products")}</h3></div>}
          {query.length >= 2 && results && results.length === 0 && <p className="lh-palette__empty">{t("empty", { q: query })}</p>}
          {query.length >= 2 && !results && <p className="lh-palette__empty">{t("searching")}</p>}
          {items.map((it, i) => (
            <Link
              key={it.key} id={`lh-palette-${i}`} data-index={i} role="option" aria-selected={i === active}
              className={`lh-palette__item${it.icon ? " lh-palette__item--link" : ""}${i === active ? " is-active" : ""}`} href={it.href}
              onClick={onClose} onMouseMove={() => setActive(i)}
            >
              <span className="lh-palette__thumb">{it.icon ? <Icon name={it.icon} /> : <ProductArt art={it.art ?? null} />}</span>
              <span><span className="lh-palette__name">{highlight(it.title)}</span>{it.meta && <span className="lh-palette__meta">{it.meta}</span>}</span>
              {it.price && <span className="lh-palette__price">{it.price}</span>}
              <span className="lh-palette__go" aria-hidden="true"><Icon name="arrow" /></span>
            </Link>
          ))}
          {showAll && (
            <Link id={`lh-palette-${items.length}`} data-index={items.length} role="option" aria-selected={active === items.length} className={active === items.length ? "lh-palette__item lh-palette__item--more is-active" : "lh-palette__item lh-palette__item--more"} href={{ pathname: "/search", query: { q: query } }} onClick={onClose} onMouseMove={() => setActive(items.length)}>
              <span className="lh-palette__thumb"><Icon name="arrow" /></span>
              <span className="lh-palette__name">{t("seeAll")}</span>
              <span className="lh-palette__go" aria-hidden="true"><Icon name="arrow" /></span>
            </Link>
          )}
        </div>
        <div className="lh-palette__foot"><span><kbd>↑</kbd><kbd>↓</kbd> {t("hintNav")}</span><span><kbd>↵</kbd> {t("hintOpen")}</span><span><kbd>esc</kbd> {t("hintClose")}</span></div>
      </div>
    </div>
  );
}
