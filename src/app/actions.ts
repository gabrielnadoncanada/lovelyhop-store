"use server";

import { addLines, getCart, updateLine } from "@/lib/cart";
import { searchProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { CONTACT_TAG, isAdminConfigured, upsertQuoteLead } from "@/lib/shopify/admin";
import type { ArtKey } from "@/lib/types";
import type { Cart, Locale } from "@/lib/types";
import { routing } from "@/i18n/routing";

const safeLocale = (l: string): Locale => ((routing.locales as readonly string[]).includes(l) ? (l as Locale) : "fr");

export async function loadCart(locale: string): Promise<Cart> {
  return getCart(safeLocale(locale));
}

export async function addToCart(lines: { variantId: string; quantity: number }[], locale: string): Promise<Cart> {
  const clean = lines.filter((l) => typeof l.variantId === "string" && l.quantity > 0 && l.quantity <= 50);
  return addLines(clean, safeLocale(locale));
}

export async function setLineQuantity(lineId: string, quantity: number, locale: string): Promise<Cart> {
  return updateLine(lineId, Math.max(0, Math.min(50, Math.round(quantity))), safeLocale(locale));
}

export type QuickResult = { handle: string; title: string; meta: string; price: string; art: ArtKey | null; image: string | null };

/** Recherche instantanée de l'en-tête (API predictiveSearch de Shopify). */
export async function quickSearch(q: string, locale: string): Promise<QuickResult[]> {
  const l = safeLocale(locale);
  const products = await searchProducts(q.slice(0, 80), l);
  return products.slice(0, 4).map((p) => ({ handle: p.handle, title: p.title, meta: p.age, price: formatMoney(p.minPrice, l), art: p.art, image: p.images[0]?.url ?? null }));
}

/* ---------- Formulaires ---------- */

export type FormState = { status: "idle" | "ok" | "error"; errors?: Record<string, string>; message?: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/**
 * Demande de soumission CPE. Enregistrée comme client Shopify (étiquette « soumission-cpe », demande
 * dans la note) si SHOPIFY_ADMIN_ACCESS_TOKEN est défini : un workflow Shopify Flow envoie alors le
 * courriel interne. Envoyée aussi par Resend si RESEND_API_KEY est défini. Sans l'un ni l'autre, journalisée.
 */
export async function submitQuote(_prev: FormState, form: FormData): Promise<FormState> {
  const locale = safeLocale(String(form.get("locale") ?? "fr"));
  const fr = locale === "fr";
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const errors: Record<string, string> = {};
  if (!get("org")) errors.org = fr ? "Indiquez le nom de votre installation." : "Enter the name of your daycare.";
  if (!get("city")) errors.city = fr ? "Indiquez votre ville." : "Enter your city.";
  if (!get("name")) errors.name = fr ? "Indiquez votre nom." : "Enter your name.";
  if (!isEmail(get("email"))) errors.email = fr ? "Ce courriel semble incomplet." : "This email looks incomplete.";
  if (Object.keys(errors).length) return { status: "error", errors };

  const lines = [
    `Installation : ${get("org")} (${get("city")})`,
    `Locaux : ${get("rooms")}`,
    `Âges : ${form.getAll("ages").join(", ") || "—"}`,
    `Mobilier : ${form.getAll("products").join(", ") || "—"}`,
    `Contact : ${get("name")} · ${get("email")} · ${get("phone") || "—"}`,
    `Projet : ${get("message") || "—"}`,
  ].join("\n");

  const failed = { status: "error" as const, message: fr ? "L'envoi n'a pas fonctionné. Réessayez ou écrivez-nous directement." : "Sending failed. Try again or email us directly." };
  let delivered = false;

  if (isAdminConfigured) {
    try {
      await upsertQuoteLead({ email: get("email"), name: get("name"), locale, note: lines });
      delivered = true;
    } catch (e) {
      console.error("[soumission CPE] client Shopify :", e);
    }
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  if (key && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.QUOTE_FROM_EMAIL ?? "Lovelyhop <soumissions@lovelyhop.com>", to: [to], reply_to: get("email"), subject: `Soumission CPE — ${get("org")}`, text: lines }),
    });
    if (res.ok) delivered = true;
    else console.error("[soumission CPE] Resend :", res.status, await res.text());
  }

  if (!delivered) {
    if (isAdminConfigured || (key && to)) return failed;
    console.info("[soumission CPE]\n" + lines);
  }
  return { status: "ok" };
}

/**
 * Message du formulaire « Nous joindre » : même chemin que les soumissions CPE (client Shopify étiqueté
 * « contact-site » + courriel interne par Flow, ou Resend), avec le message dans la note du client.
 */
export async function submitContact(_prev: FormState, form: FormData): Promise<FormState> {
  const locale = safeLocale(String(form.get("locale") ?? "fr"));
  const fr = locale === "fr";
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const errors: Record<string, string> = {};
  if (!get("name")) errors.name = fr ? "Indiquez votre nom." : "Enter your name.";
  if (!isEmail(get("email"))) errors.email = fr ? "Ce courriel semble incomplet." : "This email looks incomplete.";
  if (get("message").length < 10) errors.message = fr ? "Écrivez-nous quelques mots." : "Write us a few words.";
  if (Object.keys(errors).length) return { status: "error", errors };

  const lines = [`Sujet : ${get("subject") || "—"}`, `Contact : ${get("name")} · ${get("email")}`, `Message : ${get("message")}`].join("\n");
  const failed = { status: "error" as const, message: fr ? "L'envoi n'a pas fonctionné. Réessayez ou écrivez-nous directement." : "Sending failed. Try again or email us directly." };
  let delivered = false;

  if (isAdminConfigured) {
    try {
      await upsertQuoteLead({ email: get("email"), name: get("name"), locale, note: lines, tag: CONTACT_TAG });
      delivered = true;
    } catch (e) {
      console.error("[contact] client Shopify :", e);
    }
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  if (key && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.QUOTE_FROM_EMAIL ?? "Lovelyhop <soumissions@lovelyhop.com>", to: [to], reply_to: get("email"), subject: `Message du site — ${get("name")}`, text: lines }),
    });
    if (res.ok) delivered = true;
    else console.error("[contact] Resend :", res.status, await res.text());
  }

  if (!delivered) {
    if (isAdminConfigured || (key && to)) return failed;
    console.info("[contact]\n" + lines);
  }
  return { status: "ok" };
}

/** Infolettre : à brancher sur l'outil choisi (Shopify Email, Klaviyo…). Pour l'instant, valide et journalise. */
export async function subscribeNewsletter(_prev: FormState, form: FormData): Promise<FormState> {
  const fr = String(form.get("locale")) !== "en";
  const email = String(form.get("email") ?? "").trim();
  if (!isEmail(email)) return { status: "error", message: fr ? "Entrez un courriel complet, par exemple nom@courriel.com." : "Enter a full email, for example name@email.com." };
  console.info("[infolettre]", email);
  return { status: "ok", message: fr ? "Merci. Votre première idée de jeu arrive au début du mois." : "Thank you. Your first play idea arrives at the start of the month." };
}
