// Tujuan      : Deteksi layout variant berdasarkan lebar layar (mobile vs desktop/signage)
// Caller      : app/leaderboard/page.tsx
// Dependensi  : -
// Main Exports: useLayoutVariant()
// Side Effects: -

"use client";

import { useState, useEffect } from "react";

export type LayoutVariant = "default" | "desktop";

/**
 * Mengembalikan "desktop" jika layar >= 1024px, otherwise "default" (mobile).
 * Reactive terhadap perubahan ukuran window.
 */
export function useLayoutVariant(): LayoutVariant {
  const [variant, setVariant] = useState<LayoutVariant>("default");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setVariant(mq.matches ? "desktop" : "default");

    const handler = (e: MediaQueryListEvent) =>
      setVariant(e.matches ? "desktop" : "default");

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return variant;
}
