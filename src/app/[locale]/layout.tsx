import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/Toast";
import { AlternatesProvider } from "@/components/layout/Alternates";
import { Consent } from "@/components/layout/Consent";
import { Analytics } from "@/components/layout/Analytics";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { SITE_URL } from "@/lib/constants";
import "../globals.css";
import "@/styles/blog.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: "%s | Lovelyhop" },
    description: t("description"),
    openGraph: { siteName: "Lovelyhop", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#f5eee3" };

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");
  return (
    <html lang={locale === "fr" ? "fr-CA" : "en-CA"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AlternatesProvider>
            <CartProvider>
              <a className="lh-skip" href="#contenu">{t("skip")}</a>
              <div className="lh lh-page">
                {children}
                <SiteFooter />
              </div>
              <CartDrawer />
              <CartToast />
              <Consent />
              <Analytics />
              {!isShopifyConfigured && <span className="lh-demo-flag" title="SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN">{t("demo")}</span>}
            </CartProvider>
          </AlternatesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
