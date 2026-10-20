import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollection } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";
import { SetAlternates } from "@/components/layout/Alternates";
import { PageTop } from "@/components/layout/PageTop";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ProductArt } from "@/components/art/byKey";
import { Icon } from "@/components/ui/icons";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("daycares");
  return { title: { absolute: t("metaTitle") }, description: t("metaDescription"), alternates: { canonical: "/garderies-cpe", languages: { "fr-CA": "/garderies-cpe", "en-CA": "/en/daycares" } } };
}

/** Garderies et CPE : mobilier et demande de soumission. */
export default async function DaycaresPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("daycares");
  const th = await getTranslations("home");
  const tp = await getTranslations("product");
  const cpe = await getCollection(UNIVERS_HANDLES.cpe[locale], locale);
  return (
    <>
      <SetAlternates fr="/garderies-cpe" en="/en/daycares" />
      <PageTop />
      <main id="contenu">
        <nav className="lh-crumbs-bar" aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}>
          <ol className="lh-crumbs"><li><Link href="/">{tp("crumbsHome")}</Link><Icon name="chevRight" /></li><li><span aria-current="page">{t("eyebrow")}</span></li></ol>
        </nav>
        <section className="lh-pro" aria-labelledby="cpe-titre" style={{ marginTop: 32 }}>
          <div>
            <span className="lh-eyebrow">{t("eyebrow")}</span>
            <h1 className="lh-pro__title" id="cpe-titre">{t("title")} <em>{t("em")}</em></h1>
            <p>{t("lead")}</p>
            <div className="lh-pro__perks">{(th.raw("perks") as string[]).map((p) => <span key={p}><Icon name="check" />{p}</span>)}</div>
          </div>
          <ol className="lh-pro__steps">
            {(tp.raw("proSteps") as [string, string][]).map(([s, x]) => <li key={s}><span><strong>{s}</strong><span>{x}</span></span></li>)}
          </ol>
        </section>

        <section className="lh-sec" id="soumission">
          <div className="lh-detail">
            <div>
              <div className="lh-head"><span className="lh-eyebrow">{t("furniture")}</span><h2 className="lh-title">{t("formTitle")}</h2></div>
              <ul className="lh-pro__list" style={{ ["--ink-inverse" as string]: "var(--ink)", ["--ink-inverse-muted" as string]: "var(--ink-muted)" }}>
                {(cpe?.products ?? []).map((p) => (
                  <li key={p.id}>
                    <Link href={{ pathname: "/[handle]", params: { handle: p.handle } }}>
                      <span className="lh-pro__thumb"><ProductArt art={p.art} /></span>
                      <span><span className="lh-pro__name">{p.title}</span><span className="lh-pro__desc">{p.description}</span></span>
                      <span className="lh-pro__go"><Icon name="arrow" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <QuoteForm />
          </div>
        </section>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}
