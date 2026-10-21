"use client";

import { useEffect } from "react";
import { applyConsent, track } from "@/lib/analytics";
import { readConsent, type ConsentChoice } from "@/components/layout/Consent";

/** Démarre PostHog selon le témoin lh_consent, et suit les changements faits dans le bandeau. */
export function Analytics() {
  useEffect(() => {
    applyConsent(readConsent());
    const onConsent = (e: Event) => applyConsent((e as CustomEvent<ConsentChoice>).detail);
    window.addEventListener("lh:consent", onConsent);
    return () => window.removeEventListener("lh:consent", onConsent);
  }, []);
  return null;
}

/** Vue d'une fiche produit (monté dans la page produit). */
export function TrackProductView({ handle, title, univers, price }: { handle: string; title: string; univers: string | null; price: string | null }) {
  useEffect(() => { track("product_viewed", { product_handle: handle, product_title: title, univers, price: price ? Number(price) : null }); }, [handle, title, univers, price]);
  return null;
}

/** Succès d'un formulaire (soumission CPE, infolettre). */
export function TrackOnce({ event, properties }: { event: string; properties?: Record<string, unknown> }) {
  useEffect(() => { track(event, properties); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
