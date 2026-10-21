"use client";

import type { ConsentChoice } from "@/components/layout/Consent";

/**
 * Mesure d'audience (PostHog), chargée seulement après un accord « analytique » dans le bandeau
 * de témoins (Loi 25). Sans accord, rien n'est chargé et `track()` ne fait rien.
 * NEXT_PUBLIC_POSTHOG_KEY est le jeton public du projet ; NEXT_PUBLIC_POSTHOG_HOST l'hôte d'ingestion.
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

type PostHog = typeof import("posthog-js").default;
let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
/** Événements émis avant le démarrage (ex. vue produit sur la page où l'accord est donné) ; vidés au démarrage. */
const queue: { event: string; properties?: Record<string, unknown> }[] = [];

export const isAnalyticsConfigured = Boolean(KEY);

/** Charge et initialise PostHog une seule fois. Retourne null si la clé manque. */
export function startAnalytics(): Promise<PostHog | null> {
  if (!KEY || typeof window === "undefined") return Promise.resolve(null);
  if (client) return Promise.resolve(client);
  loading ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      defaults: "2026-05-30",
      persistence: "localStorage+cookie",
      capture_pageview: "history_change",
      autocapture: true,
      session_recording: { maskAllInputs: true },
    });
    posthog.register({ site_env: window.location.hostname === "lovelyhop.com" ? "production" : "development", site_locale: document.documentElement.lang });
    client = posthog;
    // Après la page vue initiale, pour que les entonnoirs « visite → fiche produit » gardent l'ordre.
    setTimeout(() => { for (const q of queue.splice(0)) posthog.capture(q.event, q.properties); }, 300);
    return posthog;
  });
  return loading;
}

/** Applique un choix de consentement : démarre, ou met en pause sans effacer l'accord des autres témoins. */
export function applyConsent(choice: ConsentChoice | null) {
  if (choice?.analytics) {
    startAnalytics().then((p) => p?.has_opted_out_capturing() && p.opt_in_capturing());
  } else {
    queue.length = 0;
    client?.opt_out_capturing();
  }
}

/** Événement métier. Avant l'accord, il attend (au plus 20 en mémoire) et part au démarrage ; refusé = oublié. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (client) client.capture(event, properties);
  else if (KEY && queue.length < 20) queue.push({ event, properties });
}
