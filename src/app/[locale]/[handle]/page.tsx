import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollection, getProduct, getProducts, getCatalogIndex } from "@/lib/catalog";
import { UNIVERS_HANDLES } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import type { Locale, Product } from "@/lib/types";
import { PageAlternates } from "@/components/seo/PageAlternates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Crumbs, crumbsForSchema, type CrumbItem } from "@/components/seo/Crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumb, faq, graph, product as productNode, webPage } from "@/lib/seo/schema";
import { absoluteUrl, type LocalizedHref } from "@/lib/seo/urls";
import { PageTop } from "@/components/layout/PageTop";
import { Gallery } from "@/components/product/Gallery";
import { BuyBar, BuyBox, PurchaseProvider } from "@/components/product/Purchase";
import { TrackProductView } from "@/components/layout/Analytics";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductArt } from "@/components/art/byKey";
import { ArtCroissance, ArtDimensions, ArtPetiteTable, ArtTableDeJeu, TablePlateaux } from "@/components/art";
import { Icon } from "@/components/ui/icons";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { articlesForProduct } from "@/lib/blog";
import { toCard } from "@/lib/blog-cards";

export async function generateStaticParams() {
  const locale = (await rootParams.locale()) as Locale;
  const { products } = await getCatalogIndex();
  return products.flatMap((p) => (p.handles[locale] ? [{ handle: p.handles[locale]! }] : []));
}

const productHrefs = (p: Product): LocalizedHref => ({
  fr: p.handles.fr ? { pathname: "/[handle]", params: { handle: p.handles.fr } } : undefined,
  en: p.handles.en ? { pathname: "/[handle]", params: { handle: p.handles.en } } : undefined,
});

export async function generateMetadata({ params }: PageProps<"/[locale]/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const product = await getProduct(handle, locale);
  if (!product) return {};
  const suffix = locale === "fr" ? " en contreplaqué" : " in plywood";
  const img = product.images[0];
  return pageMetadata({
    locale,
    title: product.seo.title ?? product.title + suffix,
    description: product.seo.description ?? product.description,
    hrefs: productHrefs(product),
    image: img ? { url: img.url, width: img.width, height: img.height, alt: img.altText ?? product.title } : null,
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/[handle]">) {
  const { handle } = await params;
  const locale = (await getLocale()) as Locale;
  const product = await getProduct(handle, locale);
  if (!product) notFound();
  const t = await getTranslations("product");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const tg = await getTranslations("home");
  const d = product.details;

  const univers = product.univers && product.univers !== "cpe" ? product.univers : product.univers === "cpe" ? "cpe" : null;
  const [addons, extras, collection] = await Promise.all([
    getProducts(d?.addons ?? [], locale),
    getProducts(d?.extras ?? [], locale),
    univers ? getCollection(UNIVERS_HANDLES[univers][locale], locale) : Promise.resolve(null),
  ]);
  const guides = articlesForProduct(product.handle, locale).slice(0, 3);
  const tb = await getTranslations("blog");
  const related = (collection?.products ?? []).filter((p) => p.handle !== product.handle).slice(0, 3);
  const eyebrow = [univers ? tn(`univers.${univers}`) : null, product.age.split("·").pop()?.trim()].filter(Boolean).join(" · ");
  const colHref = univers ? { pathname: "/collections/[handle]" as const, params: { handle: UNIVERS_HANDLES[univers][locale] } } : null;

  const hrefs = productHrefs(product);
  const url = absoluteUrl({ pathname: "/[handle]", params: { handle: product.handle } }, locale);
  const crumbs: CrumbItem[] = [
    { name: t("crumbsHome"), href: "/" },
    { name: tn("universIndex"), href: "/collections" },
    ...(colHref && collection ? [{ name: collection.title, href: colHref }] : []),
    { name: product.title },
  ];
  const jsonLd = graph(
    webPage({ url, name: product.title, description: product.seo.description ?? product.description, locale, type: "ItemPage", breadcrumb: true, primaryImage: product.images[0]?.url }),
    breadcrumb(url, crumbsForSchema(crumbs, locale)),
    productNode(product, url, { locale, category: collection?.title }),
    faq(url, d?.faq ?? []),
  );

  return (
    <>
      <PageAlternates hrefs={hrefs} />
      <JsonLd data={jsonLd} />
      <PageTop />
      <main id="contenu" className="lh-pdp">
        <Crumbs items={crumbs} />
        <TrackProductView handle={product.handle} title={product.title} univers={product.univers} price={product.minPrice?.amount ?? null} />

        <PurchaseProvider product={product} addons={addons}>
          <section className="lh-pdp__main" aria-label={product.title}>
            <Gallery product={product} />
            <BuyBox eyebrow={eyebrow} />
          </section>

          {d?.uses && (
            <section className="lh-sec" id="usages">
              <div className="lh-head">
                <span className="lh-eyebrow">{t("usesEyebrow")}</span>
                <h2 className="lh-title">{t("usesTitle")} <em>{t("usesEm")}</em></h2>
                <p>{t("usesText")}</p>
              </div>
              <div className="lh-uses">
                {d.uses.map((u, i) => (
                  <article className="lh-use" key={u.title}>
                    <div className={`lh-use__media ${["lh-bg-sage", "lh-bg-sand", "lh-bg-blush"][i % 3]}`}>
                      <span className="lh-use__num">0{i + 1}</span>
                      {i === 0 && <TablePlateaux plateau="bacs" viewBox="10 80 380 185" />}
                      {i === 1 && <ArtTableDeJeu viewBox="10 80 380 185" />}
                      {i === 2 && <ArtPetiteTable />}
                    </div>
                    <span className="lh-use__how"><Icon name={(["bins", "flip", "down"] as const)[i % 3]} />{u.how}</span>
                    <h3>{u.title}</h3>
                    <p>{u.text}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {d?.steps && (
            <section className="lh-sec">
              <div className="lh-grow">
                <span className="lh-hand" aria-hidden="true">{t("growHand")}</span>
                <div className="lh-head">
                  <span className="lh-eyebrow">{t("growEyebrow")}</span>
                  <h2 className="lh-title">{t("growTitle")} <em>{t("growEm")}</em></h2>
                </div>
                <ArtCroissance />
                <ol className="lh-steps">
                  {d.steps.map((s) => (
                    <li className="lh-step" key={s.age}><span className="lh-step__age">{s.age}</span><h3>{s.title}</h3><p>{s.text}</p><span className="lh-step__kit">{s.kit}</span></li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {d?.sections && (
            <section className="lh-sec" id="details">
              <div className="lh-detail">
                {d.dimensions ? (
                  <figure className="lh-dims" style={{ margin: 0 }}>
                    <ArtDimensions label={t("dimsLabel", { w: d.dimensions.width, h: d.dimensions.height })} width={d.dimensions.width} height={d.dimensions.height} notches={t("notches")} />
                    <figcaption className="lh-dims__cap">{d.dimensions.caption}</figcaption>
                  </figure>
                ) : <div />}
                <div>
                  <div className="lh-head">
                    <span className="lh-eyebrow">{t("detailEyebrow")}</span>
                    <h2 className="lh-title">{t("detailTitle")} <em>{t("detailEm")}</em></h2>
                  </div>
                  <div className="lh-acc">
                    {d.sections.map((s, i) => (
                      <details key={s.title} open={i === 0}>
                        <summary>{s.title}<span className="lh-acc__plus" aria-hidden="true" /></summary>
                        <div className="lh-acc__body">
                          {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                          {s.list && <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
                          {s.specs && <dl className="lh-specs">{s.specs.map((sp) => <div key={sp.label} style={{ display: "contents" }}><dt>{sp.label}</dt><dd>{sp.value}</dd></div>)}</dl>}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {extras.length > 0 && (
            <section className="lh-sec" id="accessoires">
              <div className="lh-section__head">
                <div><span className="lh-eyebrow">{t("extrasEyebrow")}</span><h2 className="lh-title">{t("extrasTitle")} <em>{t("extrasEm")}</em></h2></div>
              </div>
              <div className="lh-minis">
                {extras.map((x, i) => (
                  <article className="lh-mini" key={x.handle}>
                    <div className={`lh-mini__media ${["lh-bg-blush", "lh-bg-sand", "lh-bg-sage", "lh-bg-blush"][i % 4]}`}><ProductArt art={x.art} /></div>
                    <div className="lh-mini__body">
                      <h3>{x.title}</h3>
                      <p>{x.description}</p>
                      <div className="lh-mini__foot">
                        <span className="lh-price"><span className="lh-price__now">{formatMoney(x.minPrice, locale)}</span></span>
                        <AddToCartButton className="lh-btn lh-btn--secondary lh-btn--sm" variantId={x.variants[0]?.id ?? null} name={x.title} art={x.art} label={t("addLabel", { name: x.title })} icon />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {d?.faq && (
            <section className="lh-sec" id="faq">
              <div className="lh-faq">
                <div className="lh-faq__aside">
                  <span className="lh-eyebrow">{t("faqEyebrow")}</span>
                  <h2 className="lh-title">{t("faqTitle")} <em>{t("faqEm")}</em></h2>
                  <p>{t("faqText")}</p>
                  <Link className="lh-btn lh-btn--secondary" href="/daycares">{t("faqCta")}</Link>
                </div>
                <div className="lh-acc">
                  {d.faq.map((f) => (
                    <details key={f.q}><summary>{f.q}<span className="lh-acc__plus" aria-hidden="true" /></summary><div className="lh-acc__body"><p>{f.a}</p></div></details>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="lh-pro" id="soumission" aria-labelledby="pdp-pro">
            <div>
              <span className="lh-eyebrow">{t("proEyebrow")}</span>
              <h2 className="lh-pro__title" id="pdp-pro">{t("proTitle")} <em>{t("proEm")}</em></h2>
              <p>{t("proText")}</p>
              <div className="lh-pro__ctas">
                <Link className="lh-btn lh-btn--primary lh-btn--lg" href="/daycares">{tg("proCta")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></Link>
              </div>
              <div className="lh-pro__perks">{(tg.raw("perks") as string[]).map((p) => <span key={p}><Icon name="check" />{p}</span>)}</div>
            </div>
            <ol className="lh-pro__steps">
              {(t.raw("proSteps") as [string, string][]).map(([s, x]) => <li key={s}><span><strong>{s}</strong><span>{x}</span></span></li>)}
            </ol>
          </section>

          {guides.length > 0 && (
            <section className="lh-sec" id="guides">
              <div className="lh-section__head">
                <div><span className="lh-eyebrow">{t("guidesEyebrow")}</span><h2 className="lh-title">{t("guidesTitle")} <em>{t("guidesEm")}</em></h2></div>
                <Link className="lh-link" href="/blog">{tb("all")}<Icon name="arrow" /></Link>
              </div>
              <div className="lh-guides">
                {guides.map((g) => <ArticleCard key={g.handle} a={toCard(g, (n) => tb("readingTime", { minutes: n }))} />)}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="lh-sec lh-related" id="produits">
              <div className="lh-section__head">
                <div><span className="lh-eyebrow">{t("relatedEyebrow")}</span><h2 className="lh-title">{t("relatedTitle")} <em>{t("relatedEm")}</em></h2></div>
                {colHref && <Link className="lh-link" href={colHref}>{tc("seeAll")}<Icon name="arrow" /></Link>}
              </div>
              <div className="lh-grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            </section>
          )}

          <BuyBar />
          <div className="lh-buybar-spacer" />
        </PurchaseProvider>
      </main>
    </>
  );
}

