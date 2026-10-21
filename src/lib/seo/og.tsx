import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Images Open Graph (aperçu Facebook, iMessage, Slack, LinkedIn…), aux couleurs du design system :
 * fond lin, titre Fraunces encre, dernier mot en italique terre cuite, logo et cœur.
 * Les polices sont copiées dans /assets/og (WOFF : le moteur de rendu ne lit pas le WOFF2).
 */
export const OG_SIZE = { width: 1200, height: 630 };

const C = { lin: "#f5eee3", linDeep: "#ebe0cf", ink: "#2b2019", muted: "#6b5a4c", clay: "#a8492f", sage: "#d8dbc2", sageDeep: "#4e5838", ochre: "#d49a3c" };
const HEART = "M17 28.5C7.5 22 1.5 16.5 1.5 10a7.8 7.8 0 0 1 15.5-1.6A7.8 7.8 0 0 1 32.5 10c0 6.5-6 12-15.5 18.5Z";

const assets = (async () => {
  const [fraunces, frauncesItalic, sans, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/fraunces-latin-500-normal.woff")),
    readFile(join(process.cwd(), "assets/og/fraunces-latin-500-italic.woff")),
    readFile(join(process.cwd(), "assets/og/instrument-sans-latin-600-normal.woff")),
    readFile(join(process.cwd(), "public/brand/lovelyhop-logo.svg"), "base64"),
  ]);
  return { fraunces, frauncesItalic, sans, logo: `data:image/svg+xml;base64,${logo}` };
})();

export async function ogCard(o: { eyebrow: string; title: string; footer?: string; image?: string | null }) {
  const a = await assets;
  const i = o.title.lastIndexOf(" ");
  const head = i > 0 ? o.title.slice(0, i) : "";
  const last = i > 0 ? o.title.slice(i + 1) : o.title;
  const long = o.title.length > 48;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.lin, fontFamily: "Instrument Sans", position: "relative" }}>
        {!o.image && <div style={{ position: "absolute", right: -170, bottom: -230, width: 520, height: 520, borderRadius: 520, background: C.sage, display: "flex" }} />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 64px 56px 72px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.logo} width={246} height={76} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: C.sageDeep }}>
              <svg width="26" height="23" viewBox="0 0 34 30"><path d={HEART} fill={C.clay} /></svg>
              {o.eyebrow}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 22, fontFamily: "Fraunces", fontSize: long ? 64 : 78, lineHeight: 1.04, letterSpacing: -1.5, color: C.ink, maxWidth: o.image ? 620 : 840 }}>
              {head.split(" ").filter(Boolean).map((w, k) => <span key={k} style={{ marginRight: 18 }}>{w}</span>)}
              <span style={{ fontStyle: "italic", color: C.clay }}>{last}</span>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: C.muted }}>{o.footer ?? "Conçus au Québec · Livraison partout au Canada"}</div>
        </div>
        {o.image ? (
          <div style={{ width: 460, display: "flex", padding: "40px 40px 40px 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.image} alt="" width={420} height={550} style={{ objectFit: "cover", borderRadius: "210px 210px 28px 28px" }} />
          </div>
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: a.fraunces, style: "normal", weight: 500 },
        { name: "Fraunces", data: a.frauncesItalic, style: "italic", weight: 500 },
        { name: "Instrument Sans", data: a.sans, style: "normal", weight: 600 },
      ],
    },
  );
}
