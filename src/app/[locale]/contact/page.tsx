import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { CONTACT_EMAIL } from "@/lib/constants";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, graph, webPage } from "@/lib/seo/schema";
import { absoluteUrl, sameRoute } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/icons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contact");
  return pageMetadata({ locale, title: { absolute: t("metaTitle") }, description: t("metaDescription"), hrefs: sameRoute("/contact") });
}

/** Nous joindre : formulaire de contact, courriel direct et renvoi vers la soumission CPE. */
export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contact");
  const tp = await getTranslations("product");
  const url = absoluteUrl("/contact", locale);
  const crumbs: CrumbItem[] = [{ name: tp("crumbsHome"), href: "/" }, { name: t("eyebrow") }];
  const jsonLd = graph(
    webPage({ url, name: t("metaTitle"), description: t("metaDescription"), locale, type: "ContactPage", breadcrumb: true }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
  );
  return (
    <>
      <PageAlternates hrefs={sameRoute("/contact")} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu">
        <section className="lh-contact" id="contact">
          <div className="lh-contact__intro">
            <div className="lh-head">
              <Crumbs items={crumbs} />
              <h1 className="lh-title">{t("title")} <em>{t("em")}</em></h1>
            </div>
            <p>{t("lead")}</p>
            <ul className="lh-contact__facts">
              <li><span><Icon name="mail" /></span><p><strong>{t("emailAlt")}</strong><a className="lh-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></li>
              <li><span><Icon name="layers" /></span><p><strong>{t("cpeText")}</strong><Link className="lh-link" href="/daycares">{t("cpeLink")}</Link></p></li>
            </ul>
          </div>
          <div className="lh-contact__card">
            <ContactForm />
          </div>
        </section>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}
