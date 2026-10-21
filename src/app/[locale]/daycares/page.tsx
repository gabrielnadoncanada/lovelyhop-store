import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, graph, webPage } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Icon } from "@/components/ui/icons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("daycares");
  return pageMetadata({ locale, title: { absolute: t("metaTitle") }, description: t("metaDescription"), hrefs: sameRoute("/daycares") });
}

/** Garderies et CPE : mobilier et demande de soumission. */
export default async function DaycaresPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("daycares");
  const th = await getTranslations("home");
  const tp = await getTranslations("product");
  const url = absoluteUrl("/daycares", locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: t("eyebrow") }];
  const jsonLd = graph(
    webPage({ url, name: t("metaTitle"), description: t("metaDescription"), locale, breadcrumb: true }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
  );
  return (
    <>
      <PageAlternates hrefs={sameRoute("/daycares")} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <section className="lh-pro" aria-labelledby="cpe-titre" style={{ marginTop: 32 }}>
          <div>
            <Crumbs items={crumbs} />
            <h1 className="lh-pro__title" id="cpe-titre">{t("title")} <em>{t("em")}</em></h1>
            <p>{t("lead")}</p>
            <div className="lh-pro__perks">{(th.raw("perks") as string[]).map((p) => <span key={p}><Icon name="check" />{p}</span>)}</div>
          </div>
          <ol className="lh-pro__steps">
            {(tp.raw("proSteps") as [string, string][]).map(([s, x]) => <li key={s}><span><strong>{s}</strong><span>{x}</span></span></li>)}
          </ol>
        </section>

        <section className="lh-contact" id="soumission" style={{ paddingTop: 72 }}>
          <div className="lh-contact__intro">
            <div className="lh-head"><span className="lh-eyebrow">{t("formEyebrow")}</span><h2 className="lh-title">{t("formTitle")}</h2></div>
            <p>{t("formLead")}</p>
            <ul className="lh-contact__facts">
              {(t.raw("facts") as [string, string][]).map(([s, x], i) => (
                <li key={s}><span><Icon name={(["check", "layers", "tool"] as const)[i]} /></span><p><strong>{s}</strong>{x}</p></li>
              ))}
            </ul>
            <p style={{ marginTop: "var(--space-6)" }}>{t("askText")} <Link className="lh-link" href="/contact">{t("askLink")}</Link></p>
          </div>
          <div className="lh-contact__card">
            <QuoteForm />
          </div>
        </section>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}
