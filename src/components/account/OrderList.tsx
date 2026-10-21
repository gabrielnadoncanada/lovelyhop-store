import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/format";
import { orderNumber } from "@/lib/account";
import type { OrderSummary } from "@/lib/shopify/customer-data";
import type { Locale } from "@/lib/types";

type T = Awaited<ReturnType<typeof getTranslations<"account">>>;

/** Libellé d'un statut Shopify, ou la valeur brute si on ne la connaît pas. */
export const statusLabel = (t: T, kind: "financial" | "fulfillment", value: string | null) =>
  value ? (t.has(`status.${kind}.${value}`) ? t(`status.${kind}.${value}`) : value.toLowerCase().replace(/_/g, " ")) : null;

export const statusTone = (fulfillment: string, financial: string | null) =>
  fulfillment === "FULFILLED" ? "ok" : financial === "REFUNDED" || financial === "VOIDED" || fulfillment === "RESTOCKED" ? "off" : "wait";

/** Liste de commandes (aperçu et page Commandes). */
export async function OrderList({ orders, locale }: { orders: OrderSummary[]; locale: Locale }) {
  const t = await getTranslations("account");
  const format = await getFormatter();
  if (orders.length === 0) return <p className="lh-account__empty">{t("orders.empty")}</p>;
  return (
    <ul className="lh-orders">
      {orders.map((o) => {
        const count = o.lineItems.nodes.reduce((n, l) => n + l.quantity, 0);
        return (
          <li className="lh-order" key={o.id}>
            <div className="lh-order__thumbs" aria-hidden="true">
              {o.lineItems.nodes.slice(0, 3).map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <span key={i}>{l.image && <img src={l.image.url} alt="" loading="lazy" />}</span>
              ))}
            </div>
            <div className="lh-order__body">
              <span className={`lh-order__status lh-order__status--${statusTone(o.fulfillmentStatus, o.financialStatus)}`}>{statusLabel(t, "fulfillment", o.fulfillmentStatus)}</span>
              <h3 className="lh-order__name"><Link href={{ pathname: "/account/orders/[id]", params: { id: orderNumber(o.id) } }}>{t("order.title", { name: o.name })}</Link></h3>
              <p className="lh-order__meta">{t("orders.orderedOn", { date: format.dateTime(new Date(o.processedAt), { dateStyle: "long" }) })} · {t("orders.items", { count })}</p>
            </div>
            <div className="lh-order__total">{formatMoney(o.totalPrice, locale)}</div>
          </li>
        );
      })}
    </ul>
  );
}
