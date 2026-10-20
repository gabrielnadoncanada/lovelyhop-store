"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useAlternates } from "@/components/layout/Alternates";
import { ArtTableSensorielle } from "@/components/art";
import { Icon, UniversIcon } from "@/components/ui/icons";
import { SearchPanel } from "@/components/layout/SearchPanel";
import { FEATURED_HANDLE, UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";

type U = "creer" | "imaginer" | "ranger";
const MEGA: U[] = ["creer", "imaginer", "ranger"];

/** En-tête du site (composant lh-nav du design system) avec méga menu, recherche et menu mobile. */
export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const other: Locale = locale === "fr" ? "en" : "fr";
  const alt = useAlternates();
  const { cart, setOpen, bump } = useCart();
  const [mega, setMega] = useState<U | null>(null);
  const [search, setSearch] = useState(false);
  const [mnav, setMnav] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(null); setSearch(false); setMnav(false); } };
    const onClick = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setMega(null); setSearch(false); } };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  const hover = (u: U | null) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMega(u), u ? 150 : 250);
  };
  const close = () => { setMega(null); setSearch(false); setMnav(false); };
  const altHref = alt[other] ?? (other === "en" ? "/en" : "/");

  return (
    <div className="lh-site-header" ref={root} onMouseLeave={() => mega && hover(null)}>
      <header className="lh-nav">
        <Link className="lh-nav__logo" href="/" aria-label={t("home")} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lh-day" src="/brand/lovelyhop-logo.svg" alt="Lovelyhop" width={220} height={58} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lh-night" src="/brand/lovelyhop-logo-soir.svg" alt="" aria-hidden="true" width={220} height={58} />
        </Link>
        <nav className="lh-nav__links" aria-label={t("label")}>
          {MEGA.map((u) => (
            <Link
              key={u}
              href={{ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }}
              aria-expanded={mega === u}
              aria-controls={`mega-${u}`}
              onMouseEnter={() => hover(u)}
              onClick={(e) => { e.preventDefault(); setSearch(false); setMega((m) => (m === u ? null : u)); }}
            >
              {t(`univers.${u}`)}<Icon name="chev" />
            </Link>
          ))}
          <Link href="/daycares" onMouseEnter={() => hover(null)} onClick={close}>{t("univers.cpe")}</Link>
        </nav>
        <div className="lh-nav__tools">
          <a className="lh-nav__lang" href={altHref} lang={other} hrefLang={other} aria-label={t("langSwitch")}>{t("langShort")}</a>
          <button className="lh-nav__icon" type="button" aria-label={t("search")} aria-expanded={search} onClick={() => { setMega(null); setSearch((s) => !s); }}>
            <Icon name="search" className="" />
          </button>
          <button className="lh-nav__cart" type="button" aria-label={t("cartLabel", { count })} onClick={() => setOpen(true)}>
            <svg className="lh-nav__cart-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
            <span className="lh-nav__cart-label">{t("cart")}</span>
            <span className={bump ? "lh-nav__count is-bump" : "lh-nav__count"} key={bump}>{count}</span>
          </button>
          <button className="lh-nav__icon lh-nav__menu" type="button" aria-label={t("menu")} aria-expanded={mnav} aria-controls="menu-mobile" onClick={() => setMnav(true)}>
            <Icon name="menu" className="" />
          </button>
        </div>
      </header>

      {mega && (
        <div className="lh-mega-wrap" onMouseEnter={() => hover(mega)}>
          <MegaMenu active={mega} locale={locale} onNavigate={close} />
        </div>
      )}
      {search && (
        <div className="lh-search-wrap">
          <SearchPanel onClose={() => setSearch(false)} />
        </div>
      )}
      {mnav && <MobileNav locale={locale} altHref={altHref} other={other} onClose={() => setMnav(false)} />}
    </div>
  );
}

function MegaMenu({ active, locale, onNavigate }: { active: U; locale: Locale; onNavigate: () => void }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  return (
    <div className="lh-mega" id={`mega-${active}`}>
      {MEGA.map((u) => (
        <div className="lh-mega__col" key={u}>
          <h3><span className="lh-mega__ico"><UniversIcon univers={u} /></span>{t(`univers.${u}`)}</h3>
          <ul>
            {(t.raw(`sub.${u}`) as string[]).map((s) => (
              <li key={s}><Link href={{ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }} onClick={onNavigate}>{s}</Link></li>
            ))}
          </ul>
          <Link className="lh-link" href={{ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }} onClick={onNavigate}>{tc("seeAll")}</Link>
        </div>
      ))}
      <div className="lh-mega__feature">
        <div className="lh-mega__feature-art"><ArtTableSensorielle /></div>
        <div className="lh-mega__feature-body">
          <span className="lh-eyebrow">{t("featured")}</span>
          <strong>{t("featuredName")}</strong>
          <Link className="lh-link" href={{ pathname: "/[handle]", params: { handle: FEATURED_HANDLE[locale] } }} onClick={onNavigate}>{t("featuredLink")}</Link>
        </div>
      </div>
      <div className="lh-mega__foot">
        <p><strong>{t("megaFootTitle")}</strong>{t("megaFootText")}</p>
        <Link className="lh-link" href="/daycares" onClick={onNavigate}>{t("megaFootLink")}</Link>
      </div>
    </div>
  );
}

function MobileNav({ locale, altHref, other, onClose }: { locale: Locale; altHref: string; other: Locale; onClose: () => void }) {
  const t = useTranslations("nav");
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);
  return createPortal(
    <div className="lh lh-overlay lh-overlay--right">
      <div className="lh-scrim" onClick={onClose} />
      <div className="lh-mnav" id="menu-mobile" role="dialog" aria-modal="true" aria-label={t("menu")} ref={panel}>
        <div className="lh-mnav__head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lovelyhop-logo.svg" alt="Lovelyhop" width={150} height={38} />
          <button className="lh-icon-btn lh-icon-btn--outline" type="button" aria-label={t("closeMenu")} onClick={onClose}><Icon name="close" /></button>
        </div>
        <div className="lh-mnav__body">
          <form className="lh-input-wrap" action={locale === "fr" ? "/recherche" : "/en/search"}>
            <Icon name="search" />
            <input className="lh-input" name="q" type="search" aria-label={t("search")} placeholder={locale === "fr" ? "Table sensorielle, bibliothèque…" : "Sensory table, bookshelf…"} />
          </form>
          <div>
            {MEGA.map((u, i) => (
              <details className="lh-mnav__group" key={u} open={i === 0}>
                <summary><span className="lh-mega__ico"><UniversIcon univers={u} /></span>{t(`univers.${u}`)}<Icon name="chev" /></summary>
                <ul>
                  {(t.raw(`sub.${u}`) as string[]).map((s) => (
                    <li key={s}><Link href={{ pathname: "/collections/[handle]", params: { handle: UNIVERS_HANDLES[u][locale] } }} onClick={onClose}>{s}</Link></li>
                  ))}
                </ul>
              </details>
            ))}
            <div className="lh-mnav__group">
              <span style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, font: "450 20px/1.2 var(--font-display)", fontVariationSettings: "'SOFT' 100" }}>
                <span className="lh-mega__ico"><UniversIcon univers="bouger" /></span>{t("univers.bouger")} <span className="lh-mega__soon">{locale === "fr" ? "Bientôt" : "Soon"}</span>
              </span>
            </div>
          </div>
          <Link className="lh-mnav__pro" href="/daycares" onClick={onClose}>
            <span><strong>{t("proTitle")}</strong><span>{t("proText")}</span></span>
            <span className="lh-icon-btn"><Icon name="arrow" /></span>
          </Link>
        </div>
        <div className="lh-mnav__foot">
          <a href={altHref} lang={other} hrefLang={other}><Icon name="globe" />{t("langName")}</a>
          {process.env.NEXT_PUBLIC_ACCOUNT_URL && <a href={process.env.NEXT_PUBLIC_ACCOUNT_URL}><Icon name="user" />{t("account")}</a>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
