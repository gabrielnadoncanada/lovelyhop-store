import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { getProducts } from "@/lib/catalog";
import { articleHref, articleHrefs, articles, getArticle, relatedArticles } from "@/lib/blog";
import { toCard } from "@/lib/blog-cards";
import { SITE } from "@/lib/seo/site";
import { PageTop } from "@/components/layout/PageTop";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { GuideArt } from "@/components/blog/GuideArt";
import { ProductCard } from "@/components/product/ProductCard";
import { Newsletter } from "@/components/forms/Newsletter";
import { Icon } from "@/components/ui/icons";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { blogPosting, breadcrumb, faq, graph, webPage } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/seo/urls";

export async function generateStaticParams() {
  const locale = (await rootParams.locale()) as Locale;
  return articles(locale).map((a) => ({ handle: a.handle }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const a = getArticle(handle, locale);
  if (!a) return {};
  return pageMetadata({
    locale,
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.excerpt,
    hrefs: articleHrefs(a),
    type: "article",
    image: a.image ? { url: a.image, alt: a.imageAlt ?? a.title } : null,
    article: { publishedTime: a.publishedAt, modifiedTime: a.updatedAt, authors: [a.author], section: a.theme },
  });
}

/** Un guide. */
export default async function ArticlePage({ params }: PageProps<"/[locale]/blog/[handle]">) {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const a = getArticle(handle, locale);
  if (!a) notFound();
  const t = await getTranslations("blog");
  const tp = await getTranslations("product");
  const format = await getFormatter();
  const products = await getProducts(a.products, locale);
  const related = relatedArticles(a);
  const date = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "long", timeZone: "UTC" });
  const author = a.author === SITE.name ? (locale === "fr" ? "l'équipe Lovelyhop" : "the Lovelyhop team") : a.author;
  const minutes = (n: number) => t("readingTime", { minutes: n });

  const url = absoluteUrl(articleHref(a.handle), locale);
  const blogUrl = absoluteUrl("/blog", locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: t("eyebrow"), href: "/blog" }, { name: a.title }];
  const productUrl = (h: string) => absoluteUrl({ pathname: "/[handle]", params: { handle: h } }, locale);
  const jsonLd = graph(
    webPage({ url, name: a.title, description: a.excerpt, locale, breadcrumb: true, dateModified: a.updatedAt ?? a.publishedAt, primaryImage: a.image }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    blogPosting({
      url,
      headline: a.title,
      description: a.seoDescription ?? a.excerpt,
      locale,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      author: a.author,
      image: a.image,
      section: a.theme,
      wordCount: a.wordCount,
      blogUrl,
      about: products.map((p) => ({ url: productUrl(p.handle), name: p.title })),
    }),
    faq(url, a.faq),
  );

  return (
    <>
      <PageAlternates hrefs={articleHrefs(a)} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <article className="lh-article">
          <header className="lh-article__head">
            <Crumbs items={crumbs} />
            <h1 className="lh-title">{a.title}</h1>
            <p className="lh-article__lead">{a.excerpt}</p>
            <p className="lh-article__meta">
              <span>{t("by", { author })}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={a.publishedAt}>{date(a.publishedAt)}</time>
              {a.updatedAt && a.updatedAt !== a.publishedAt && (
                <><span aria-hidden="true">·</span><span>{t("updated", { date: date(a.updatedAt) })}</span></>
              )}
              <span aria-hidden="true">·</span>
              <span>{minutes(a.readingMinutes)}</span>
              {(a.theme || a.age) && <><span aria-hidden="true">·</span><span>{[a.theme, a.age].filter(Boolean).join(" · ")}</span></>}
            </p>
          </header>

          <div className={`lh-article__cover lh-bg-${a.tone}`}>
            {a.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image} alt={a.imageAlt ?? ""} />
            ) : (
              <GuideArt art={a.art} />
            )}
          </div>

          <div className="lh-article__layout">
            {a.toc.length > 2 && (
              <nav className="lh-toc" aria-labelledby="toc-titre">
                <span className="lh-eyebrow" id="toc-titre">{t("toc")}</span>
                <ol>{a.toc.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol>
              </nav>
            )}
            <div className="lh-article__body">
              <ArticleBody code={a.mdx} />

              {a.faq.length > 0 && (
                <section className="lh-article__faq" aria-labelledby="faq-titre">
                  <h2 id="faq-titre">{tp("faqEyebrow")}</h2>
                  <div className="lh-acc">
                    {a.faq.map((f) => (
                      <details key={f.q}><summary>{f.q}<span className="lh-acc__plus" aria-hidden="true" /></summary><div className="lh-acc__body"><p>{f.a}</p></div></details>
                    ))}
                  </div>
                </section>
              )}

              <Link className="lh-link lh-article__back" href="/blog"><Icon name="arrow" />{t("back")}</Link>
            </div>
          </div>
        </article>

        {products.length > 0 && (
          <section className="lh-sec" aria-labelledby="mobilier-titre">
            <div className="lh-section__head"><div><span className="lh-eyebrow">{t("eyebrow")}</span><h2 className="lh-title" id="mobilier-titre">{t("products")}</h2></div></div>
            <div className="lh-grid">{products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}

        {related.length > 0 && (
          <section className="lh-sec" aria-labelledby="suite-titre">
            <div className="lh-section__head">
              <div><span className="lh-eyebrow">{t("eyebrow")}</span><h2 className="lh-title" id="suite-titre">{t("readNext")}</h2></div>
              <Link className="lh-link" href="/blog">{t("all")}<Icon name="arrow" /></Link>
            </div>
            <div className="lh-guides">{related.map((r) => <ArticleCard key={r.handle} a={toCard(r, minutes)} />)}</div>
          </section>
        )}

        <Newsletter />
      </main>
    </>
  );
}
