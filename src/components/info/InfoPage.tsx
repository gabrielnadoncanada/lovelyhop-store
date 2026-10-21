import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { getPage, INFO_PAGES, type InfoKey } from "@/lib/pages";
import { PageTop } from "@/components/layout/PageTop";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { Icon } from "@/components/ui/icons";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, faq, graph, webPage } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";
import { WithTodos } from "./Todo";

const LABEL: Record<InfoKey, "privacy" | "terms" | "shipping" | "faq"> = { privacy: "privacy", terms: "terms", shipping: "shipping", faq: "faq" };

/** Métadonnées d'une page d'information. Une page encore « review » n'est pas indexée. */
export async function infoMetadata(key: InfoKey): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const p = getPage(key, locale);
  if (!p) return {};
  return pageMetadata({ locale, title: p.title, description: p.description, hrefs: sameRoute(INFO_PAGES[key]), noindex: p.review });
}

/** Page d'information (confidentialité, conditions, livraison et retours, FAQ), écrite en MDX dans content/pages. */
export async function InfoPage({ pageKey }: { pageKey: InfoKey }) {
  const locale = (await getLocale()) as Locale;
  const p = getPage(pageKey, locale);
  if (!p) notFound();
  const t = await getTranslations("info");
  const tp = await getTranslations("product");
  const tf = await getTranslations("footer");
  const format = await getFormatter();
  const href = INFO_PAGES[pageKey];
  const url = absoluteUrl(href, locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: p.title }];
  const others = (Object.keys(INFO_PAGES) as InfoKey[]).filter((k) => k !== pageKey);
  const jsonLd = graph(
    webPage({ url, name: p.title, description: p.description, locale, breadcrumb: true, dateModified: p.updatedAt }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    faq(url, p.faq),
  );

  return (
    <>
      <PageAlternates hrefs={sameRoute(href)} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <article className="lh-article lh-info">
          <header className="lh-article__head">
            <Crumbs items={crumbs} />
            <h1 className="lh-title">{p.title}</h1>
            <p className="lh-article__lead">{p.description}</p>
            <p className="lh-article__meta"><span>{t("updated", { date: format.dateTime(new Date(p.updatedAt), { dateStyle: "long", timeZone: "UTC" }) })}</span></p>
          </header>

          {p.review && (
            <div className="lh-notice lh-notice--warning lh-info__review" role="note">
              <span className="lh-notice__icon"><Icon name="tool" /></span>
              <div><strong className="lh-notice__title">{t("reviewTitle")}</strong>{t("reviewText", { count: p.todos.length })}</div>
            </div>
          )}

          <div className="lh-article__layout">
            {p.toc.length > 2 && (
              <nav className="lh-toc" aria-labelledby="toc-titre">
                <span className="lh-eyebrow" id="toc-titre">{p.eyebrow}</span>
                <ol>{p.toc.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol>
              </nav>
            )}
            <div className="lh-article__body">
              {p.faq.length > 0 && (
                <div className="lh-acc lh-info__faq">
                  {p.faq.map((f) => (
                    <details key={f.q}><summary><span><WithTodos text={f.q} /></span><span className="lh-acc__plus" aria-hidden="true" /></summary><div className="lh-acc__body"><p><WithTodos text={f.a} /></p></div></details>
                  ))}
                </div>
              )}
              <ArticleBody code={p.mdx} />

              <nav className="lh-info__related" aria-label={t("related")}>
                <span className="lh-eyebrow">{t("related")}</span>
                <ul>
                  {others.map((k) => (
                    <li key={k}><Link className="lh-link" href={INFO_PAGES[k]}>{tf(LABEL[k])}<Icon name="arrow" /></Link></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
