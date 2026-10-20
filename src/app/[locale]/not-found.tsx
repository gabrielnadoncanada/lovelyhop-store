import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageTop } from "@/components/layout/PageTop";
import { ArtTableSensorielle } from "@/components/art";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <>
      <PageTop />
      <main id="contenu">
        <div className="lh-empty" style={{ padding: "96px 20px" }}>
          <div className="lh-empty__art" style={{ display: "grid", placeItems: "end center", width: 240, margin: "0 auto" }}><ArtTableSensorielle /></div>
          <h1 className="lh-empty__title">{t("title")}</h1>
          <p>{t("text")}</p>
          <Link className="lh-btn lh-btn--primary" href="/">{t("cta")}</Link>
        </div>
      </main>
    </>
  );
}
