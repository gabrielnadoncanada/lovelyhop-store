import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { searchProducts } from "@/lib/catalog";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/icons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("search");
  return pageMetadata({ locale, title: t("pageTitle"), description: t("prompt"), hrefs: sameRoute("/search"), noindex: true });
}

export default async function SearchPage({ searchParams }: PageProps<"/[locale]/search">) {
  const t = await getTranslations("search");
  const locale = (await getLocale()) as Locale;
  return (
    <>
      <PageAlternates hrefs={sameRoute("/search")} />
      <PageTop />
      <main id="contenu">
        <section className="lh-sec" style={{ paddingTop: 40 }}>
          <form className="lh-input-wrap" action={locale === "fr" ? "/recherche" : "/en/search"} role="search" style={{ maxWidth: 640, marginBottom: 32 }}>
            <Icon name="search" />
            <input className="lh-input" name="q" type="search" aria-label={t("input")} placeholder={t("placeholder")} />
          </form>
          <Suspense fallback={<div className="lh-grid" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className="lh-skel lh-skel--arch" />)}</div>}>
            <Results searchParams={searchParams} locale={locale} />
          </Suspense>
        </section>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}

async function Results({ searchParams, locale }: { searchParams: PageProps<"/[locale]/search">["searchParams"]; locale: Locale }) {
  const t = await getTranslations("search");
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();
  if (!q) return <h1 className="lh-title">{t("prompt")}</h1>;
  const products = await searchProducts(q, locale);
  return (
    <>
      <h1 className="lh-title" style={{ marginBottom: 32 }}>{t("resultsFor", { count: products.length, q })}</h1>
      {products.length ? <div className="lh-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <p className="lh-search__empty">{t("empty", { q })}</p>}
    </>
  );
}
