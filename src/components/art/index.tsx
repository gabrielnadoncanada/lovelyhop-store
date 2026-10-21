/* Dessins de la marque (contreplaqué), générés depuis le design system LovelyHop.
   Classes de dessin : voir bundle.css (.lh-art .f-*, .ply, .rim, .hole…). Ne pas modifier à la main. */
import type { Plateau } from "@/lib/types";

type ArtProps = { className?: string };
const cx = (...c: (string | undefined | false)[]) => c.filter(Boolean).join(" ");

export function TablePlateaux({ plateau, label, className, viewBox = "0 0 400 260" }: ArtProps & { plateau: Plateau; label?: string; viewBox?: string }) {
  return (
    <svg className={cx("lh-art", className)} viewBox={viewBox} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
        <ellipse className="shadow" cx="200" cy="254" rx="170" ry="6" />
        <polygon className="f-wood-dark" points="96,152 112,152 108,236 92,236" /><polygon className="f-wood-dark" points="288,152 304,152 308,236 292,236" />
        <polygon className="f-wood" points="60,110 340,110 362,152 38,152" />
        <path className="hi" d="M62 111.5H338" />
        {plateau === "bacs" && (<g>
            <polygon className="rim" points="80,117 196,117 200,148 74,148" />
            <polygon className="f-ochre" points="82,124 194,124 198,148 76,148" />
            <circle className="grain-dot" cx="100" cy="138" r="1.6" /><circle className="grain-dot" cx="130" cy="130" r="1.4" /><circle className="grain-dot" cx="160" cy="142" r="1.6" /><circle className="grain-dot" cx="182" cy="132" r="1.3" />
            <polygon className="rim" points="204,117 320,117 328,148 202,148" />
            <polygon className="f-sage" points="206,124 318,124 326,148 204,148" />
            <circle className="f-lin" cx="226" cy="138" r="3" opacity=".55" /><circle className="f-lin" cx="268" cy="130" r="2.4" opacity=".5" /><circle className="f-sage-deep" cx="300" cy="138" r="2.6" />
            <ellipse className="f-wood-dark" cx="128" cy="138" rx="13" ry="5" /><rect className="f-wood-dark" x="136" y="120" width="30" height="5" rx="2.5" transform="rotate(-22 151 122)" />
            <rect className="f-blush" x="262" y="118" width="22" height="20" rx="4" />
          </g>)}
        {plateau === "art" && (<g>
            <polygon className="f-lin" points="84,115 316,115 334,148 66,148" />
            <circle className="tint-ochre" cx="130" cy="130" r="9" />
            <path className="line-ink" d="M150 138c10-12 20-12 30 0s20 12 30 0" />
            <path className="line-ink" d="M232 140l14-16 14 16Z" />
            <rect className="f-clay" x="276" y="124" width="34" height="5" rx="2.5" transform="rotate(-14 293 126)" />
            <rect className="f-sage" x="270" y="134" width="34" height="5" rx="2.5" transform="rotate(8 287 136)" />
            <rect className="f-ochre" x="96" y="118" width="18" height="16" rx="3" />
          </g>)}
        {plateau === "lumiere" && (<g>
            <ellipse className="halo" cx="200" cy="128" rx="190" ry="44" />
            <polygon className="glow-panel" points="80,116 320,116 336,148 64,148" />
            <ellipse className="tint-blush" cx="130" cy="132" rx="16" ry="7" />
            <ellipse className="tint-sage" cx="196" cy="130" rx="20" ry="7" />
            <ellipse className="tint-ochre" cx="262" cy="134" rx="14" ry="6" />
            <rect className="tint-blush" x="290" y="124" width="18" height="12" rx="2" />
          </g>)}
        <rect className="f-wood" x="38" y="152" width="324" height="18" />
        <path className="ply" d="M38 156.5H362M38 161H362M38 165.5H362" />
        <polygon className="f-wood" points="50,170 76,170 70,252 42,252" /><polygon className="f-wood" points="324,170 350,170 358,252 330,252" />
        <circle className="hole" cx="61" cy="188" r="2.6" /><circle className="hole" cx="60" cy="202" r="2.6" /><circle className="hole" cx="59" cy="216" r="2.6" />
        <circle className="hole" cx="339" cy="188" r="2.6" /><circle className="hole" cx="340" cy="202" r="2.6" /><circle className="hole" cx="341" cy="216" r="2.6" />
        <rect className="f-wood" x="70" y="206" width="260" height="12" rx="2" /><path className="ply" d="M70 210.5H330M70 214.5H330" />
      </svg>
  );
}

export function ArtTableSensorielle({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true">
            <ellipse className="shadow" cx="100" cy="143" rx="80" ry="4" />
            <polygon className="f-wood-dark" points="54,86 62,86 60,128 52,128" /><polygon className="f-wood-dark" points="138,86 146,86 148,128 140,128" />
            <polygon className="f-wood" points="34,64 166,64 176,86 24,86" />
            <polygon className="rim" points="44,67 98,67 100,83 40,83" /><polygon className="f-ochre" points="45,71 97,71 99,83 41,83" />
            <polygon className="rim" points="104,67 156,67 160,83 102,83" /><polygon className="f-sage" points="105,71 155,71 159,83 103,83" />
            <rect className="f-wood" x="24" y="86" width="152" height="9" /><path className="ply" d="M24 89.5H176M24 92.5H176" />
            <polygon className="f-wood" points="30,95 44,95 41,142 25,142" /><polygon className="f-wood" points="156,95 170,95 175,142 159,142" />
            <rect className="f-wood" x="40" y="118" width="120" height="7" rx="1" />
          </svg>
  );
}

export function ArtTableLumineuse({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 220 160" aria-hidden="true">
            <ellipse className="shadow" cx="110" cy="150" rx="94" ry="4" />
            <ellipse className="halo" cx="110" cy="70" rx="100" ry="30" />
            <polygon className="f-wood" points="24,64 196,64 206,88 14,88" />
            <polygon className="glow-panel" points="34,68 186,68 193,84 27,84" />
            <ellipse className="tint-blush" cx="70" cy="76" rx="12" ry="5" />
            <ellipse className="tint-sage" cx="112" cy="76" rx="15" ry="5" />
            <ellipse className="tint-ochre" cx="152" cy="77" rx="10" ry="4.5" />
            <rect className="f-wood" x="14" y="88" width="192" height="10" /><path className="ply" d="M14 91.5H206M14 94.5H206" />
            <polygon className="f-wood" points="22,98 36,98 34,148 20,148" /><polygon className="f-wood" points="184,98 198,98 200,148 186,148" />
            <rect className="f-wood-dark" x="36" y="122" width="148" height="6" rx="1" />
          </svg>
  );
}

export function ArtPanneauActivites({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 220 160" aria-hidden="true">
            <ellipse className="shadow" cx="110" cy="152" rx="70" ry="4" />
            <polygon className="f-wood-dark" points="60,140 160,140 170,150 50,150" />
            <rect className="f-wood" x="30" y="12" width="160" height="128" rx="12" />
            <rect className="ply" x="35" y="17" width="150" height="118" rx="9" />
            <rect className="f-wood-dark" x="48" y="32" width="38" height="11" rx="3" /><circle className="f-lin" cx="80" cy="37.5" r="3" />
            <circle className="f-clay" cx="152" cy="40" r="11" /><circle className="hi-fill" cx="148" cy="36" r="3" />
            <circle className="f-ochre" cx="152" cy="72" r="11" /><circle className="hi-fill" cx="148" cy="68" r="3" />
            <path className="line-ink" d="M46 70c12-10 22 10 34 0s22 10 34 0" />
            <circle className="f-sage" cx="58" cy="66" r="6" /><circle className="f-blush" cx="86" cy="70" r="6" /><circle className="f-ochre" cx="104" cy="66" r="6" />
            <circle className="f-sage-deep" cx="70" cy="108" r="15" /><circle className="f-lin" cx="70" cy="108" r="5" />
            <rect className="f-blush" x="104" y="98" width="46" height="22" rx="11" /><circle className="f-lin" cx="138" cy="109" r="8" />
            <circle className="hole" cx="40" cy="22" r="2" /><circle className="hole" cx="180" cy="22" r="2" /><circle className="hole" cx="40" cy="130" r="2" /><circle className="hole" cx="180" cy="130" r="2" />
          </svg>
  );
}

export function ArtTableArt({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 220 160" aria-hidden="true">
            <ellipse className="shadow" cx="110" cy="150" rx="94" ry="4" />
            <rect className="f-wood-dark" x="30" y="18" width="8" height="44" rx="2" /><rect className="f-wood-dark" x="182" y="18" width="8" height="44" rx="2" />
            <rect className="f-lin" x="34" y="20" width="152" height="14" rx="7" />
            <polygon className="f-lin" points="62,34 158,34 158,58 62,58" />
            <circle className="tint-ochre" cx="88" cy="46" r="6" />
            <path className="line-ink" d="M104 50c6-8 12-8 18 0s12 8 18 0" />
            <polygon className="f-wood" points="28,58 192,58 200,70 20,70" />
            <rect className="f-clay" x="150" y="44" width="13" height="15" rx="2" /><path className="line-ink" d="M154 44l-2-8M159 44l2-9" />
            <rect className="f-wood" x="20" y="70" width="180" height="10" /><path className="ply" d="M20 73.5H200M20 76.5H200" />
            <rect className="f-wood" x="30" y="80" width="160" height="52" />
            <rect className="f-sage" x="38" y="90" width="44" height="36" rx="4" /><rect className="f-blush" x="88" y="90" width="44" height="36" rx="4" /><rect className="f-ochre" x="138" y="90" width="44" height="36" rx="4" />
            <rect className="hi-fill" x="42" y="93" width="36" height="3" rx="1.5" /><rect className="hi-fill" x="92" y="93" width="36" height="3" rx="1.5" /><rect className="hi-fill" x="142" y="93" width="36" height="3" rx="1.5" />
            <rect className="f-wood-dark" x="22" y="80" width="10" height="68" rx="2" /><rect className="f-wood-dark" x="188" y="80" width="10" height="68" rx="2" />
          </svg>
  );
}

export function ArtUniversCreer({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true">
          <ellipse className="shadow" cx="100" cy="143" rx="80" ry="4" />
          <polygon className="f-wood-dark" points="54,86 62,86 60,128 52,128" /><polygon className="f-wood-dark" points="138,86 146,86 148,128 140,128" />
          <polygon className="f-wood" points="34,64 166,64 176,86 24,86" />
          <polygon className="rim" points="44,67 98,67 100,83 40,83" /><polygon className="f-ochre" points="45,71 97,71 99,83 41,83" />
          <polygon className="rim" points="104,67 156,67 160,83 102,83" /><polygon className="f-sage" points="105,71 155,71 159,83 103,83" />
          <rect className="f-wood" x="24" y="86" width="152" height="9" /><path className="ply" d="M24 89.5H176M24 92.5H176" />
          <polygon className="f-wood" points="30,95 44,95 41,142 25,142" /><polygon className="f-wood" points="156,95 170,95 175,142 159,142" />
          <rect className="f-wood" x="40" y="118" width="120" height="7" rx="1" />
        </svg>
  );
}

export function ArtUniversImaginer({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true">
          <ellipse className="shadow" cx="100" cy="143" rx="72" ry="4" />
          <polygon className="f-wood-dark" points="30,60 100,8 170,60" />
          <polygon className="f-blush" points="48,58 100,20 152,58" />
          <circle className="f-lin" cx="100" cy="44" r="7" />
          <rect className="f-wood" x="40" y="58" width="120" height="84" />
          <rect className="f-lin" x="48" y="64" width="48" height="34" rx="2" opacity=".55" />
          <rect className="f-lin" x="104" y="64" width="48" height="34" rx="2" opacity=".55" />
          <rect className="f-wood-dark" x="40" y="98" width="120" height="5" />
          <rect className="f-wood-dark" x="97" y="58" width="5" height="40" />
          <rect className="f-blush" x="54" y="86" width="34" height="10" rx="3" /><rect className="f-lin" x="54" y="82" width="10" height="6" rx="2" />
          <path className="f-clay" d="M122 96V84a6 6 0 0 1 12 0V96Z" /><circle className="f-wood" cx="128" cy="76" r="6" />
          <rect className="f-clay" x="50" y="108" width="9" height="32" rx="1.5" /><rect className="f-ochre" x="61" y="112" width="9" height="28" rx="1.5" /><rect className="f-sage" x="72" y="106" width="9" height="34" rx="1.5" />
          <rect className="f-sage-deep" x="83" y="114" width="9" height="26" rx="1.5" transform="rotate(12 87 140)" />
          <rect className="f-ochre" x="118" y="118" width="30" height="22" rx="3" /><rect className="hi-fill" x="121" y="120" width="24" height="3" rx="1.5" />
          <path className="ply" d="M43 60V142M157 60V142" />
        </svg>
  );
}

export function ArtUniversRanger({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true">
          <ellipse className="shadow" cx="100" cy="143" rx="72" ry="4" />
          <rect className="f-wood" x="36" y="22" width="11" height="120" rx="2" /><rect className="f-wood" x="153" y="22" width="11" height="120" rx="2" />
          <g transform="rotate(-6 70 60)"><rect className="f-clay" x="54" y="30" width="26" height="32" rx="2" /><circle className="f-lin" cx="67" cy="44" r="6" opacity=".7" /></g>
          <g transform="rotate(-5 105 60)"><rect className="f-sage" x="88" y="26" width="28" height="36" rx="2" /><rect className="f-lin" x="94" y="34" width="16" height="3" rx="1.5" opacity=".7" /></g>
          <g transform="rotate(-7 135 60)"><rect className="f-ochre" x="122" y="32" width="26" height="30" rx="2" /></g>
          <rect className="f-wood-dark" x="47" y="62" width="106" height="7" rx="1.5" />
          <g transform="rotate(-5 80 98)"><rect className="f-blush" x="56" y="70" width="30" height="28" rx="2" /><path className="line-ink" d="M62 84c4-5 10-5 14 0" /></g>
          <g transform="rotate(-6 120 98)"><rect className="f-sage-deep" x="98" y="66" width="26" height="32" rx="2" /></g>
          <g transform="rotate(-4 140 98)"><rect className="f-clay" x="128" y="72" width="20" height="26" rx="2" /></g>
          <rect className="f-wood-dark" x="47" y="98" width="106" height="7" rx="1.5" />
          <rect className="f-sage" x="54" y="110" width="42" height="30" rx="4" /><rect className="f-ochre" x="104" y="110" width="42" height="30" rx="4" />
          <rect className="hi-fill" x="58" y="113" width="34" height="3" rx="1.5" /><rect className="hi-fill" x="108" y="113" width="34" height="3" rx="1.5" />
        </svg>
  );
}

export function ArtUniversBouger({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true">
          <ellipse className="shadow" cx="100" cy="143" rx="72" ry="4" />
          <path className="rung" d="M52 118H148M63 96H137M73 74H127M84 52H116" />
          <path className="leg" d="M40 140 100 20 160 140" />
          <path className="ply" d="M44 132 98 26M156 132 102 26" />
        </svg>
  );
}

export function ArtTableGarderie({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 120 90" aria-hidden="true"><ellipse className="shadow" cx="60" cy="84" rx="54" ry="3" /><polygon className="f-wood" points="12,36 108,36 116,50 4,50" /><path className="ply" d="M60 36V50" /><rect className="f-wood" x="4" y="50" width="112" height="7" /><path className="ply" d="M4 53.5H116" /><rect className="f-wood-dark" x="10" y="57" width="7" height="26" rx="1.5" /><rect className="f-wood-dark" x="103" y="57" width="7" height="26" rx="1.5" /><rect className="f-wood-dark" x="56" y="57" width="7" height="26" rx="1.5" /></svg>
  );
}

export function ArtCasierGarderie({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 120 90" aria-hidden="true"><ellipse className="shadow" cx="60" cy="85" rx="48" ry="3" /><rect className="f-wood" x="14" y="8" width="92" height="76" rx="3" /><rect className="f-wood-dark" x="44" y="8" width="4" height="76" /><rect className="f-wood-dark" x="72" y="8" width="4" height="76" /><rect className="f-wood-dark" x="14" y="56" width="92" height="4" /><circle className="f-lin" cx="29" cy="20" r="3" /><circle className="f-lin" cx="60" cy="20" r="3" /><circle className="f-lin" cx="90" cy="20" r="3" /><rect className="f-sage" x="18" y="64" width="23" height="16" rx="2" /><rect className="f-blush" x="49" y="64" width="20" height="16" rx="2" /><rect className="f-ochre" x="79" y="64" width="23" height="16" rx="2" /></svg>
  );
}

export function ArtRangeMatelas({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 120 90" aria-hidden="true"><ellipse className="shadow" cx="60" cy="85" rx="50" ry="3" /><rect className="f-wood" x="12" y="14" width="96" height="70" rx="3" /><rect className="f-clay" x="22" y="22" width="12" height="56" rx="3" /><rect className="f-sage" x="40" y="22" width="12" height="56" rx="3" /><rect className="f-ochre" x="58" y="22" width="12" height="56" rx="3" /><rect className="f-blush" x="76" y="22" width="12" height="56" rx="3" /><circle className="hole" cx="100" cy="30" r="2.4" /><circle className="hole" cx="100" cy="42" r="2.4" /><circle className="hole" cx="100" cy="54" r="2.4" /><circle className="hole" cx="100" cy="66" r="2.4" /></svg>
  );
}

export function ArtPanneauMural({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 120 90" aria-hidden="true"><rect className="f-wood" x="14" y="10" width="92" height="70" rx="8" /><circle className="f-lin" cx="40" cy="36" r="13" opacity=".85" /><circle className="f-clay" cx="80" cy="28" r="7" /><circle className="f-ochre" cx="80" cy="50" r="7" /><path className="line-ink" d="M26 64c8-8 14 6 22 0s14 6 22 0" /><circle className="f-sage" cx="34" cy="62" r="4" /><circle className="f-blush" cx="54" cy="64" r="4" /></svg>
  );
}

export function ArtPilierChassis({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 160 120" aria-hidden="true"><ellipse className="shadow" cx="80" cy="112" rx="62" ry="3.5" /><rect className="f-wood" x="20" y="46" width="120" height="10" /><path className="ply" d="M20 49.5H140M20 52.5H140" /><polygon className="f-wood" points="26,56 38,56 35,110 22,110" /><polygon className="f-wood" points="122,56 134,56 138,110 125,110" /><rect className="f-wood-dark" x="36" y="84" width="88" height="7" rx="1" /><circle className="hole" cx="31" cy="68" r="2" /><circle className="hole" cx="30" cy="78" r="2" /><circle className="hole" cx="129" cy="68" r="2" /><circle className="hole" cx="130" cy="78" r="2" /></svg>
  );
}

export function ArtPilierPlateaux({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 160 120" aria-hidden="true"><ellipse className="shadow" cx="80" cy="112" rx="62" ry="3.5" /><polygon className="f-sage" points="44,16 126,16 136,30 34,30" /><rect className="f-wood" x="34" y="30" width="102" height="6" /><polygon className="f-lin" points="40,46 122,46 132,60 30,60" /><rect className="f-wood" x="30" y="60" width="102" height="6" /><polygon className="f-ochre" points="36,76 118,76 128,90 26,90" /><rect className="f-wood" x="26" y="90" width="102" height="6" /><path className="ply" d="M34 33H136M30 63H132M26 93H128" /></svg>
  );
}

export function ArtPilierPieces({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 160 120" aria-hidden="true"><ellipse className="shadow" cx="70" cy="112" rx="40" ry="3.5" /><polygon className="f-wood" points="58,18 80,18 76,108 54,108" /><path className="ply" d="M63 22 59 104" /><circle className="hole" cx="68" cy="40" r="3" /><circle className="hole" cx="67" cy="58" r="3" /><circle className="hole" cx="66" cy="76" r="3" /><rect className="f-wood-dark" x="104" y="52" width="32" height="9" rx="4.5" /><circle className="f-clay" cx="104" cy="56.5" r="9" /><path className="dash" d="M94 50C88 40 80 38 74 40" /></svg>
  );
}

export function ArtGuideBac({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="143" rx="80" ry="4" /><polygon className="f-wood" points="34,64 166,64 176,86 24,86" /><polygon className="rim" points="44,67 98,67 100,83 40,83" /><polygon className="f-ochre" points="45,71 97,71 99,83 41,83" /><polygon className="rim" points="104,67 156,67 160,83 102,83" /><polygon className="f-sage" points="105,71 155,71 159,83 103,83" /><rect className="f-wood" x="24" y="86" width="152" height="9" /><path className="ply" d="M24 89.5H176M24 92.5H176" /><polygon className="f-wood" points="30,95 44,95 41,142 25,142" /><polygon className="f-wood" points="156,95 170,95 175,142 159,142" /><rect className="f-wood" x="40" y="118" width="120" height="7" rx="1" /></svg>
  );
}

export function ArtGuideLumiere({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 220 160" aria-hidden="true"><ellipse className="shadow" cx="110" cy="150" rx="94" ry="4" /><ellipse className="halo" cx="110" cy="70" rx="100" ry="30" /><polygon className="f-wood" points="24,64 196,64 206,88 14,88" /><polygon className="glow-panel" points="34,68 186,68 193,84 27,84" /><ellipse className="tint-blush" cx="70" cy="76" rx="12" ry="5" /><ellipse className="tint-sage" cx="112" cy="76" rx="15" ry="5" /><ellipse className="tint-ochre" cx="152" cy="77" rx="10" ry="4.5" /><rect className="f-wood" x="14" y="88" width="192" height="10" /><path className="ply" d="M14 91.5H206M14 94.5H206" /><polygon className="f-wood" points="22,98 36,98 34,148 20,148" /><polygon className="f-wood" points="184,98 198,98 200,148 186,148" /></svg>
  );
}

export function ArtGuideBibliotheque({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="143" rx="72" ry="4" /><rect className="f-wood" x="36" y="22" width="11" height="120" rx="2" /><rect className="f-wood" x="153" y="22" width="11" height="120" rx="2" /><g transform="rotate(-6 70 60)"><rect className="f-clay" x="54" y="30" width="26" height="32" rx="2" /></g><g transform="rotate(-5 105 60)"><rect className="f-sage" x="88" y="26" width="28" height="36" rx="2" /></g><g transform="rotate(-7 135 60)"><rect className="f-ochre" x="122" y="32" width="26" height="30" rx="2" /></g><rect className="f-wood-dark" x="47" y="62" width="106" height="7" rx="1.5" /><g transform="rotate(-5 80 98)"><rect className="f-lin" x="56" y="70" width="30" height="28" rx="2" /></g><g transform="rotate(-6 120 98)"><rect className="f-sage-deep" x="98" y="66" width="26" height="32" rx="2" /></g><rect className="f-wood-dark" x="47" y="98" width="106" height="7" rx="1.5" /><rect className="f-sage" x="54" y="110" width="42" height="30" rx="4" /><rect className="f-ochre" x="104" y="110" width="42" height="30" rx="4" /></svg>
  );
}

export function ArtBols({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="128" rx="84" ry="5" /><path className="f-wood" d="M18 96h52a26 26 0 0 1-52 0Z" /><ellipse className="f-ochre" cx="44" cy="96" rx="26" ry="6" /><circle className="grain-dot" cx="36" cy="95" r="1.4" /><circle className="grain-dot" cx="50" cy="97" r="1.4" /><path className="f-wood" d="M74 92h52a26 26 0 0 1-52 0Z" /><ellipse className="f-lin" cx="100" cy="92" rx="26" ry="6" /><rect className="f-blush" x="88" y="86" width="9" height="5" rx="2.5" /><rect className="f-blush" x="102" y="88" width="9" height="5" rx="2.5" transform="rotate(30 106 90)" /><path className="f-wood" d="M130 96h52a26 26 0 0 1-52 0Z" /><ellipse className="f-sage" cx="156" cy="96" rx="26" ry="6" /><circle className="f-lin" cx="150" cy="95" r="2.4" opacity=".7" /><circle className="f-lin" cx="164" cy="97" r="2" opacity=".6" /><path className="f-wood-dark" d="M118 60l18 22" /><rect className="f-wood-dark" x="112" y="52" width="8" height="34" rx="4" transform="rotate(-40 116 69)" /><ellipse className="f-wood" cx="138" cy="84" rx="9" ry="5" transform="rotate(-40 138 84)" /></svg>
  );
}

export function ArtTableDeJeu({ className, label, viewBox = "0 0 400 260" }: ArtProps & { label?: string; viewBox?: string }) {
  return (
    <svg className={cx("lh-art", className)} viewBox={viewBox} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
<ellipse className="shadow" cx="200" cy="254" rx="170" ry="6" /><polygon className="f-wood-dark" points="96,152 112,152 108,236 92,236" /><polygon className="f-wood-dark" points="288,152 304,152 308,236 292,236" /><polygon className="f-wood" points="60,110 340,110 362,152 38,152" /><path className="hi" d="M62 111.5H338" /><polygon className="f-wood" points="78,116 198,116 200,147 70,147" /><polygon className="f-wood" points="202,116 322,116 330,147 200,147" /><path className="ply" d="M78 116H198L200 147H70ZM202 116H322L330 147H200Z" /><ellipse className="hole" cx="160" cy="131" rx="9" ry="3.2" /><ellipse className="hole" cx="292" cy="131" rx="9" ry="3.2" /><rect className="f-sage" x="88" y="114" width="28" height="24" rx="3" /><rect className="hi-fill" x="91" y="117" width="22" height="3" rx="1.5" /><rect className="f-ochre" x="94" y="93" width="24" height="21" rx="3" /><path className="f-clay" d="M126 139v-19a15 15 0 0 1 30 0v19h-8v-12a7 7 0 0 0-14 0v12Z" /><rect className="f-blush" x="222" y="117" width="44" height="15" rx="6" /><rect className="f-blush" x="232" y="106" width="22" height="13" rx="4" /><rect className="f-lin" x="236" y="109" width="14" height="7" rx="2" opacity=".7" /><circle className="f-wood-dark" cx="233" cy="134" r="5" /><circle className="f-wood-dark" cx="256" cy="134" r="5" /><path className="line-ink" d="M276 140h46" /><rect className="f-wood" x="38" y="152" width="324" height="18" /><path className="ply" d="M38 156.5H362M38 161H362M38 165.5H362" /><polygon className="f-wood" points="50,170 76,170 70,252 42,252" /><polygon className="f-wood" points="324,170 350,170 358,252 330,252" /><circle className="hole" cx="61" cy="188" r="2.6" /><circle className="hole" cx="60" cy="202" r="2.6" /><circle className="hole" cx="59" cy="216" r="2.6" /><circle className="hole" cx="339" cy="188" r="2.6" /><circle className="hole" cx="340" cy="202" r="2.6" /><circle className="hole" cx="341" cy="216" r="2.6" /><rect className="f-wood" x="70" y="206" width="260" height="12" rx="2" /><path className="ply" d="M70 210.5H330M70 214.5H330" />
        </svg>
  );
}

export function ArtDetailAssemblage({ className, label, numbered = true }: ArtProps & { label?: string; numbered?: boolean }) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 400 260" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
<ellipse className="shadow" cx="250" cy="256" rx="120" ry="5" /><rect className="f-wood" x="0" y="100" width="300" height="46" /><circle className="grain-dot" cx="60" cy="118" r="1.6" /><circle className="grain-dot" cx="120" cy="128" r="1.4" /><circle className="grain-dot" cx="180" cy="114" r="1.6" /><path className="f-wood" d="M0 60H318a26 26 0 0 1 26 26V100H0Z" /><path className="ply" d="M0 68H336M0 76H342M0 84H344M0 92H344" /><path className="hi" d="M0 61.5H318a24.5 24.5 0 0 1 24.5 24.5" /><rect className="f-wood" x="236" y="100" width="66" height="176" rx="12" /><path className="hi" d="M240 106V256" /><path className="ply" d="M296 108V256" /><circle className="hole" cx="269" cy="190" r="4.5" /><circle className="hole" cx="269" cy="212" r="4.5" /><circle className="hole" cx="269" cy="234" r="4.5" /><rect className="f-wood" x="302" y="112" width="40" height="24" rx="4" /><path className="ply" d="M302 118H342M302 124H342M302 130H342" /><polygon className="f-wood-dark" points="314,98 328,98 325,150 317,150" /><path className="hi" d="M316 100 318.5 148" />
{numbered && (<><path className="lh-lead-line" d="M339 70 362 40" /><circle className="lh-num-bg" cx="368" cy="32" r="13" /><text className="lh-num" x="368" y="32">1</text><path className="lh-lead-line" d="M327 142 360 176" /><circle className="lh-num-bg" cx="366" cy="184" r="13" /><text className="lh-num" x="366" y="184">2</text><path className="lh-lead-line" d="M60 78V40" /><circle className="lh-num-bg" cx="60" cy="30" r="13" /><text className="lh-num" x="60" y="30">3</text>
        </>)}
    </svg>
  );
}

export function ArtLivreeAPlat({ className, label }: ArtProps & { label?: string }) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 400 260" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
<ellipse className="shadow" cx="200" cy="246" rx="168" ry="6" /><g transform="rotate(10 330 242)"><rect className="f-wood" x="302" y="66" width="18" height="176" rx="3" /><rect className="f-wood-dark" x="320" y="66" width="6" height="176" rx="2" /></g><g transform="rotate(5 300 242)"><rect className="f-wood" x="280" y="92" width="16" height="150" rx="3" /><path className="ply" d="M285 96V238M290 96V238" /></g><polygon className="kraft" points="58,150 96,124 332,124 294,150" /><polygon className="f-ochre" points="118,116 176,116 172,140 122,140" /><polygon className="rim" points="118,116 176,116 175.4,120 118.6,120" /><polygon className="f-sage" points="190,110 246,110 242,134 194,134" /><polygon className="rim" points="190,110 246,110 245.4,114 190.6,114" /><polygon className="kraft-dark" points="294,150 332,124 332,216 294,242" /><rect className="kraft" x="58" y="150" width="236" height="92" rx="2" /><rect className="rim" x="58" y="150" width="236" height="92" rx="2" opacity=".08" /><polygon className="tape" points="150,150 188,124 204,124 166,150" /><rect className="tape" x="150" y="150" width="16" height="38" /><rect className="f-lin" x="196" y="172" width="80" height="48" rx="3" /><path className="f-clay" d="M236 211c-7-5-11-9-11-13.5a5.5 5.5 0 0 1 11-1.2 5.5 5.5 0 0 1 11 1.2c0 4.5-4 8.5-11 13.5Z" /><path className="line-ink" d="M206 184h22" /><path className="line-ink" d="M86 222v-22m-7 7 7-7 7 7M106 222v-22m-7 7 7-7 7 7" />
        </svg>
  );
}

export function ArtPetiteTable({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 128 400 134" aria-hidden="true"><ellipse className="shadow" cx="200" cy="254" rx="184" ry="6" /><rect className="f-sage" x="6" y="204" width="64" height="15" rx="7.5" /><rect className="f-wood-dark" x="14" y="219" width="8" height="32" rx="2" /><rect className="f-wood-dark" x="54" y="219" width="8" height="32" rx="2" /><rect className="f-ochre" x="330" y="204" width="64" height="15" rx="7.5" /><rect className="f-wood-dark" x="338" y="219" width="8" height="32" rx="2" /><rect className="f-wood-dark" x="378" y="219" width="8" height="32" rx="2" /><polygon className="f-wood-dark" points="112,190 124,190 122,246 110,246" /><polygon className="f-wood-dark" points="276,190 288,190 290,246 278,246" /><polygon className="f-wood" points="84,154 316,154 334,190 66,190" /><path className="hi" d="M86 155.5H314" /><path className="ply" d="M200 156 201 188" /><polygon className="f-lin" points="118,160 194,160 190,184 110,184" /><path className="line-ink" d="M126 176c8-8 16 4 24-4s14 6 22 0" /><circle className="tint-ochre" cx="134" cy="167" r="4" /><rect className="f-clay" x="214" y="170" width="34" height="5" rx="2.5" transform="rotate(-12 231 172)" /><rect className="f-sage" x="216" y="179" width="30" height="5" rx="2.5" transform="rotate(6 231 181)" /><rect className="f-blush" x="272" y="158" width="18" height="22" rx="3" /><rect className="hi-fill" x="275" y="161" width="12" height="3" rx="1.5" /><rect className="f-wood" x="66" y="190" width="268" height="14" /><path className="ply" d="M66 194H334M66 198.5H334" /><polygon className="f-wood" points="76,204 98,204 94,250 70,250" /><polygon className="f-wood" points="302,204 324,204 330,250 306,250" /><circle className="hole" cx="84" cy="216" r="2.4" /><circle className="hole" cx="314" cy="216" r="2.4" /></svg>
  );
}

export function ArtCroissance({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art lh-grow__art", className)} viewBox="0 0 1100 200" aria-hidden="true">
<path className="dash" d="M150 84C330 60 380 40 550 52S800 20 950 18" /><path className="lh-dim" d="M20 188H1080" /><ellipse className="shadow" cx="150" cy="188" rx="131" ry="5" /><polygon className="f-wood-dark" points="69,136 79,136 77,186 67,186" /><polygon className="f-wood-dark" points="221,136 231,136 233,186 223,186" /><polygon className="f-wood" points="45,112 255,112 275,136 25,136" /><polygon className="f-ochre" points="57,117 146,117 147,133 49,133" /><polygon className="f-sage" points="154,117 243,117 251,133 153,133" /><rect className="f-wood" x="25.0" y="136" width="250" height="10" /><path className="ply" d="M25.0 141H275.0" /><polygon className="f-wood" points="33,146 51,146 49,186 31,186" /><polygon className="f-wood" points="249,146 267,146 269,186 251,186" /><circle className="hole" cx="40.5" cy="160" r="3" /><circle className="hole" cx="259.5" cy="160" r="3" /><circle className="hole" cx="40.5" cy="172" r="3" /><circle className="hole" cx="259.5" cy="172" r="3" /><ellipse className="shadow" cx="550" cy="188" rx="131" ry="5" /><polygon className="f-wood-dark" points="469,116 479,116 477,186 467,186" /><polygon className="f-wood-dark" points="621,116 631,116 633,186 623,186" /><polygon className="f-wood" points="445,92 655,92 675,116 425,116" /><polygon className="f-lin" points="455,96 645,96 655,113 445,113" /><path className="line-ink" d="M500 107c10-9 20-9 30 0s20 9 30 0" /><circle className="tint-ochre" cx="602" cy="104" r="5" /><rect className="f-wood" x="425.0" y="116" width="250" height="10" /><path className="ply" d="M425.0 121H675.0" /><polygon className="f-wood" points="433,126 451,126 449,186 431,186" /><polygon className="f-wood" points="649,126 667,126 669,186 651,186" /><circle className="hole" cx="440.5" cy="148" r="3" /><circle className="hole" cx="659.5" cy="148" r="3" /><circle className="f-clay" cx="440.5" cy="160" r="3" /><circle className="f-clay" cx="659.5" cy="160" r="3" /><circle className="hole" cx="440.5" cy="172" r="3" /><circle className="hole" cx="659.5" cy="172" r="3" /><ellipse className="shadow" cx="950" cy="188" rx="131" ry="5" /><polygon className="f-wood-dark" points="869,94 879,94 877,186 867,186" /><polygon className="f-wood-dark" points="1021,94 1031,94 1033,186 1023,186" /><polygon className="f-wood" points="845,70 1055,70 1075,94 825,94" /><path className="ply" d="M950 72V93" /><rect className="f-sage" x="880" y="56" width="20" height="18" rx="2" /><rect className="f-ochre" x="884" y="41" width="16" height="15" rx="2" /><path className="f-clay" d="M980 76v-12a10 10 0 0 1 20 0v12h-6v-8a4 4 0 0 0-8 0v8Z" /><rect className="f-wood" x="825.0" y="94" width="250" height="10" /><path className="ply" d="M825.0 99H1075.0" /><polygon className="f-wood" points="833,104 851,104 849,186 831,186" /><polygon className="f-wood" points="1049,104 1067,104 1069,186 1051,186" /><circle className="hole" cx="840.5" cy="148" r="3" /><circle className="hole" cx="1059.5" cy="148" r="3" /><circle className="hole" cx="840.5" cy="160" r="3" /><circle className="hole" cx="1059.5" cy="160" r="3" /><circle className="f-clay" cx="840.5" cy="172" r="3" /><circle className="f-clay" cx="1059.5" cy="172" r="3" />
    </svg>
  );
}

export function ArtDimensions({ className, label, width = "[L] cm", height = "[H] cm", notches = "3 crans" }: ArtProps & { label: string; width?: string; height?: string; notches?: string }) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 460 300" role="img" aria-label={label}>
<rect className="f-wood" x="70" y="72" width="320" height="16" rx="4" /><path className="hi" d="M74 73.5H386" /><rect className="f-wood" x="80" y="88" width="300" height="20" /><path className="ply" d="M80 94H380M80 101H380" /><rect className="f-wood" x="86" y="88" width="24" height="158" rx="3" /><rect className="f-wood" x="350" y="88" width="24" height="158" rx="3" /><circle className="hole" cx="98" cy="156" r="3" /><circle className="hole" cx="98" cy="176" r="3" /><circle className="f-clay" cx="98" cy="196" r="3" /><circle className="hole" cx="362" cy="156" r="3" /><circle className="hole" cx="362" cy="176" r="3" /><circle className="f-clay" cx="362" cy="196" r="3" /><rect className="f-wood-dark" x="110" y="204" width="240" height="12" rx="2" /><path className="lh-dim" d="M30 246H430" /><path className="lh-dim" d="M70 40H390M70 33V47M390 33V47" /><rect className="lh-dim-bg" x="188" y="28" width="84" height="24" /><text className="lh-dim-t" x="230" y="40">{width}</text><path className="lh-dim" d="M420 72V246M413 72H427M413 246H427" /><rect className="lh-dim-bg" x="390" y="147" width="62" height="24" /><text className="lh-dim-t" x="420" y="159">{height}</text><path className="lh-dim" d="M40 196H80M40 189V203" /><rect className="lh-dim-bg" x="2" y="204" width="76" height="24" /><text className="lh-dim-t" x="40" y="216">{notches}</text>
      </svg>
  );
}

export function ArtPlateauArt({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="128" rx="82" ry="5" /><polygon className="f-wood" points="30,50 170,50 186,118 14,118" /><polygon className="f-lin" points="38,56 162,56 175,112 25,112" /><circle className="tint-ochre" cx="64" cy="76" r="10" /><path className="line-ink" d="M84 94c10-14 20-14 30 0s20 14 30 0" /><path className="line-ink" d="M122 74l12-14 12 14Z" /><rect className="f-clay" x="40" y="96" width="30" height="5" rx="2.5" transform="rotate(-10 55 98)" /></svg>
  );
}

export function ArtPlateauLumineux({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="halo" cx="100" cy="84" rx="96" ry="40" /><ellipse className="shadow" cx="100" cy="128" rx="82" ry="5" /><polygon className="f-wood" points="30,50 170,50 186,118 14,118" /><polygon className="glow-panel" points="38,56 162,56 175,112 25,112" /><ellipse className="tint-blush" cx="64" cy="88" rx="16" ry="8" /><ellipse className="tint-sage" cx="104" cy="78" rx="18" ry="8" /><ellipse className="tint-ochre" cx="140" cy="96" rx="14" ry="7" /></svg>
  );
}

export function ArtEntonnoirs({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="132" rx="84" ry="5" /><polygon className="f-wood" points="26,64 170,104 170,116 26,76" /><polygon className="f-wood-dark" points="26,76 170,116 170,122 26,82" /><rect className="f-wood-dark" x="28" y="80" width="8" height="50" rx="2" /><rect className="f-wood-dark" x="152" y="118" width="8" height="12" rx="2" /><polygon className="f-wood" points="20,20 72,20 54,48 38,48" /><ellipse className="rim" cx="46" cy="20" rx="26" ry="5" /><rect className="f-wood" x="40" y="48" width="12" height="16" /><circle className="f-ochre" cx="98" cy="82" r="6" /><circle className="f-sage-deep" cx="132" cy="93" r="5" /><circle className="f-clay" cx="182" cy="126" r="6" /></svg>
  );
}

export function ArtTamis({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><ellipse className="shadow" cx="100" cy="134" rx="74" ry="5" /><path className="f-ochre" d="M52 134c10-18 32-26 48-26s38 8 48 26Z" /><polygon className="f-wood" points="40,40 160,40 176,98 24,98" /><polygon className="f-lin" points="50,48 150,48 162,90 38,90" /><path className="lh-mesh" d="M66 48 58 90M84 48 80 90M100 48V90M116 48 120 90M134 48 142 90M46 59H154M43 69H157M41 80H159" /><circle className="f-clay" cx="88" cy="66" r="4" /><circle className="f-sage" cx="118" cy="76" r="3.5" /></svg>
  );
}

export function ArtToast({ className }: ArtProps) {
  return (
    <svg className={cx("lh-art", className)} viewBox="0 0 200 150" aria-hidden="true"><polygon className="f-wood" points="34,64 166,64 176,86 24,86" /><polygon className="f-ochre" points="45,71 97,71 99,83 41,83" /><polygon className="f-sage" points="105,71 155,71 159,83 103,83" /><rect className="f-wood" x="24" y="86" width="152" height="9" /><polygon className="f-wood" points="30,95 44,95 41,142 25,142" /><polygon className="f-wood" points="156,95 170,95 175,142 159,142" /></svg>
  );
}

export function HeroScene() {
  return (
    <>
      <svg className="scene" viewBox="0 0 560 600" aria-hidden="true">
        <defs>
          <clipPath id="v2Arch"><path d="M20 600V280A260 260 0 0 1 540 280V600Z" /></clipPath>
          <clipPath id="v2Ball"><circle cx="490" cy="552" r="26" /></clipPath>
          <filter id="v2Grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.32" numOctaves="2" seed="7" result="t" />
            <feColorMatrix in="t" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="g2">
              <feFuncR type="linear" slope="0.45" intercept="0.68" />
              <feFuncG type="linear" slope="0.45" intercept="0.68" />
              <feFuncB type="linear" slope="0.45" intercept="0.68" />
              <feFuncA type="table" tableValues="1 1" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="g2" mode="multiply" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <path className="outline" d="M32 600V270A260 260 0 0 1 552 270V600" />
        <g className="clip-v2">
          <rect className="wall" width="560" height="600" />
          <circle className="glow" cx="420" cy="120" r="190" />
          <polygon className="light" points="352,0 404,0 300,440 238,440" />
          <polygon className="light" points="414,0 466,0 372,440 310,440" />
          <polygon className="light" points="476,0 512,0 430,440 384,440" />
          <g className="mobile">
            <line className="string" x1="280" y1="0" x2="280" y2="96" />
            <rect className="f-wood-dark" x="182" y="95" width="196" height="6" rx="3" />
            <g className="swing s1"><line className="string" x1="196" y1="101" x2="196" y2="150" /><circle className="f-ochre" cx="196" cy="166" r="16" /></g>
            <g className="swing s2"><line className="string" x1="280" y1="101" x2="280" y2="186" /><path className="f-clay" d="M260 190a20 20 0 0 0 40 0Z" /></g>
            <g className="swing s3"><line className="string" x1="364" y1="101" x2="364" y2="158" /><rect className="f-sage-deep" x="353" y="158" width="22" height="22" rx="3" transform="rotate(45 364 169)" /></g>
          </g>
          <rect className="floor" x="0" y="440" width="560" height="160" />
          <ellipse className="f-blush" cx="280" cy="566" rx="262" ry="36" />
          <ellipse className="rug-stitch" cx="280" cy="566" rx="244" ry="27" />
          <polygon className="light-floor" points="238,440 384,440 334,600 160,600" />

          
          <g className="lean" filter="url(#v2Grain)">
            <rect className="f-wood" x="380" y="214" width="132" height="168" rx="12" transform="rotate(7 446 382)" />
            <rect className="f-sage-deep" x="390" y="224" width="112" height="148" rx="8" transform="rotate(7 446 382)" />
            <g transform="rotate(7 446 382)">
              <circle className="chalk" cx="424" cy="258" r="13" />
              <path className="chalk" d="M424 236v-6M444 258h6M439 243l4-4M409 243l-4-4" />
              <path className="chalk" d="M404 332c12-14 22-14 32 0s22 14 32 0 18-12 24-4" />
              <path className="chalk" d="M452 300l14-14 14 14v16h-28Z" />
            </g>
          </g>

          <ellipse className="shadow" cx="280" cy="524" rx="196" ry="8" />

          
          <g className="drop d4" filter="url(#v2Grain)">
            <polygon className="f-wood-dark" points="162,404 182,404 178,500 158,500" />
            <polygon className="f-wood-dark" points="378,404 398,404 402,500 382,500" />
            <polygon className="f-wood" points="118,356 442,356 462,404 98,404" />
            <path className="hi" d="M120 357.5H440" />
            <polygon className="rim" points="138,363 270,363 275,398 130,398" />
            <polygon className="rim" points="290,363 422,363 430,398 285,398" />
            <rect className="f-wood" x="98" y="404" width="364" height="18" />
            <path className="ply" d="M98 408.5H462M98 413H462M98 417.5H462" />
            <polygon className="f-wood" points="122,422 150,422 145,522 113,522" />
            <polygon className="f-wood" points="410,422 438,422 447,522 415,522" />
            <path className="ply" d="M127 426 120 518M405 426 412 518" />
            <circle className="hole" cx="135" cy="442" r="2.6" /><circle className="hole" cx="134" cy="458" r="2.6" /><circle className="hole" cx="133" cy="474" r="2.6" />
            <circle className="hole" cx="425" cy="442" r="2.6" /><circle className="hole" cx="426" cy="458" r="2.6" /><circle className="hole" cx="427" cy="474" r="2.6" />
            <rect className="f-wood" x="146" y="474" width="268" height="14" rx="2" />
            <path className="ply" d="M146 478.5H414M146 483.5H414" />
          </g>
          
          <g className="fill-grow">
            <polygon className="f-ochre" points="141,370 267,370 272,398 133,398" />
            <circle className="grain-dot" cx="160" cy="388" r="1.6" /><circle className="grain-dot" cx="178" cy="380" r="1.4" /><circle className="grain-dot" cx="205" cy="392" r="1.6" /><circle className="grain-dot" cx="248" cy="384" r="1.4" /><circle className="grain-dot" cx="226" cy="378" r="1.2" /><circle className="grain-dot" cx="150" cy="378" r="1.2" />
          </g>
          <g className="fill-grow">
            <polygon className="f-sage" points="293,370 419,370 427,398 288,398" />
            <circle className="f-lin" cx="310" cy="388" r="3" opacity=".55" /><circle className="f-lin" cx="336" cy="380" r="2.4" opacity=".5" /><circle className="f-lin" cx="398" cy="390" r="3" opacity=".5" /><circle className="f-sage-deep" cx="380" cy="380" r="2.6" /><circle className="f-sage-deep" cx="320" cy="394" r="2.2" />
          </g>
          
          <g className="drop d6">
            <rect className="f-wood-dark" x="196" y="368" width="34" height="5" rx="2.5" transform="rotate(-22 213 370)" />
            <ellipse className="f-wood-dark" cx="190" cy="386" rx="14" ry="6" />
            <rect className="f-blush" x="352" y="368" width="24" height="22" rx="4" />
            <rect className="hi-fill" x="355" y="370" width="4" height="16" rx="2" />
          </g>
          <g className="drop d1">
            <path className="f-clay" d="M236 392V374a8 8 0 0 1 16 0V392Z" />
            <circle className="f-wood" cx="244" cy="361" r="8" />
            <path className="f-wood-dark" d="M236 360a8 8 0 0 1 16 0Z" />
          </g>

          
          <g className="roll">
            <circle className="f-ochre" cx="490" cy="552" r="26" />
            <g className="clip-ball-v2">
              <ellipse className="f-clay" cx="490" cy="552" rx="10" ry="28" />
              <ellipse className="f-lin" cx="490" cy="552" rx="3" ry="28" opacity=".85" />
            </g>
            <circle className="f-lin" cx="481" cy="541" r="4" opacity=".45" />
          </g>
          <ellipse className="shadow" cx="490" cy="579" rx="26" ry="4" />

          <circle className="mote m1" cx="330" cy="150" r="1.6" />
          <circle className="mote m2" cx="372" cy="220" r="1.2" />
          <circle className="mote m3" cx="300" cy="300" r="1.8" />
          <circle className="mote m4" cx="420" cy="120" r="1.1" />
          <circle className="mote m5" cx="352" cy="340" r="1.4" />
          <circle className="mote m6" cx="446" cy="200" r="1.5" />
          <circle className="mote m7" cx="282" cy="380" r="1.1" />
          <circle className="mote m8" cx="400" cy="300" r="1.3" />
        </g>
      </svg>
      <svg className="branch" viewBox="0 0 140 260" aria-hidden="true">
        <path className="stem" d="M120 260C110 200 86 150 40 96" />
        <path className="stem" d="M98 186C78 170 56 166 30 170" />
        <ellipse className="f-sage" cx="40" cy="92" rx="13" ry="9" transform="rotate(-35 40 92)" />
        <ellipse className="f-sage-deep" cx="62" cy="118" rx="14" ry="9" transform="rotate(-50 62 118)" />
        <ellipse className="f-sage" cx="80" cy="140" rx="15" ry="10" transform="rotate(-40 80 140)" />
        <ellipse className="f-sage-deep" cx="54" cy="150" rx="13" ry="8.5" transform="rotate(20 54 150)" />
        <ellipse className="f-sage" cx="30" cy="170" rx="13" ry="9" transform="rotate(10 30 170)" />
        <ellipse className="f-sage-deep" cx="96" cy="170" rx="15" ry="10" transform="rotate(-60 96 170)" />
        <ellipse className="f-sage" cx="104" cy="206" rx="15" ry="10" transform="rotate(-70 104 206)" />
        <ellipse className="f-sage-deep" cx="88" cy="226" rx="13" ry="9" transform="rotate(30 88 226)" />
      </svg>
    </>
  );
}
