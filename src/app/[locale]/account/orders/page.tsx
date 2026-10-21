import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderList } from "@/components/account/OrderList";
import { accountPath, requireSession, withSession } from "@/lib/account";
import { getOrders } from "@/lib/shopify/customer-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return pageMetadata({ locale, title: t("orders.title"), description: t("orders.lead"), hrefs: sameRoute("/account/orders"), noindex: true });
}

export default async function OrdersPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return (
    <>
      <PageAlternates hrefs={sameRoute("/account/orders")} />
      <AccountShell locale={locale} active="orders" title={t("orders.title")}>
        <p className="lh-account__lead">{t("orders.lead")}</p>
        <Suspense fallback={<ul className="lh-orders" aria-hidden="true">{[0, 1].map((i) => <li className="lh-order" key={i}><span className="lh-skel" style={{ height: 44, width: 150 }} /><span className="lh-skel lh-skel--title" /></li>)}</ul>}>
          <Orders locale={locale} />
        </Suspense>
      </AccountShell>
    </>
  );
}

async function Orders({ locale }: { locale: Locale }) {
  const path = accountPath("/account/orders", locale);
  await requireSession(locale, path);
  const orders = await withSession(locale, path, () => getOrders(25));
  return <OrderList orders={orders} locale={locale} />;
}
