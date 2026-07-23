import { createElement, type ReactElement } from "react";

import { DEFAULT_THEME_STORAGE_KEY, type BurneThemeMode } from "./themeConfig";

export type ThemeScriptOptions = {
  /**
   * Same key as `ThemeProvider` / `BurneUIProvider` `storageKey`.
   * @default "burne-ui-theme"
   */
  storageKey?: string;
  /**
   * Same as provider `defaultTheme` when storage is empty / invalid.
   * @default "dark"
   */
  defaultTheme?: BurneThemeMode;
};

export type ThemeScriptProps = ThemeScriptOptions & {
  /** CSP nonce for the inline `<script>`. */
  nonce?: string;
};

/**
 * Blocking inline script that applies `data-theme` before first paint.
 * Place in root layout `<head>` (or as first child of `<html>`) with
 * `suppressHydrationWarning` on `<html>` to avoid SSR theme flash.
 */
export function getThemeScript(options: ThemeScriptOptions = {}): string {
  const storageKey = JSON.stringify(options.storageKey ?? DEFAULT_THEME_STORAGE_KEY);
  const defaultTheme = JSON.stringify(options.defaultTheme ?? "dark");

  return `(function(){try{var k=${storageKey};var d=${defaultTheme};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark"||s==="system")?s:d;var r=t==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t;var e=document.documentElement;if(r==="light")e.setAttribute("data-theme","light");else e.removeAttribute("data-theme");}catch(_){}})();`;
}

/**
 * Renders the no-flash theme bootstrap `<script>`.
 * Safe in Server Components (no hooks) — e.g. Next.js App Router `layout.tsx`.
 */
export function ThemeScript({
  storageKey,
  defaultTheme,
  nonce,
}: ThemeScriptProps = {}): ReactElement {
  return createElement("script", {
    nonce,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: getThemeScript({ storageKey, defaultTheme }),
    },
  });
}

export { DEFAULT_THEME_STORAGE_KEY };
