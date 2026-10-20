import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ConsentLink } from "./ConsentLink";
import { HEART_PATH } from "@/components/ui/icons";
import { UNIVERS_HANDLES } from "@/lib/constants";
import type { Locale } from "@/lib/types";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const locale = (await getLocale()) as Locale;
  const col = (u: keyof typeof UNIVERS_HANDLES) => ({ pathname: "/collections/[handle]" as const, params: { handle: UNIVERS_HANDLES[u][locale] } });
  return (
    <footer className="lh-footer">
      <div className="lh-footer__top">
        <div className="lh-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lovelyhop-logo-creme.svg" alt="Lovelyhop" width={212} height={56} />
          <p>{t("brand")}</p>
        </div>
        <div>
          <h3>{t("univers")}</h3>
          <ul>
            <li><Link href={col("creer")}>{tn("univers.creer")}</Link></li>
            <li><Link href={col("imaginer")}>{tn("univers.imaginer")}</Link></li>
            <li><Link href={col("ranger")}>{tn("univers.ranger")}</Link></li>
            <li><Link href={col("bouger")}>{tn("univers.bouger")} ({locale === "fr" ? "bientôt" : "soon"})</Link></li>
          </ul>
        </div>
        <div>
          <h3>{t("pro")}</h3>
          <ul>
            <li><Link href={col("cpe")}>{t("proFurniture")}</Link></li>
            <li><Link href="/daycares">{t("quote")}</Link></li>
            <li><Link href="/daycares">{t("contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h3>{t("help")}</h3>
          <ul>
            <li><a href="#">{t("shipping")}</a></li>
            <li><a href="#">{t("faq")}</a></li>
            <li><ConsentLink>{t("cookies")}</ConsentLink></li>
          </ul>
        </div>
      </div>
      <div className="lh-footer__bottom">
        <span>© 2026 Lovelyhop · <a href="#">{t("privacy")}</a> · <a href="#">{t("terms")}</a></span>
        <span className="lh-footer__made">{t("made")} <svg viewBox="0 0 34 30" role="img" aria-label={t("love")}><path d={HEART_PATH} /></svg> {t("madeEnd")}</span>
      </div>
    </footer>
  );
}
