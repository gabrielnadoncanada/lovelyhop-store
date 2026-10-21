import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icons";
import { PageTop } from "@/components/layout/PageTop";
import { Crumbs, type CrumbItem } from "@/components/seo/Crumbs";
import type { Locale } from "@/lib/types";

export type AccountSection = "overview" | "orders" | "addresses" | "profile";

const NAV: { key: AccountSection; pathname: "/account" | "/account/orders" | "/account/addresses" | "/account/profile"; icon: "home" | "bag" | "pin" | "user" }[] = [
  { key: "overview", pathname: "/account", icon: "home" },
  { key: "orders", pathname: "/account/orders", icon: "bag" },
  { key: "addresses", pathname: "/account/addresses", icon: "pin" },
  { key: "profile", pathname: "/account/profile", icon: "user" },
];

/** Gabarit des pages du compte : fil d'Ariane, navigation latérale, contenu. */
export async function AccountShell({ locale, active, title, crumbs, children }: { locale: Locale; active: AccountSection; title: ReactNode; crumbs?: CrumbItem[]; children: ReactNode }) {
  const t = await getTranslations("account");
  const tp = await getTranslations("product");
  const items: CrumbItem[] = crumbs ?? [{ name: tp("crumbsHome"), href: "/" }, ...(active === "overview" ? [{ name: t("title") }] : [{ name: t("title"), href: "/account" as const }, { name: t(`nav.${active}`) }])];
  const home = locale === "fr" ? "/" : "/en";
  return (
    <>
      <PageTop />
      <main id="contenu">
        <div className="lh-account">
          <aside className="lh-account__side">
            <nav className="lh-account__nav" aria-label={t("title")}>
              {NAV.map((n) => (
                <Link key={n.key} href={n.pathname} aria-current={n.key === active ? "page" : undefined}><Icon name={n.icon} />{t(`nav.${n.key}`)}</Link>
              ))}
              <a href={`/api/auth/logout?return=${encodeURIComponent(home)}`} className="lh-account__logout"><Icon name="close" />{t("nav.logout")}</a>
            </nav>
          </aside>
          <div className="lh-account__main">
            <div className="lh-head lh-account__head">
              <Crumbs items={items} />
              <h1 className="lh-title">{title}</h1>
            </div>
            {children}
          </div>
        </div>
        <div style={{ height: 96 }} />
      </main>
    </>
  );
}
