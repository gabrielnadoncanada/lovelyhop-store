"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { HEART_PATH } from "@/components/ui/icons";

/**
 * Bandeau de témoins conforme à la Loi 25 : rien de facultatif avant un choix clair,
 * refuser aussi simple qu'accepter. Le choix est gardé 6 mois (cookie lh_consent).
 * Pour charger un outil de mesure seulement après accord : écouter l'événement « lh:consent ».
 */
export type ConsentChoice = { analytics: boolean; marketing: boolean };
const KEY = "lh_consent";

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )lh_consent=([^;]+)/);
  try { return m ? (JSON.parse(decodeURIComponent(m[1])) as ConsentChoice) : null; } catch { return null; }
}

export function openConsent() { window.dispatchEvent(new Event("lh:consent-open")); }

export function Consent() {
  const t = useTranslations("consent");
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ analytics: false, marketing: false });

  useEffect(() => {
    const first = requestAnimationFrame(() => { if (!readConsent()) setShow(true); });
    const open = () => { setChoice(readConsent() ?? { analytics: false, marketing: false }); setPrefs(true); setShow(true); };
    window.addEventListener("lh:consent-open", open);
    return () => { cancelAnimationFrame(first); window.removeEventListener("lh:consent-open", open); };
  }, []);

  const save = (c: ConsentChoice) => {
    document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(c))}; path=/; max-age=${60 * 60 * 24 * 182}; samesite=lax`;
    window.dispatchEvent(new CustomEvent("lh:consent", { detail: c }));
    setShow(false);
    setPrefs(false);
  };

  if (!show) return null;
  const heart = <svg viewBox="0 0 34 30" aria-hidden="true"><path d={HEART_PATH} /></svg>;
  return (
    <div className="lh lh-consent-dock">
      <div className="lh-consent" role="region" aria-label={t("region")}>
        <h2 className="lh-consent__title">{heart}{prefs ? t("prefsTitle") : t("title")}</h2>
        {!prefs ? (
          <>
            <p>{t("text")} <a href="#">{t("policy")}</a></p>
            <div className="lh-consent__actions">
              <button className="lh-btn lh-btn--secondary" type="button" onClick={() => save({ analytics: false, marketing: false })}>{t("refuse")}</button>
              <button className="lh-btn lh-btn--secondary" type="button" onClick={() => save({ analytics: true, marketing: true })}>{t("accept")}</button>
              <button className="lh-link" type="button" onClick={() => setPrefs(true)}>{t("customize")}</button>
            </div>
          </>
        ) : (
          <>
            <div className="lh-consent__prefs">
              <label className="lh-choice"><input type="checkbox" checked disabled /><span className="lh-choice__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span>{t("essential")}<small>{t("essentialHelp")}</small></span></label>
              <label className="lh-choice"><input type="checkbox" checked={choice.analytics} onChange={(e) => setChoice({ ...choice, analytics: e.target.checked })} /><span className="lh-choice__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span>{t("analytics")}<small>{t("analyticsHelp")}</small></span></label>
              <label className="lh-choice"><input type="checkbox" checked={choice.marketing} onChange={(e) => setChoice({ ...choice, marketing: e.target.checked })} /><span className="lh-choice__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span><span>{t("marketing")}<small>{t("marketingHelp")}</small></span></label>
            </div>
            <div className="lh-consent__actions">
              <button className="lh-btn lh-btn--secondary" type="button" onClick={() => save(choice)}>{t("save")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
