import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollection } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale, UniversKey } from "@/lib/types";
import { PageTop } from "@/components/layout/PageTop";
import { UniversTiles } from "@/components/catalog/UniversTiles";
import { ProductCard } from "@/components/product/ProductCard";
import { Newsletter } from "@/components/forms/Newsletter";
import { Icon } from "@/components/ui/icons";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, graph, itemList, webPage } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";

const ORDER: UniversKey[] = ["creer", "imaginer", "ranger", "bouger"];

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("collections");
  return pageMetadata({ locale, title: t("metaTitle"), description: t("metaDescription"), hrefs: sameRoute("/collections") });
}

/** Index des univers : les quatre tuiles, puis un aperçu de chaque univers. */
export default async function CollectionsIndexPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("collections");
  const tc = await getTranslations("collection");
  const tp = await getTranslations("product");
  const tn = await getTranslations("nav");
  const collections = await Promise.all(ORDER.map((u) => getCollection(UNIVERS_HANDLES[u][locale], locale)));
  const colHref = (u: UniversKey) => ({ pathname: "/collections/[handle]" as const, params: { handle: UNIVERS_HANDLES[u][locale] } });

  const url = absoluteUrl("/collections", locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: tn("universIndex") }];
  const jsonLd = graph(
    webPage({ url, name: t("metaTitle"), description: t("metaDescription"), locale, type: "CollectionPage", breadcrumb: true }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    itemList(
      url,
      tn("universIndex"),
      [...ORDER, "cpe" as const].map((u) => ({ url: absoluteUrl(colHref(u), locale), name: tn(`univers.${u}`) })),
    ),
  );

  return (
    <>
      <PageAlternates hrefs={sameRoute("/collections")} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <section className="lh-sec" style={{ paddingTop: 40 }}>
          <div className="lh-head">
            <Crumbs items={crumbs} />
            <h1 className="lh-title">{t("title")} <em>{t("em")}</em></h1>
            <p>{t("lead")}</p>
          </div>
          <UniversTiles headingLevel={2} />
        </section>

        {ORDER.map((u, i) => {
          const c = collections[i];
          if (!c) return null;
          return (
            <section className="lh-sec" key={u} aria-labelledby={`univers-${u}`}>
              <div className="lh-section__head">
                <div>
                  {c.products.length > 0 && <span className="lh-eyebrow">{tc("count", { count: c.products.length })}</span>}
                  <h2 className="lh-title" id={`univers-${u}`}>{c.title}</h2>
                </div>
                <Link className="lh-link" href={colHref(u)}>{t("seeAll")}<Icon name="arrow" /></Link>
              </div>
              {c.products.length ? (
                <div className="lh-grid">{c.products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
              ) : (
                <p className="lh-search__empty">{t("soonText")}</p>
              )}
            </section>
          );
        })}

        <section className="lh-sec">
          <div className="lh-pro-box">
            <span className="lh-pro-box__ico"><Icon name="home" /></span>
            <p><strong>{t("proTitle")}</strong>{t("proText")}</p>
            <Link className="lh-link" href="/daycares">{t("proLink")}</Link>
          </div>
        </section>

        <Newsletter />
      </main>
    </>
  );
}
