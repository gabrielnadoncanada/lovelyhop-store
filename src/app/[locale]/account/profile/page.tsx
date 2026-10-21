import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/Forms";
import { accountPath, requireSession, withSession } from "@/lib/account";
import { getAccount } from "@/lib/shopify/customer-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return pageMetadata({ locale, title: t("profile.title"), description: t("profile.lead"), hrefs: sameRoute("/account/profile"), noindex: true });
}

export default async function ProfilePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return (
    <>
      <PageAlternates hrefs={sameRoute("/account/profile")} />
      <AccountShell locale={locale} active="profile" title={t("profile.title")}>
        <p className="lh-account__lead">{t("profile.lead")}</p>
        <Suspense fallback={<div className="lh-account__card" aria-hidden="true"><span className="lh-skel lh-skel--title" /><span className="lh-skel lh-skel--text" style={{ marginTop: 12 }} /></div>}>
          <Profile locale={locale} />
        </Suspense>
      </AccountShell>
    </>
  );
}

async function Profile({ locale }: { locale: Locale }) {
  const t = await getTranslations("account");
  const path = accountPath("/account/profile", locale);
  await requireSession(locale, path);
  const a = await withSession(locale, path, () => getAccount(1));
  const home = locale === "fr" ? "/" : "/en";
  return (
    <>
      <section className="lh-account__card lh-account__card--form">
        <ProfileForm firstName={a.firstName ?? ""} lastName={a.lastName ?? ""} />
      </section>
      <div className="lh-account__cards">
        <section className="lh-account__card">
          <h2>{t("profile.email")}</h2>
          <p><strong>{a.emailAddress?.emailAddress ?? "—"}</strong></p>
          <p className="lh-account__note">{t("profile.emailNote")}</p>
        </section>
        <section className="lh-account__card">
          <h2>{t("profile.logout")}</h2>
          <p className="lh-account__note">{t("profile.logoutNote")}</p>
          <a className="lh-btn lh-btn--secondary" href={`/api/auth/logout?return=${encodeURIComponent(home)}`}>{t("profile.logout")}</a>
        </section>
      </div>
    </>
  );
}
