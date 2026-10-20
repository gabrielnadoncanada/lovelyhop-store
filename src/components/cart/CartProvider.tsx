"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { addToCart, loadCart, setLineQuantity } from "@/app/actions";
import type { ArtKey, Cart } from "@/lib/types";

type Toast = { name: string; art: ArtKey | null } | null;
type CartContextValue = {
  cart: Cart | null;
  open: boolean;
  setOpen: (v: boolean) => void;
  pending: boolean;
  error: boolean;
  bump: number;
  toast: Toast;
  closeToast: () => void;
  add: (lines: { variantId: string; quantity: number }[], toast: { name: string; art: ArtKey | null }) => void;
  setQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}

/** Le panier se charge dans le navigateur (action serveur) : les pages restent statiques et en cache. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [bump, setBump] = useState(0);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    loadCart(locale).then((c) => alive && setCart(c)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [locale]);

  const closeToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const add = useCallback<CartContextValue["add"]>((lines, t) => {
    setError(false);
    start(async () => {
      try {
        setCart(await addToCart(lines, locale));
        setBump((b) => b + 1);
        setToast(t);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setToast(null), 4000);
      } catch {
        setError(true);
      }
    });
  }, [locale]);

  const setQuantity = useCallback<CartContextValue["setQuantity"]>((lineId, quantity) => {
    setError(false);
    start(async () => {
      try { setCart(await setLineQuantity(lineId, quantity, locale)); } catch { setError(true); }
    });
  }, [locale]);

  const value = useMemo(() => ({ cart, open, setOpen, pending, error, bump, toast, closeToast, add, setQuantity }), [cart, open, pending, error, bump, toast, closeToast, add, setQuantity]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
