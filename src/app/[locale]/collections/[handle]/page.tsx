import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { getLocale, getTranslations } from "next-intl/server";
import { getCollection } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Collection, Locale } from "@/lib/types";
import { PageTop } from "@/components/layout/PageTop";
import { ProductCard } from "@/components/product/ProductCard";
import { Newsletter } from "@/components/forms/Newsletter";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, graph, itemList, webPage } from "@/lib/seo/schema";
import { absoluteUrl, type LocalizedHref } from "@/lib/seo/urls";

export async function generateStaticParams() {
  const locale = (await rootParams.locale()) as Locale;
  return Object.values(UNIVERS_HANDLES).map((h) => ({ handle: h[locale] }));
}

const collectionHrefs = (c: Collection): LocalizedHref => ({
  fr: c.handles.fr ? { pathname: "/collections/[handle]", params: { handle: c.handles.fr } } : undefined,
  en: c.handles.en ? { pathname: "/collections/[handle]", params: { handle: c.handles.en } } : undefined,
});

export async function generateMetadata({ params }: PageProps<"/[locale]/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const c = await getCollection(handle, locale);
  if (!c) return {};
  const suffix = locale === "fr" ? " : meubles de jeu en bois" : ": wooden play furniture";
  return pageMetadata({ locale, title: c.title + suffix, description: c.description, hrefs: collectionHrefs(c) });
}

/** Page d'univers (collection Shopify). */
export default async function CollectionPage({ params }: PageProps<"/[locale]/collections/[handle]">) {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const c = await getCollection(handle, locale);
  if (!c) notFound();
  const t = await getTranslations("collection");
  const tp = await getTranslations("product");
  const tn = await getTranslations("nav");
  const i = c.title.lastIndexOf(" ");

  const url = absoluteUrl({ pathname: "/collections/[handle]", params: { handle: c.handle } }, locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: tn("universIndex"), href: "/collections" }, { name: c.title }];
  const jsonLd = graph(
    webPage({ url, name: c.title, description: c.description, locale, type: "CollectionPage", breadcrumb: true }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    c.products.length
      ? itemList(url, c.title, c.products.map((p) => ({ url: absoluteUrl({ pathname: "/[handle]", params: { handle: p.handle } }, locale), name: p.title, image: p.images[0]?.url })))
      : null,
  );

  return (
    <>
      <PageAlternates hrefs={collectionHrefs(c)} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <section className="lh-sec" style={{ paddingTop: 40 }}>
          <div className="lh-head">
            <Crumbs items={crumbs} />
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
