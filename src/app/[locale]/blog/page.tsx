import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { articleHref, articleThemes, articles } from "@/lib/blog";
import { toCard } from "@/lib/blog-cards";
import { PageTop } from "@/components/layout/PageTop";
import { GuideList } from "@/components/blog/GuideList";
import { Newsletter } from "@/components/forms/Newsletter";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { blog, breadcrumb, graph, webPage } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");
  return pageMetadata({ locale, title: t("metaTitle"), description: t("metaDescription"), hrefs: sameRoute("/blog") });
}

/** Index des guides. */
export default async function BlogPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");
  const tp = await getTranslations("product");
  const list = articles(locale);
  const url = absoluteUrl("/blog", locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: t("eyebrow") }];
  const jsonLd = graph(
    webPage({ url, name: t("metaTitle"), description: t("metaDescription"), locale, type: "CollectionPage", breadcrumb: true }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    blog(url, {
      name: t("metaTitle"),
      description: t("metaDescription"),
      locale,
      posts: list.map((a) => ({ url: absoluteUrl(articleHref(a.handle), locale), headline: a.title, datePublished: a.publishedAt })),
    }),
  );

  return (
    <>
      <PageAlternates hrefs={sameRoute("/blog")} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <Crumbs items={crumbs} />
        <section className="lh-sec lh-blog" style={{ paddingTop: 32 }}>
          <div className="lh-head">
            <span className="lh-eyebrow">{t("eyebrow")}</span>
            <h1 className="lh-title">{t("title")} <em>{t("em")}</em></h1>
            <p>{t("lead")}</p>
          </div>
          <GuideList items={list.map((a) => toCard(a, (n) => t("readingTime", { minutes: n })))} themes={articleThemes(locale)} />
        </section>
        <Newsletter />
      </main>
    </>
  );
}
