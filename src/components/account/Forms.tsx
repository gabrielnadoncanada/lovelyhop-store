"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { saveAddress, saveProfile, type AccountFormState } from "@/app/account-actions";
import { Icon } from "@/components/ui/icons";
import type { CustomerAddress } from "@/lib/shopify/customer-data";

const PROVINCES = ["QC", "ON", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "NT", "NU", "YT"] as const;
const idle: AccountFormState = { status: "idle" };

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={error ? "lh-field is-error" : "lh-field"}>
      <label className="lh-label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="lh-help" id={`${id}-h`}><Icon name="error" />{error}</span>}
    </div>
  );
}

/** Ajout ou modification d'une adresse (Canada). */
export function AddressForm({ address, isDefault, cancelHref }: { address?: CustomerAddress | null; isDefault?: boolean; cancelHref: string }) {
  const t = useTranslations("account.addresses");
  const locale = useLocale();
  const [state, action, pending] = useActionState<AccountFormState, FormData>(saveAddress, idle);
  const err = (k: string) => state.errors?.[k];
  const input = (k: keyof CustomerAddress, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input className="lh-input" id={`a-${k}`} name={k} defaultValue={(address?.[k] as string | null) ?? ""} aria-invalid={!!err(k)} aria-describedby={err(k) ? `a-${k}-h` : undefined} {...extra} />
  );
  return (
    <form className="lh-form" action={action} noValidate>
      {state.message && <div className="lh-notice lh-notice--danger lh-form__full" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{state.message}</div></div>}
      <Field id="a-firstName" label={t("firstName")} error={err("firstName")}>{input("firstName", { autoComplete: "given-name" })}</Field>
      <Field id="a-lastName" label={t("lastName")} error={err("lastName")}>{input("lastName", { autoComplete: "family-name" })}</Field>
      <Field id="a-company" label={t("company")}>{input("company", { autoComplete: "organization" })}</Field>
      <Field id="a-phoneNumber" label={t("phone")}>{input("phoneNumber", { type: "tel", autoComplete: "tel" })}</Field>
      <div className="lh-form__full"><Field id="a-address1" label={t("address1")} error={err("address1")}>{input("address1", { autoComplete: "address-line1" })}</Field></div>
      <div className="lh-form__full"><Field id="a-address2" label={t("address2")}>{input("address2", { autoComplete: "address-line2" })}</Field></div>
      <Field id="a-city" label={t("city")} error={err("city")}>{input("city", { autoComplete: "address-level2" })}</Field>
      <Field id="a-zoneCode" label={t("province")} error={err("zoneCode")}>
        <select className="lh-select" id="a-zoneCode" name="zoneCode" defaultValue={address?.zoneCode ?? "QC"} aria-invalid={!!err("zoneCode")}>
          {PROVINCES.map((p) => <option key={p} value={p}>{t(`provinces.${p}`)}</option>)}
        </select>
      </Field>
      <Field id="a-zip" label={t("postal")} error={err("zip")}>{input("zip", { autoComplete: "postal-code" })}</Field>
      <Field id="a-country" label={t("country")}><input className="lh-input" id="a-country" value="Canada" readOnly /></Field>
      <label className="lh-choice lh-form__full">
        <input type="checkbox" name="default" defaultChecked={isDefault} />
        <span className="lh-choice__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
        <span>{t("makeDefault")}</span>
      </label>
      <div className="lh-form__submit">
        <button className="lh-btn lh-btn--primary" type="submit" disabled={pending}>{pending ? t("saving") : t("save")}</button>
        <a className="lh-link" href={cancelHref}>{t("cancel")}</a>
      </div>
      <input type="hidden" name="locale" value={locale} />
      {address && <input type="hidden" name="id" value={address.id} />}
    </form>
  );
}

/** Prénom et nom du profil. */
export function ProfileForm({ firstName, lastName }: { firstName: string; lastName: string }) {
  const t = useTranslations("account.profile");
  const locale = useLocale();
  const [state, action, pending] = useActionState<AccountFormState, FormData>(saveProfile, idle);
  const err = (k: string) => state.errors?.[k];
  return (
    <form className="lh-form" action={action} noValidate>
      {state.status === "ok" && <div className="lh-notice lh-notice--success lh-form__full" role="status"><span className="lh-notice__icon"><Icon name="check" /></span><div>{state.message}</div></div>}
      {state.status === "error" && state.message && <div className="lh-notice lh-notice--danger lh-form__full" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{state.message}</div></div>}
      <Field id="p-firstName" label={t("firstName")} error={err("firstName")}>
        <input className="lh-input" id="p-firstName" name="firstName" defaultValue={firstName} autoComplete="given-name" aria-invalid={!!err("firstName")} />
      </Field>
      <Field id="p-lastName" label={t("lastName")} error={err("lastName")}>
        <input className="lh-input" id="p-lastName" name="lastName" defaultValue={lastName} autoComplete="family-name" aria-invalid={!!err("lastName")} />
      </Field>
      <div className="lh-form__submit">
        <button className="lh-btn lh-btn--primary" type="submit" disabled={pending}>{pending ? t("saving") : t("save")}</button>
      </div>
      <input type="hidden" name="locale" value={locale} />
    </form>
  );
}
