"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitQuote, type FormState } from "@/app/actions";
import { Icon } from "@/components/ui/icons";
import { TrackOnce } from "@/components/layout/Analytics";

/** Demande de soumission CPE (composant QuoteForm). */
export function QuoteForm() {
  const t = useTranslations("daycares");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(submitQuote, { status: "idle" });
  const err = (k: string) => state.errors?.[k];
  const field = (k: string) => (err(k) ? "lh-field is-error" : "lh-field");
  const help = (k: string) => err(k) && <span className="lh-help" id={`q-${k}-h`}><Icon name="error" />{err(k)}</span>;
  const check = <span className="lh-choice__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>;

  if (state.status === "ok") {
    return (
      <div className="lh-notice lh-notice--success" role="status">
        <TrackOnce event="quote_submitted" properties={{ locale }} />
        <span className="lh-notice__icon"><Icon name="check" /></span>
        <div><span className="lh-notice__title">{t("okTitle")}</span>{t("okText")}</div>
      </div>
    );
  }
  return (
    <form className="lh-form" action={action} noValidate>
      {state.message && <div className="lh-notice lh-notice--danger lh-form__full" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{state.message}</div></div>}
      <div className="lh-form__section"><b>1</b><h3>{t("s1")}</h3></div>
      <div className={field("org")}><label className="lh-label" htmlFor="q-org">{t("org")}</label><input className="lh-input" id="q-org" name="org" autoComplete="organization" aria-invalid={!!err("org")} aria-describedby={err("org") ? "q-org-h" : undefined} />{help("org")}</div>
      <div className={field("city")}><label className="lh-label" htmlFor="q-city">{t("city")}</label><input className="lh-input" id="q-city" name="city" autoComplete="address-level2" aria-invalid={!!err("city")} aria-describedby={err("city") ? "q-city-h" : undefined} />{help("city")}</div>
      <div className="lh-field"><label className="lh-label" htmlFor="q-rooms">{t("rooms")}</label><select className="lh-select" id="q-rooms" name="rooms"><option>1</option><option>2–3</option><option>4–6</option><option>7+</option></select></div>
      <fieldset><legend>{t("ages")}</legend><div className="lh-form__choices">
        {(t.raw("agesOptions") as string[]).map((a) => <label className="lh-choice" key={a}><input type="checkbox" name="ages" value={a} />{check}<span>{a}</span></label>)}
      </div></fieldset>
      <fieldset className="lh-form__full"><legend>{t("products")} <span className="lh-opt" style={{ fontWeight: 400, color: "var(--ink-muted)" }}>{t("optional")}</span></legend><div className="lh-form__choices">
        {(t.raw("productsOptions") as string[]).map((p) => <label className="lh-choice" key={p}><input type="checkbox" name="products" value={p} />{check}<span>{p}</span></label>)}
      </div></fieldset>
      <div className="lh-form__section"><b>2</b><h3>{t("s2")}</h3></div>
      <div className={field("name")}><label className="lh-label" htmlFor="q-name">{t("name")}</label><input className="lh-input" id="q-name" name="name" autoComplete="name" aria-invalid={!!err("name")} aria-describedby={err("name") ? "q-name-h" : undefined} />{help("name")}</div>
      <div className={field("email")}><label className="lh-label" htmlFor="q-email">{t("email")}</label><input className="lh-input" id="q-email" name="email" type="email" autoComplete="email" aria-invalid={!!err("email")} aria-describedby={err("email") ? "q-email-h" : undefined} />{help("email")}</div>
      <div className="lh-field"><label className="lh-label" htmlFor="q-phone">{t("phone")} <span className="lh-opt">{t("optional")}</span></label><input className="lh-input" id="q-phone" name="phone" type="tel" autoComplete="tel" /></div>
      <div className="lh-field lh-form__full"><label className="lh-label" htmlFor="q-message">{t("message")} <span className="lh-opt">{t("optional")}</span></label><textarea className="lh-textarea" id="q-message" name="message" placeholder={t("messagePh")} /></div>
      <div className="lh-form__submit">
        <button className="lh-btn lh-btn--primary lh-btn--lg" type="submit" disabled={pending}>{pending ? t("sending") : t("submit")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></button>
        <p>{t("note")}</p>
      </div>
      <input type="hidden" name="locale" value={locale} />
    </form>
  );
}
