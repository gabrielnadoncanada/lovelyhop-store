import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { Icon } from "@/components/ui/icons";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressForm } from "@/components/account/Forms";
import { removeAddress } from "@/app/account-actions";
import { accountPath, requireSession, withSession } from "@/lib/account";
import { getAccount } from "@/lib/shopify/customer-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return pageMetadata({ locale, title: t("addresses.title"), description: t("addresses.lead"), hrefs: sameRoute("/account/addresses"), noindex: true });
}

/** Adresses : liste, ajout (?new=1), modification (?edit=<id>), suppression. */
export default async function AddressesPage({ searchParams }: PageProps<"/[locale]/account/addresses">) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return (
    <>
      <PageAlternates hrefs={sameRoute("/account/addresses")} />
      <AccountShell locale={locale} active="addresses" title={t("addresses.title")}>
        <p className="lh-account__lead">{t("addresses.lead")}</p>
        <Suspense fallback={<div className="lh-account__cards" aria-hidden="true">{[0, 1].map((i) => <div className="lh-account__card" key={i}><span className="lh-skel lh-skel--title" /><span className="lh-skel lh-skel--text" style={{ marginTop: 12 }} /></div>)}</div>}>
          <Addresses locale={locale} searchParams={searchParams} />
        </Suspense>
      </AccountShell>
    </>
  );
}

async function Addresses({ locale, searchParams }: { locale: Locale; searchParams: PageProps<"/[locale]/account/addresses">["searchParams"] }) {
  const t = await getTranslations("account");
  const sp = await searchParams;
  const path = accountPath("/account/addresses", locale);
  await requireSession(locale, path);
  const a = await withSession(locale, path, () => getAccount(1));
  const editing = typeof sp.edit === "string" ? a.addresses.nodes.find((x) => x.id === sp.edit) ?? null : null;
  const adding = sp.new === "1";

  if (adding || editing) {
    return (
      <section className="lh-account__card lh-account__card--form">
        <h2>{editing ? t("addresses.formTitleEdit") : t("addresses.formTitleNew")}</h2>
        <AddressForm address={editing} isDefault={editing ? editing.id === a.defaultAddress?.id : a.addresses.nodes.length === 0} cancelHref={path} />
      </section>
    );
  }
  return (
    <>
      {a.addresses.nodes.length === 0 && <p className="lh-account__empty">{t("addresses.empty")}</p>}
      <div className="lh-account__cards">
        {a.addresses.nodes.map((x) => (
          <section className="lh-account__card lh-addr" key={x.id}>
            {x.id === a.defaultAddress?.id && <span className="lh-order__status lh-order__status--ok">{t("addresses.default")}</span>}
            <address>{x.formatted.map((l, i) => <span key={i}>{l}</span>)}</address>
            <div className="lh-addr__actions">
              <a className="lh-link" href={`${path}?edit=${encodeURIComponent(x.id)}`}>{t("addresses.edit")}</a>
              <form action={removeAddress}>
                <input type="hidden" name="id" value={x.id} /><input type="hidden" name="locale" value={locale} />
                <button className="lh-link lh-addr__remove" type="submit">{t("addresses.remove")}</button>
              </form>
            </div>
          </section>
        ))}
      </div>
      <a className="lh-btn lh-btn--primary" href={`${path}?new=1`}><Icon name="plus" />{t("addresses.add")}</a>
    </>
  );
}
