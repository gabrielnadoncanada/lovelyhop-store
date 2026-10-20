"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { subscribeNewsletter, type FormState } from "@/app/actions";
import { Icon } from "@/components/ui/icons";

export function Newsletter() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { status: "idle" });
  return (
    <div className="lh-news-band">
      <section className="lh-news">
        <span className="lh-news__note" aria-hidden="true">{t("note")}</span>
        <div>
          <h2 className="lh-news__title">{t("title")} <em>{t("em")}</em></h2>
          <p>{t("text")}</p>
        </div>
        <form className="lh-news__form" action={action} noValidate>
          <input type="hidden" name="locale" value={locale} />
          <div className={state.status === "error" ? "lh-field is-error" : "lh-field"}>
            <label className="lh-label lh-sr" htmlFor="nl-email">{t("label")}</label>
            <div className="lh-input-wrap">
              <Icon name="mail" />
              <input className="lh-input lh-input--action" id="nl-email" name="email" type="email" autoComplete="email" placeholder={t("placeholder")} aria-invalid={state.status === "error"} aria-describedby="nl-legal" />
              <button className="lh-btn lh-btn--primary lh-btn--sm" type="submit" disabled={pending}>{t("submit")}</button>
            </div>
          </div>
          <span className="lh-news__legal" id="nl-legal" aria-live="polite">{state.message ?? t("legal")}</span>
        </form>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="lh-news__arc" aria-hidden="true"><img src="/brand/arc-en-ciel.svg" alt="" width={300} height={160} /></div>
      </section>
    </div>
  );
}
