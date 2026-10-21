"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type React from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icons";

/**
 * Carrousel de cartes produit : une rangée qui défile horizontalement (scroll-snap), avec deux flèches.
 * Les cartes sont rendues côté serveur et passées en enfants ; ici on ne gère que le défilement.
 */
export function ProductCarousel({ children, label }: { children: ReactNode; label: string }) {
  const t = useTranslations("common");
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  // Glisser à la souris : le doigt fait déjà défiler nativement, la souris non. Pendant le glissement,
  // l'accroche est suspendue ; un vrai glissement annule le clic qui suit (sinon on ouvrirait une fiche).
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
    track.current.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current, el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) { d.moved = true; el.setPointerCapture(e.pointerId); }
    if (d.moved) { e.preventDefault(); el.scrollLeft = d.left - dx; }
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current || !el) return;
    const moved = drag.current.moved;
    el.style.cursor = "";
    el.style.scrollSnapType = "";
    if (moved) setTimeout(() => { drag.current = null; }, 0);
    else drag.current = null;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); }
  };

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth / 2) + gap), behavior: "smooth" });
  };

  return (
    <div className="lh-carousel">
      <div
        className="lh-carousel__track" ref={track} role="region" aria-label={label} tabIndex={0}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag} onClickCapture={onClickCapture}
      >
        {children}
      </div>
      <div className="lh-carousel__nav">
        <button className="lh-icon-btn lh-icon-btn--outline" type="button" aria-label={t("prev")} disabled={edges.start} onClick={() => step(-1)}><span style={{ display: "inline-flex", transform: "scaleX(-1)" }}><Icon name="arrow" /></span></button>
        <button className="lh-icon-btn lh-icon-btn--outline" type="button" aria-label={t("next")} disabled={edges.end} onClick={() => step(1)}><Icon name="arrow" /></button>
      </div>
    </div>
  );
}
