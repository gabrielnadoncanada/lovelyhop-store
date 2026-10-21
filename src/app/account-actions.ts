"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { accountPath } from "@/lib/account";
import { CustomerAuthError } from "@/lib/shopify/customer";
import { createAddress, deleteAddress, updateAddress, updateProfile, type AddressInput } from "@/lib/shopify/customer-data";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";

export type AccountFormState = { status: "idle" | "ok" | "error"; message?: string; errors?: Record<string, string> };

const safeLocale = (l: FormDataEntryValue | null): Locale => ((routing.locales as readonly string[]).includes(String(l)) ? (l as Locale) : "fr");
const text = (fd: FormData, k: string, max = 120) => String(fd.get(k) ?? "").trim().slice(0, max);

async function failure(locale: Locale, e: unknown): Promise<AccountFormState> {
  if (e instanceof CustomerAuthError) redirect(`/api/auth/refresh?locale=${locale}&return=${encodeURIComponent(accountPath("/account", locale))}`);
  console.error("[account]", e);
  const t = await getTranslations({ locale, namespace: "account" });
  return { status: "error", message: t("errors.generic") };
}

/** Crée ou met à jour une adresse ; revient sur la liste des adresses si tout va bien. */
export async function saveAddress(_prev: AccountFormState, fd: FormData): Promise<AccountFormState> {
  const locale = safeLocale(fd.get("locale"));
  const t = await getTranslations({ locale, namespace: "account" });
  const address: AddressInput = {
    firstName: text(fd, "firstName"), lastName: text(fd, "lastName"), company: text(fd, "company"),
    address1: text(fd, "address1"), address2: text(fd, "address2"), city: text(fd, "city"),
    zoneCode: text(fd, "zoneCode", 3), territoryCode: "CA", zip: text(fd, "zip", 12), phoneNumber: text(fd, "phoneNumber", 24),
  };
  const errors: Record<string, string> = {};
  for (const k of ["firstName", "lastName", "address1", "city", "zoneCode", "zip"] as const) if (!address[k]) errors[k] = t("errors.required");
  if (Object.keys(errors).length) return { status: "error", errors };
  const id = text(fd, "id", 200);
  const makeDefault = fd.get("default") === "on";
  try {
    const err = id ? await updateAddress(id, address, makeDefault) : await createAddress(address, makeDefault);
    if (err) return { status: "error", message: err };
  } catch (e) {
    return failure(locale, e);
  }
  redirect(accountPath("/account/addresses", locale));
}

export async function removeAddress(fd: FormData): Promise<void> {
  const locale = safeLocale(fd.get("locale"));
  const id = text(fd, "id", 200);
  if (id) {
    try { await deleteAddress(id); } catch (e) { await failure(locale, e); }
  }
  redirect(accountPath("/account/addresses", locale));
}

export async function saveProfile(_prev: AccountFormState, fd: FormData): Promise<AccountFormState> {
  const locale = safeLocale(fd.get("locale"));
  const t = await getTranslations({ locale, namespace: "account" });
  const firstName = text(fd, "firstName"), lastName = text(fd, "lastName");
  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = t("errors.required");
  if (!lastName) errors.lastName = t("errors.required");
  if (Object.keys(errors).length) return { status: "error", errors };
  try {
    const err = await updateProfile({ firstName, lastName });
    if (err) return { status: "error", message: err };
  } catch (e) {
    return failure(locale, e);
  }
  return { status: "ok", message: t("profile.saved") };
}
