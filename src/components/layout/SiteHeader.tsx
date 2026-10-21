"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useAlternates } from "@/components/layout/Alternates";
import { Icon, UniversIcon } from "@/components/ui/icons";
import { SearchPalette } from "@/components/layout/SearchPalette";
import { NAV_PRODUCTS, UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";

/** Univers annoncés dans le menu mais sans produit pour l'instant. */
const SOON = ["imaginer", "ranger", "bouger"] as const;
/** Panneau ouvert sous la barre : la boutique, les ressources, ou rien. */
type Panel = "shop" | "resources" | null;

/**
 * En-tête du site (composant lh-nav du design system) : un méga menu « Boutique », les garderies,
 * un panneau « Ressources », puis langue, recherche, panier et menu mobile.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const other: Locale = locale === "fr" ? "en" : "fr";
  const alt = useAlternates();
  const { cart, setOpen, bump } = useCart();
  const [mega, setMega] = useState<Panel>(null);
  const [search, setSearch] = useState(false);
  const [mnav, setMnav] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMega(null); setSearch(false); setMnav(false); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setMega(null); setMnav(false); setSearch((v) => !v); }
    };
    const onClick = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setMega(null); setSearch(false); } };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  const hover = (panel: Panel) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMega(panel), panel ? 150 : 250);
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
          <Link
            href="/collections"
            aria-expanded={mega === "shop"}
            aria-controls="mega-boutique"
            onMouseEnter={() => hover("shop")}
            onClick={(e) => { e.preventDefault(); setSearch(false); setMega("shop"); }}
          >
            {t("shop")}<Icon name="chev" />
          </Link>
          <Link href="/daycares" onMouseEnter={() => hover(null)} onClick={close}>{t("univers.cpe")}</Link>
          <span style={{ position: "relative" }} onMouseEnter={() => hover("resources")}>
            <Link
              href="/blog"
              aria-expanded={mega === "resources"}
              aria-controls="menu-ressources"
              onClick={(e) => { e.preventDefault(); setSearch(false); setMega((m) => (m === "resources" ? null : "resources")); }}
            >
              {t("resources")}<Icon name="chev" />
            </Link>
            {mega === "resources" && <ResourcesMenu onNavigate={close} />}
          </span>
        </nav>
        <div className="lh-nav__tools">
          <a className="lh-nav__lang" href={altHref} lang={other} hrefLang={other} aria-label={t("langSwitch")}>{t("langShort")}</a>
          <Link className="lh-nav__icon lh-nav__acct" href="/account" aria-label={t("account")} onClick={close}><Icon name="user" className="" /></Link>
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

      {mega === "shop" && (
        <div className="lh-mega-wrap" onMouseEnter={() => hover("shop")}>
          <MegaMenu locale={locale} onNavigate={close} />
        </div>
      )}
      {search && <SearchPalette onClose={() => setSearch(false)} />}
      {mnav && <MobileNav locale={locale} altHref={altHref} other={other} onClose={() => setMnav(false)} />}
    </div>
  );
}

/** Liens vers les fiches de « Créer et découvrir », les seuls produits en ligne pour l'instant. */
function CreerLinks({ locale, onNavigate }: { locale: Locale; onNavigate: () => void }) {
  const t = useTranslations("nav");
  const labels = t.raw("sub.creer") as string[];
  return (
    <ul>
      {NAV_PRODUCTS.creer.map((h, i) => (
        <li key={h.fr}><Link href={{ pathname: "/[handle]", params: { handle: h[locale] } }} onClick={onNavigate}>{labels[i]}</Link></li>
      ))}
    </ul>
  );
}

/** Titre d'univers avec, s'il y a lieu, la pastille « Bientôt ». */
function UniversTitle({ univers, soon }: { univers: "creer" | "imaginer" | "ranger" | "bouger"; soon?: boolean }) {
  const t = useTranslations("nav");
  return (
    <h3>
      <span className="lh-mega__ico"><UniversIcon univers={univers} /></span>{t(`univers.${univers}`)}
      {soon && <span className="lh-mega__soon">{t("soon")}</span>}
    </h3>
  );
}

function MegaMenu({ locale, onNavigate }: { locale: Locale; onNavigate: () => void }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const univers = (u: keyof typeof UNIVERS_HANDLES) => ({ pathname: "/collections/[handle]" as const, params: { handle: UNIVERS_HANDLES[u][locale] } });
  const teaser: React.CSSProperties = { margin: "0 0 var(--space-4)", font: "400 14px/20px var(--font-sans)", color: "var(--ink-muted)" };
  return (
    <div className="lh-mega" id="mega-boutique">
      <div className="lh-mega__col">
        <UniversTitle univers="creer" />
        <CreerLinks locale={locale} onNavigate={onNavigate} />
        <Link className="lh-link" href={univers("creer")} onClick={onNavigate}>{tc("seeAll")}</Link>
      </div>
      <div className="lh-mega__col">
        <UniversTitle univers="imaginer" soon />
        <p style={teaser}>{t("teaser.imaginer")}</p>
        <Link className="lh-link" href={univers("imaginer")} onClick={onNavigate}>{t("seeUnivers")}</Link>
      </div>
      <div className="lh-mega__col">
        <UniversTitle univers="ranger" soon />
        <p style={teaser}>{t("teaser.ranger")}</p>
        <Link className="lh-link" href={univers("ranger")} onClick={onNavigate}>{t("seeUnivers")}</Link>
      </div>
      <div className="lh-mega__col">
        <UniversTitle univers="bouger" soon />
        <p style={teaser}>{t("teaser.bouger")}</p>
        <Link className="lh-link" href={univers("bouger")} onClick={onNavigate}>{t("seeUnivers")}</Link>
      </div>
    </div>
  );
}

/** Menu déroulant « Ressources », sous son lien : les mêmes liens que la colonne Ressources du pied de page. */
function ResourcesMenu({ onNavigate }: { onNavigate: () => void }) {
  const tf = useTranslations("footer");
  const links = [
    { href: "/blog" as const, label: tf("guides") },
    { href: "/faq" as const, label: tf("faq") },
    { href: "/shipping" as const, label: tf("shipping") },
    { href: "/contact" as const, label: tf("contact") },
  ];
  return (
    <div
      id="menu-ressources"
      className="lh-mega__col"
      style={{ position: "absolute", top: "calc(100% + 14px)", left: -14, zIndex: 40, minWidth: 240, padding: "10px 14px", borderRadius: "var(--radius-md)", background: "var(--lin)", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-lift)", animation: "lh-mega-in .35s var(--ease) both" }}
    >
      <ul style={{ margin: 0 }}>
        {links.map((l) => <li key={l.href}><Link href={l.href} onClick={onNavigate}>{l.label}</Link></li>)}
      </ul>
    </div>
  );
}

function MobileNav({ locale, altHref, other, onClose }: { locale: Locale; altHref: string; other: Locale; onClose: () => void }) {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);
  const groupTitle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, minHeight: 60, font: "450 20px/1.2 var(--font-display)", fontVariationSettings: "'SOFT' 100" };
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
            <details className="lh-mnav__group" open>
              <summary><span className="lh-mega__ico"><UniversIcon univers="creer" /></span>{t("univers.creer")}<Icon name="chev" /></summary>
              <CreerLinks locale={locale} onNavigate={onClose} />
            </details>
            {SOON.map((u) => (
              <div className="lh-mnav__group" key={u}>
                <span style={groupTitle}>
                  <span className="lh-mega__ico"><UniversIcon univers={u} /></span>{t(`univers.${u}`)} <span className="lh-mega__soon">{t("soon")}</span>
                </span>
              </div>
            ))}
          </div>
          <Link className="lh-mnav__pro" href="/daycares" onClick={onClose}>
            <span><strong>{t("proTitle")}</strong><span>{t("proText")}</span></span>
            <span className="lh-icon-btn"><Icon name="arrow" /></span>
          </Link>
        </div>
        <div className="lh-mnav__foot">
          <Link href="/collections" onClick={onClose}><Icon name="layers" />{t("universIndex")}</Link>
          <Link href="/blog" onClick={onClose}><Icon name="heart" />{t("guides")}</Link>
          <Link href="/faq" onClick={onClose}><Icon name="shield" />{tf("faq")}</Link>
          <Link href="/shipping" onClick={onClose}><Icon name="truck" />{tf("shipping")}</Link>
          <Link href="/contact" onClick={onClose}><Icon name="mail" />{tf("contact")}</Link>
          <a href={altHref} lang={other} hrefLang={other}><Icon name="globe" />{t("langName")}</a>
          <Link href="/account" onClick={onClose}><Icon name="user" />{t("account")}</Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
