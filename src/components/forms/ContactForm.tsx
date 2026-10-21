"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContact, type FormState } from "@/app/actions";
import { Icon } from "@/components/ui/icons";
import { TrackOnce } from "@/components/layout/Analytics";

/** Formulaire « Nous joindre » : nom, courriel, sujet et message. */
export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, { status: "idle" });
  const err = (k: string) => state.errors?.[k];
  const field = (k: string, full = false) => `${err(k) ? "lh-field is-error" : "lh-field"}${full ? " lh-form__full" : ""}`;
  const help = (k: string) => err(k) && <span className="lh-help" id={`c-${k}-h`}><Icon name="error" />{err(k)}</span>;

  if (state.status === "ok") {
    return (
      <div className="lh-notice lh-notice--success" role="status">
        <TrackOnce event="contact_submitted" properties={{ locale }} />
        <span className="lh-notice__icon"><Icon name="check" /></span>
        <div><span className="lh-notice__title">{t("okTitle")}</span>{t("okText")}</div>
      </div>
    );
  }
  return (
    <form className="lh-form" action={action} noValidate>
      {state.message && <div className="lh-notice lh-notice--danger lh-form__full" role="alert"><span className="lh-notice__icon"><Icon name="error" /></span><div>{state.message}</div></div>}
      <div className={field("name")}><label className="lh-label" htmlFor="c-name">{t("name")}</label><input className="lh-input" id="c-name" name="name" autoComplete="name" aria-invalid={!!err("name")} aria-describedby={err("name") ? "c-name-h" : undefined} />{help("name")}</div>
      <div className={field("email")}><label className="lh-label" htmlFor="c-email">{t("email")}</label><input className="lh-input" id="c-email" name="email" type="email" autoComplete="email" aria-invalid={!!err("email")} aria-describedby={err("email") ? "c-email-h" : undefined} />{help("email")}</div>
      <div className="lh-field lh-form__full"><label className="lh-label" htmlFor="c-subject">{t("subject")}</label>
        <select className="lh-select" id="c-subject" name="subject">
          {(t.raw("subjects") as string[]).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className={field("message", true)}><label className="lh-label" htmlFor="c-message">{t("message")}</label><textarea className="lh-textarea" id="c-message" name="message" placeholder={t("messagePh")} aria-invalid={!!err("message")} aria-describedby={err("message") ? "c-message-h" : undefined} />{help("message")}</div>
      <div className="lh-form__submit">
        <button className="lh-btn lh-btn--primary lh-btn--lg" type="submit" disabled={pending}>{pending ? t("sending") : t("submit")}<span className="lh-btn__arrow"><Icon name="arrow" /></span></button>
        <p>{t("note")}</p>
      </div>
      <input type="hidden" name="locale" value={locale} />
    </form>
  );
}
