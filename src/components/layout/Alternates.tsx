"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/types";

/**
 * Adresse de la page courante dans l'autre langue (les handles Shopify sont traduits).
 * Chaque page la déclare avec <SetAlternates />, l'en-tête s'en sert pour le lien FR/EN.
 */
type Alt = Partial<Record<Locale, string>>;
const Ctx = createContext<{ alt: Alt; setAlt: (a: Alt) => void }>({ alt: {}, setAlt: () => {} });

export function AlternatesProvider({ children }: { children: React.ReactNode }) {
  const [alt, setAlt] = useState<Alt>({});
  return <Ctx.Provider value={{ alt, setAlt }}>{children}</Ctx.Provider>;
}

export function SetAlternates({ fr, en }: Alt) {
  const { setAlt } = useContext(Ctx);
  useEffect(() => { setAlt({ fr, en }); }, [fr, en, setAlt]);
  return null;
}

export const useAlternates = () => useContext(Ctx).alt;
