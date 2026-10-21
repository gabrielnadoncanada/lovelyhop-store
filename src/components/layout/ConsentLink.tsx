"use client";

import { openConsent } from "./Consent";

export function ConsentLink({ children }: { children: React.ReactNode }) {
  return <button type="button" onClick={openConsent} style={{ border: 0, background: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }}>{children}</button>;
}
