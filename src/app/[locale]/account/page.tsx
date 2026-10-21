import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { Icon } from "@/components/ui/icons";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderList } from "@/components/account/OrderList";
import { accountPath, loginUrl, requireSession, withSession } from "@/lib/account";
import { readSession } from "@/lib/shopify/customer";
import { getAccount } from "@/lib/shopify/customer-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return pageMetadata({ locale, title: { absolute: t("metaTitle") }, description: t("signIn.lead"), hrefs: sameRoute("/account"), noindex: true });
}

/** Mon compte : page de connexion si personne n'est connecté, sinon l'aperçu (dernières commandes, adresse, profil). */
export default async function AccountPage({ searchParams }: PageProps<"/[locale]/account">) {
  const locale = (await getLocale()) as Locale;
  return (
    <>
      <PageAlternates hrefs={sameRoute("/account")} />
      <Suspense fallback={<><PageTop /><main id="contenu"><div className="lh-account"><div /><div className="lh-account__main"><span className="lh-skel lh-skel--title" /><span className="lh-skel lh-skel--text" style={{ marginTop: 16, width: "50%" }} /></div></div></main></>}>
        <Overview locale={locale} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Overview({ locale, searchParams }: { locale: Locale; searchParams: PageProps<"/[locale]/account">["searchParams"] }) {
  const t = await getTranslations("account");
  const sp = await searchParams;
  const path = accountPath("/account", locale);
  const session = await readSession();
  if (!session) return <SignIn locale={locale} path={path} error={sp.auth === "error"} />;
  await requireSession(locale, path);
  const a = await withSession(locale, path, () => getAccount(3));
  const defaultAddress = a.addresses.nodes.find((x) => x.id === a.defaultAddress?.id) ?? a.addresses.nodes[0] ?? null;
  const name = a.firstName ? `, ${a.firstName}` : "";
  return (
    <AccountShell locale={locale} active="overview" title={t("hello", { name })}>
      <section className="lh-account__section">
        <div className="lh-account__section-head"><h2>{t("overview.ordersTitle")}</h2><Link className="lh-link" href="/account/orders">{t("overview.allOrders")}<Icon name="arrow" /></Link></div>
        <OrderList orders={a.orders.nodes} locale={locale} />
        {a.orders.nodes.length === 0 && <Link className="lh-btn lh-btn--secondary" href="/collections">{t("overview.shop")}</Link>}
      </section>
      <div className="lh-account__cards">
        <section className="lh-account__card">
          <h2>{t("overview.addressTitle")}</h2>
          {defaultAddress ? <address>{defaultAddress.formatted.map((l, i) => <span key={i}>{l}</span>)}</address> : <p>{t("overview.noAddress")}</p>}
          <Link className="lh-link" href="/account/addresses">{t("overview.manageAddresses")}<Icon name="arrow" /></Link>
        </section>
        <section className="lh-account__card">
          <h2>{t("overview.profileTitle")}</h2>
          <p><strong>{a.displayName}</strong><br />{a.emailAddress?.emailAddress}{a.phoneNumber?.phoneNumber && <><br />{a.phoneNumber.phoneNumber}</>}</p>
          <Link className="lh-link" href="/account/profile">{t("overview.editProfile")}<Icon name="arrow" /></Link>
        </section>
      </div>
    </AccountShell>
  );
}

async function SignIn({ locale, path, error }: { locale: Locale; path: string; error: boolean }) {
  const t = await getTranslations("account");
  const tp = await getTranslations("product");
  return (
    <>
      <PageTop />
      <main id="contenu">
        <section className="lh-signin">
          <div className="lh-head">
            <nav className="lh-crumbs-head" aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}><ol className="lh-crumbs"><li><Link href="/">{tp("crumbsHome")}</Link><Icon name="chevRight" /></li><li><span aria-current="page">{t("title")}</span></li></ol></nav>
            <h1 className="lh-title">{t("signIn.title")} <em>{t("signIn.em")}</em></h1>
            <p>{t("signIn.lead")}</p>
          </div>
          {error && <div className="lh-notice lh-notice--danger" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{t("signIn.error")}</div></div>}
          <a className="lh-btn lh-btn--primary lh-btn--lg" href={loginUrl(locale, path)}>{t("signIn.cta")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></a>
          <p className="lh-signin__note">{t("signIn.note")}</p>
        </section>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}
