import { getTranslations } from "next-intl/server";
import { SiteHeader } from "./SiteHeader";
import { Heart } from "@/components/ui/icons";

/** Bandeau + en-tête pour les pages sans hero (le hero de l'accueil intègre l'en-tête). */
export async function Announce() {
  const t = await getTranslations();
  return <div className="lh-announce"><Heart />{t("announce")}<Heart /></div>;
}

export async function PageTop() {
  return (
    <>
      <Announce />
      <div className="lh-hero lh-hero--bar"><SiteHeader /></div>
    </>
  );
}
