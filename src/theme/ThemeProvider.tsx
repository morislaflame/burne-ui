import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
 
import type { MotionConfig } from "@/components/core/utils/motionConfig";
import { MotionConfigProvider } from "@/components/core/utils/motionConfigContext";
import { SkinProvider, type SkinProviderProps } from "@/skins/skinContext";
 
import { resolveTheme, DEFAULT_THEME_STORAGE_KEY, type BurneThemeMode } from "./themeConfig";
import type { ThemeMode } from "./themeDefaults";
import { BurneThemeContext, type BurneThemeContextValue } from "./themeContext";

export type { BurneThemeContextValue } from "./themeContext";
export { useBurneTheme, useBurneThemeOptional } from "./themeContext";
 
function readStoredTheme(storageKey: string | null): BurneThemeMode | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    /* ignore */
  }
  return null;
}
 
function writeStoredTheme(storageKey: string | null, theme: BurneThemeMode) {
  if (!storageKey || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    /* ignore */
  }
}
 
/**
 * Light sets `data-theme="light"`.
 * Dark on `<html>` removes the attribute (`:root` is the dark sheet).
 * A nested root sets `data-theme="dark"` so a light page can hold a dark island.
 */
export function applyThemeMode(theme: ThemeMode, root?: HTMLElement) {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  if (theme === "light") {
    target.dataset.theme = "light";
    return;
  }
  if (target === document.documentElement) {
    delete target.dataset.theme;
    return;
  }
  target.dataset.theme = "dark";
}
 
export type ThemeProviderProps = {
  children: ReactNode;
  /** Controlled theme. When set, `defaultTheme` is ignored. */
  theme?: BurneThemeMode;
  /** Uncontrolled initial theme. @default "dark" */
  defaultTheme?: BurneThemeMode;
  /**
   * localStorage key for persistence.
   * Pass `null` to disable. @default "burne-ui-theme"
   */
  storageKey?: string | null;
  /** Element that receives `data-theme`. @default document.documentElement */
  root?: HTMLElement | null;
  onThemeChange?: (theme: BurneThemeMode) => void;
  /**
   * GSAP overlay for this tree (and portals via React context).
   * Unspecified keys inherit the parent overlay or `configureMotion()`.
   * Does not write CSS tokens — use `applyThemeTokens` / `BurneUIProvider` for `--motion-surface-duration`.
   */
  motion?: Partial<MotionConfig> | null;
  /**
   * Active skin for this tree. `null` writes the kit baseline for ancestor tokens.
   * Omit to leave the parent skin scope unchanged.
   */
  skin?: SkinProviderProps["skin"];
  /** Registered for the tree. Does not activate a skin by itself. */
  skins?: SkinProviderProps["skins"];
};
 
export function ThemeProvider({
  children,
  theme: themeProp,
  defaultTheme = "dark",
  storageKey = DEFAULT_THEME_STORAGE_KEY,
  root = null,
  onThemeChange,
  motion,
  skin,
  skins,
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<BurneThemeMode>(() => {
    return readStoredTheme(storageKey) ?? defaultTheme;
  });
  const [systemRevision, setSystemRevision] = useState(0);
 
  const theme = themeProp ?? uncontrolled;
  const resolvedTheme = useMemo(() => {
    // `systemRevision` is not read: it recomputes `resolveTheme("system")`
    // when `prefers-color-scheme` changes.
    void systemRevision;
    return resolveTheme(theme);
  }, [theme, systemRevision]);
 
  const setTheme = useCallback(
    (next: BurneThemeMode) => {
      if (themeProp === undefined) {
        setUncontrolled(next);
      }
      writeStoredTheme(storageKey, next);
      onThemeChange?.(next);
    },
    [themeProp, storageKey, onThemeChange],
  );
 
  useLayoutEffect(() => {
    const el = root ?? (typeof document !== "undefined" ? document.documentElement : null);
    if (!el) return;
    applyThemeMode(resolvedTheme, el);
  }, [resolvedTheme, root]);
 
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      setSystemRevision((revision) => revision + 1);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);
 
  const themeRoot =
    root ?? (typeof document !== "undefined" ? document.documentElement : null);
  const value = useMemo<BurneThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, root: themeRoot }),
    [theme, resolvedTheme, setTheme, themeRoot],
  );
 
  const motionTree = <MotionConfigProvider motion={motion}>{children}</MotionConfigProvider>;
  const skinned = skin !== undefined || (skins != null && skins.length > 0);

  return (
    <BurneThemeContext.Provider value={value}>
      {skinned ? (
        <SkinProvider skin={skin} skins={skins}>{motionTree}</SkinProvider>
      ) : (
        motionTree
      )}
    </BurneThemeContext.Provider>
  );
}
 
 