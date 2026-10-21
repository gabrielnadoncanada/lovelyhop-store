import type { Metadata } from "next";
import { Suspense } from "react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { pageMetadata } from "@/lib/seo/metadata";
import { sameRoute } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { Icon } from "@/components/ui/icons";
import { AccountShell } from "@/components/account/AccountShell";
import { statusLabel, statusTone } from "@/components/account/OrderList";
import { accountPath, orderGid, requireSession, withSession } from "@/lib/account";
import { getOrder } from "@/lib/shopify/customer-data";
import { formatMoney } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("account");
  return pageMetadata({ locale, title: t("nav.orders"), description: t("orders.lead"), hrefs: sameRoute("/account/orders"), noindex: true });
}

/** Détail d'une commande. Le numéro vient de l'adresse : tout ce qui en dépend est rendu dans le Suspense. */
export default async function OrderPage({ params }: PageProps<"/[locale]/account/orders/[id]">) {
  const locale = (await getLocale()) as Locale;
  return (
    <Suspense fallback={<><PageTop /><main id="contenu"><div className="lh-account"><div /><div className="lh-account__main"><span className="lh-skel lh-skel--title" /><span className="lh-skel lh-skel--text" style={{ marginTop: 16, width: "50%" }} /></div></div></main></>}>
      <OrderView locale={locale} params={params} />
    </Suspense>
  );
}

async function OrderView({ locale, params }: { locale: Locale; params: PageProps<"/[locale]/account/orders/[id]">["params"] }) {
  const { id } = await params;
  const t = await getTranslations("account");
  const tp = await getTranslations("product");
  const format = await getFormatter();
  const crumbs = [{ name: tp("crumbsHome"), href: "/" as const }, { name: t("title"), href: "/account" as const }, { name: t("nav.orders"), href: "/account/orders" as const }, { name: `#${id}` }];
  const path = accountPath("/account/orders", locale) + `/${id}`;
  await requireSession(locale, path);
  const o = await withSession(locale, path, () => getOrder(orderGid(id)));
  const date = (d: string) => format.dateTime(new Date(d), { dateStyle: "long" });
  const money = (m: { amount: string; currencyCode: string } | null) => (m ? formatMoney(m, locale) : "—");

  return (
    <AccountShell locale={locale} active="orders" title={t("order.title", { name: o?.name ?? `#${id}` })} crumbs={crumbs}>
      {!o ? (
        <div className="lh-notice lh-notice--warning" role="status"><span className="lh-notice__icon"><Icon name="error" /></span><div>{t("order.notFound")} <Link className="lh-link" href="/account/orders">{t("order.back")}</Link></div></div>
      ) : (
        <div className="lh-order-detail">
          <div className="lh-order-detail__top">
            <div>
              <span className={`lh-order__status lh-order__status--${statusTone(o.fulfillmentStatus, o.financialStatus)}`}>{statusLabel(t, "fulfillment", o.fulfillmentStatus)}</span>
              {o.financialStatus && <span className="lh-order__status">{statusLabel(t, "financial", o.financialStatus)}</span>}
              <p className="lh-order__meta">{o.cancelledAt ? t("order.cancelled", { date: date(o.cancelledAt) }) : t("order.placed", { date: date(o.processedAt) })}</p>
            </div>
            <a className="lh-link" href={o.statusPageUrl} target="_blank" rel="noopener">{t("orders.statusPage")}<Icon name="arrow" /></a>
          </div>

          {o.fulfillments.nodes.some((f) => f.trackingInformation.length || f.estimatedDeliveryAt) && (
            <section className="lh-account__card">
              <h2>{t("order.fulfillment")}</h2>
              {o.fulfillments.nodes.map((f, i) => (
                <p key={i}>
                  {f.estimatedDeliveryAt && <>{t("order.eta", { date: date(f.estimatedDeliveryAt) })}<br /></>}
                  {f.trackingInformation.map((tr, j) => (
                    <span key={j}>{tr.url ? <a className="lh-link" href={tr.url} target="_blank" rel="noopener">{t("order.tracking", { company: tr.company ?? "", number: tr.number ?? "" })}</a> : t("order.tracking", { company: tr.company ?? "", number: tr.number ?? "" })}<br /></span>
                  ))}
                </p>
              ))}
            </section>
          )}

          <section className="lh-account__section">
            <h2>{t("order.items")}</h2>
            <ul className="lh-order-lines">
              {o.lineItems.nodes.map((l) => (
                <li key={l.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="lh-order-lines__thumb">{l.image && <img src={l.image.url} alt={l.image.altText ?? l.title} loading="lazy" />}</span>
                  <div><strong>{l.title}</strong>{l.variantTitle && l.variantTitle !== "Default Title" && <span>{l.variantTitle}</span>}<span>{l.quantity} × {money(l.price)}</span></div>
                  <b>{money(l.totalPrice)}</b>
                </li>
              ))}
            </ul>
            <dl className="lh-order-totals">
              <dt>{t("order.subtotal")}</dt><dd>{money(o.subtotal)}</dd>
              <dt>{t("order.shipping")}</dt><dd>{money(o.totalShipping)}</dd>
              <dt>{t("order.tax")}</dt><dd>{money(o.totalTax)}</dd>
              <dt className="is-total">{t("order.total")}</dt><dd className="is-total">{money(o.totalPrice)}</dd>
            </dl>
          </section>

          <div className="lh-account__cards">
            {o.shippingAddress && <section className="lh-account__card"><h2>{t("order.shippingAddress")}</h2><address>{o.shippingAddress.formatted.map((l, i) => <span key={i}>{l}</span>)}</address></section>}
            {o.billingAddress && <section className="lh-account__card"><h2>{t("order.billingAddress")}</h2><address>{o.billingAddress.formatted.map((l, i) => <span key={i}>{l}</span>)}</address></section>}
          </div>
          <p><Link className="lh-link" href="/account/orders"><Icon name="arrow" />{t("order.back")}</Link></p>
        </div>
      )}
    </AccountShell>
  );
}
