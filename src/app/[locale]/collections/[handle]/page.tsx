import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollection } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";
import { SetAlternates } from "@/components/layout/Alternates";
import { PageTop } from "@/components/layout/PageTop";
import { ProductCard } from "@/components/product/ProductCard";
import { Newsletter } from "@/components/forms/Newsletter";
import { Icon } from "@/components/ui/icons";

export async function generateStaticParams() {
  const locale = (await rootParams.locale()) as Locale;
  return Object.values(UNIVERS_HANDLES).map((h) => ({ handle: h[locale] }));
}

const path = (locale: Locale, handle?: string) => (handle ? (locale === "fr" ? `/univers/${handle}` : `/en/collections/${handle}`) : undefined);

export async function generateMetadata({ params }: PageProps<"/[locale]/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const c = await getCollection(handle, locale);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: path(locale, c.handle), languages: { "fr-CA": path("fr", c.handles.fr), "en-CA": path("en", c.handles.en) } },
  };
}

/** Page d'univers (collection Shopify). */
export default async function CollectionPage({ params }: PageProps<"/[locale]/collections/[handle]">) {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const c = await getCollection(handle, locale);
  if (!c) notFound();
  const t = await getTranslations("collection");
  const tp = await getTranslations("product");
  const i = c.title.lastIndexOf(" ");
  return (
    <>
      <SetAlternates fr={path("fr", c.handles.fr)} en={path("en", c.handles.en)} />
      <PageTop />
      <main id="contenu">
        <nav className="lh-crumbs-bar" aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}>
          <ol className="lh-crumbs"><li><Link href="/">{tp("crumbsHome")}</Link><Icon name="chevRight" /></li><li><span aria-current="page">{c.title}</span></li></ol>
        </nav>
        <section className="lh-sec" style={{ paddingTop: 32 }}>
          <div className="lh-head">
            <span className="lh-eyebrow">{t("eyebrow")}</span>
            <h1 className="lh-title">{i > 0 ? <>{c.title.slice(0, i)} <em>{c.title.slice(i + 1)}</em></> : <em>{c.title}</em>}</h1>
            <p>{c.description}</p>
          </div>
          <div className="lh-toolbar"><span className="lh-toolbar__count" aria-live="polite">{t("count", { count: c.products.length })}</span></div>
          {c.products.length ? (
            <div className="lh-grid">{c.products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <p className="lh-search__empty">{t("empty")}</p>
          )}
        </section>
        <Newsletter />
      </main>
    </>
  );
}
