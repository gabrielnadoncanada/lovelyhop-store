import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icons";
import type { Href } from "@/lib/seo/urls";
import { absoluteUrl } from "@/lib/seo/urls";
import type { Crumb } from "@/lib/seo/schema";
import type { Locale } from "@/lib/types";

export type CrumbItem = { name: string; href?: Href };

/** Fil d'Ariane visible (composant Breadcrumbs du design system). Le dernier élément est la page courante. */
export async function Crumbs({ items }: { items: CrumbItem[] }) {
  const locale = (await getLocale()) as Locale;
  return (
    <nav className="lh-crumbs-bar" aria-label={locale === "fr" ? "Fil d'Ariane" : "Breadcrumb"}>
      <ol className="lh-crumbs">
        {items.map((c, i) =>
          i < items.length - 1 && c.href ? (
            <li key={c.name}><Link href={c.href}>{c.name}</Link><Icon name="chevRight" /></li>
          ) : (
            <li key={c.name}><span aria-current={i === items.length - 1 ? "page" : undefined}>{c.name}</span>{i < items.length - 1 && <Icon name="chevRight" />}</li>
          ),
        )}
      </ol>
    </nav>
  );
}

/** Les mêmes éléments, pour le BreadcrumbList du JSON-LD (une seule source pour le visible et le structuré). */
export function crumbsForSchema(items: CrumbItem[], locale: Locale): Crumb[] {
  return items.map((c) => ({ name: c.name, url: c.href ? absoluteUrl(c.href, locale) : undefined }));
}
