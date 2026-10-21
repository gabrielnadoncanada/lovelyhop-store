import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollection, getProduct } from "@/lib/catalog";
import { FEATURED_HANDLE, UNIVERS_HANDLES } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/types";
import type { Metadata } from "next";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { graph, organization, webPage, website } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";
import { Announce } from "@/components/layout/PageTop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { Spotlight } from "@/components/home/Spotlight";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductArt } from "@/components/art/byKey";
import { Newsletter } from "@/components/forms/Newsletter";
import { UniversTiles } from "@/components/catalog/UniversTiles";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { articles } from "@/lib/blog";
import { toCard } from "@/lib/blog-cards";
import { HEART_PATH, Icon } from "@/components/ui/icons";
import {
  ArtPilierChassis, ArtPilierPieces, ArtPilierPlateaux,
  HeroScene,
} from "@/components/art";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("meta");
  return pageMetadata({ locale, title: { absolute: t("title") }, description: t("description"), hrefs: sameRoute("/") });
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const [featured, creer, cpe] = await Promise.all([
    getProduct(FEATURED_HANDLE[locale], locale),
    getCollection(UNIVERS_HANDLES.creer[locale], locale),
    getCollection(UNIVERS_HANDLES.cpe[locale], locale),
  ]);
  const col = (u: keyof typeof UNIVERS_HANDLES) => ({ pathname: "/collections/[handle]" as const, params: { handle: UNIVERS_HANDLES[u][locale] } });
  const featuredHref = { pathname: "/[handle]" as const, params: { handle: FEATURED_HANDLE[locale] } };
  const strip = t.raw("hero.strip") as string[];
  const stripIcons = [
    <svg key="a" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>,
    <svg key="b" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6Z" /></svg>,
    <svg key="c" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 8.5 12 13 3 8.5Z" /><path d="m3 12.5 9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" /></svg>,
    <svg key="d" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h11v10H3zM14 10h4l3 3v3.5h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>,
  ];
  const sep = <svg viewBox="0 0 34 30"><path d={HEART_PATH} /></svg>;
  const pillars = t.raw("home.pillars") as [string, string][];
  const pillarArt = [ArtPilierChassis, ArtPilierPlateaux, ArtPilierPieces];

  return (
    <>
      <PageAlternates hrefs={sameRoute("/")} />
      <JsonLd data={graph(
        organization(t("footer.brand")),
        website(locale, t("meta.description")),
        webPage({ url: absoluteUrl("/", locale), name: t("meta.title"), description: t("meta.description"), locale }),
      )} />
      <Announce />
      <HeroSection label={t("nav.home")}>
        <SiteHeader />
        <div className="main" id="contenu" tabIndex={-1}>
          <div className="copy">
            <h1>
              <span className="line"><span>{t("hero.title1")}</span></span>
              <span className="line"><span>{t("hero.title2")}</span></span>
              <span className="line"><span><em>{t("hero.title3")}<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 13 C 40 6, 80 4, 120 8 S 180 14, 196 7" /></svg><svg className="spark" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 26 2 30M14 14 9 5M27 10l3-9" /></svg></em></span></span>
            </h1>
            <p className="lead">{t("hero.lead")}</p>
            <div className="ctas">
              <Link className="lh-btn lh-btn--primary lh-btn--lg" href={featuredHref}>{t("hero.cta")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></Link>
              <Link className="lh-link" href="/daycares">{t("hero.ctaPro")}</Link>
            </div>
            <div className="ages">
              <span className="label">{t("hero.shopBy")}</span>
              <Link className="lh-chip" href={col("creer")}><span className="lh-chip__icon"><svg viewBox="0 0 16 16" aria-hidden="true"><rect className="lh-ci-cube" x="1.5" y="5" width="13" height="7" rx="2" /><rect className="lh-ci-cube-in" x="3.5" y="6.5" width="4" height="3.5" rx="1" /><rect className="lh-ci-cube-in" x="8.5" y="6.5" width="4" height="3.5" rx="1" /></svg></span>{t("nav.univers.creer")}<i className="lh-chip__go">→</i></Link>
              <Link className="lh-chip" href={col("imaginer")}><span className="lh-chip__icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path className="lh-ci-arc1" d="M2.5 14V7L8 2.5 13.5 7v7Z" /></svg></span>{t("nav.univers.imaginer")}<i className="lh-chip__go">→</i></Link>
              <Link className="lh-chip" href={col("ranger")}><span className="lh-chip__icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path className="lh-ci-arc2" d="M3 2.5v11M13 2.5v11M3 6h10M3 10h10" /></svg></span>{t("nav.univers.ranger")}<i className="lh-chip__go">→</i></Link>
            </div>
          </div>
          <div className="stage">
            <div className="sun" aria-hidden="true" />
            <HeroScene />
            <div className="note" aria-hidden="true">
              <span>{t("hero.note1")}<br />{t("hero.note2")}</span>
              <svg viewBox="0 0 92 50"><path d="M4 30C26 6 60 2 86 24" /><path d="M83 11L86 24L73 23" /></svg>
            </div>
            <div className="badge" aria-hidden="true">
              <svg className="ring" viewBox="0 0 140 140">
                <defs><path id="v2Circ" d="M70 70m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0" /></defs>
                <text><textPath href="#v2Circ" textLength="322" lengthAdjust="spacing">{t("hero.ring")}</textPath></text>
              </svg>
              <svg className="mark" viewBox="0 0 34 30"><path d={HEART_PATH} /></svg>
            </div>
            <Link className="tag" href={featuredHref}>
              <span className="kicker">{t("hero.tagKicker")}</span>
              <div className="name">{t("hero.tagName")}</div>
              <div className="swatches"><i className="lh-dot-ochre" /><i className="lh-dot-sage" /><i className="lh-dot-wood" /><span>{t("hero.tagMeta")}</span></div>
              <div className="meta"><span>{t("hero.tagMaterial")}</span><span className="price">{formatMoney(featured?.minPrice, locale)}</span></div>
            </Link>
          </div>
        </div>
        <ul className="strip">
          {strip.flatMap((s, i) => [
            ...(i > 0 ? [<li key={`sep${i}`} className="sep" aria-hidden="true">{sep}</li>] : []),
            <li key={s}>{stripIcons[i]}{s}</li>,
          ])}
        </ul>
      </HeroSection>

      <main>
        <section className="lh-sec" id="univers">
          <div className="lh-section__head">
            <div><span className="lh-eyebrow">{t("home.universEyebrow")}</span><h2 className="lh-title">{t("home.universTitle")} <em>{t("home.universEm")}</em></h2></div>
            <Link className="lh-link" href="/collections">{t("home.universLink")}<Icon name="arrow" /></Link>
          </div>
          <UniversTiles />
        </section>

        <Spotlight product={featured} />

        {creer && (
          <section className="lh-sec" id="produits">
            <div className="lh-section__head">
              <div><span className="lh-eyebrow">{t("home.gridEyebrow")}</span><h2 className="lh-title">{t("home.gridTitle")} <em>{t("home.gridEm")}</em></h2></div>
              <Link className="lh-link" href={col("creer")}>{t("home.gridLink")}<Icon name="arrow" /></Link>
            </div>
            <div className="lh-grid">
              {creer.products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        <section className="lh-pro" id="cpe" aria-labelledby="pro-titre">
          <div>
            <span className="lh-eyebrow">{t("home.proEyebrow")}</span>
            <h2 className="lh-pro__title" id="pro-titre">{t("home.proTitle")} <em>{t("home.proEm")}</em></h2>
            <p>{t("home.proText")}</p>
            <div className="lh-pro__ctas">
              <Link className="lh-btn lh-btn--primary lh-btn--lg" href="/daycares">{t("home.proCta")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></Link>
              <Link className="lh-link" href={col("cpe")}>{t("home.proLink")}</Link>
            </div>
            <div className="lh-pro__perks">
              {(t.raw("home.perks") as string[]).map((p) => <span key={p}><Icon name="check" />{p}</span>)}
            </div>
          </div>
          <ul className="lh-pro__list">
            {(cpe?.products ?? []).slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link href={{ pathname: "/[handle]", params: { handle: p.handle } }}>
                  <span className="lh-pro__thumb"><ProductArt art={p.art} /></span>
                  <span><span className="lh-pro__name">{p.title}</span><span className="lh-pro__desc">{p.description}</span></span>
                  <span className="lh-pro__go"><Icon name="arrow" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="lh-approach lh-band" id="systeme">
          <div className="lh-approach__head">
            <div><span className="lh-eyebrow">{t("home.approachEyebrow")}</span><h2 className="lh-h2">{t("home.approachTitle")} <em>{t("home.approachEm")}</em></h2></div>
            <p className="lh-lead">{t("home.approachLead")}</p>
          </div>
          <div className="lh-approach__grid">
            {pillars.map(([title, text], i) => {
              const Art = pillarArt[i];
              return (
                <article className="lh-pillar" key={title}>
                  <div className="lh-pillar__art"><Art /></div>
                  <span className="lh-pillar__num">0{i + 1}</span><h3 className="lh-pillar__title">{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="lh-sec" id="guides">
          <div className="lh-section__head">
            <div><span className="lh-eyebrow">{t("home.guidesEyebrow")}</span><h2 className="lh-title">{t("home.guidesTitle")} <em>{t("home.guidesEm")}</em></h2></div>
            <Link className="lh-link" href="/blog">{t("home.guidesLink")}<Icon name="arrow" /></Link>
          </div>
          <div className="lh-guides">
            {articles(locale).slice(0, 3).map((g) => <ArticleCard key={g.handle} a={toCard(g, (n) => t("blog.readingTime", { minutes: n }))} />)}
          </div>
        </section>

        <Newsletter />
      </main>
    </>
  );
}
