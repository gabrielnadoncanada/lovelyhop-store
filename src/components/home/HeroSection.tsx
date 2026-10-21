"use client";

import { useRef } from "react";

/** Enveloppe du hero : profondeur au déplacement du pointeur (--px, --py), coupée sous prefers-reduced-motion. */
export function HeroSection({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const leave = () => { ref.current?.style.setProperty("--px", "0"); ref.current?.style.setProperty("--py", "0"); };
  return <section className="lh-hero" aria-label={label} ref={ref} onPointerMove={move} onPointerLeave={leave}>{children}</section>;
}
