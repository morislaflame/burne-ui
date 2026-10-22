import { createContext, useContext } from "react";

import type { ThemeMode } from "./themeDefaults";
import type { BurneThemeMode } from "./themeConfig";

export type BurneThemeContextValue = {
  /** User preference: light | dark | system */
  theme: BurneThemeMode;
  /** Resolved light | dark after system preference */
  resolvedTheme: ThemeMode;
  setTheme: (theme: BurneThemeMode) => void;
  /** Element that receives `data-theme` and the kit palette. `null` on the server. */
  root: HTMLElement | null;
};

export const BurneThemeContext = createContext<BurneThemeContextValue | null>(null);

export function useBurneTheme(): BurneThemeContextValue {
  const ctx = useContext(BurneThemeContext);
  if (!ctx) {
    throw new Error("useBurneTheme must be used within ThemeProvider or BurneUIProvider.");
  }
  return ctx;
}

/** Optional hook — returns null outside a provider. */
export function useBurneThemeOptional(): BurneThemeContextValue | null {
  return useContext(BurneThemeContext);
}
