import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { resolveTheme, type BurneThemeMode } from "./themeConfig";
import type { ThemeMode } from "./themeDefaults";

export type BurneThemeContextValue = {
  /** User preference: light | dark | system */
  theme: BurneThemeMode;
  /** Resolved light | dark after system preference */
  resolvedTheme: ThemeMode;
  setTheme: (theme: BurneThemeMode) => void;
};

const BurneThemeContext = createContext<BurneThemeContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "burne-ui-theme";

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

/** Apply `data-theme` on the root element (light → attribute, dark → remove). */
export function applyThemeMode(theme: ThemeMode, root: HTMLElement = document.documentElement) {
  if (theme === "light") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }
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
};

export function ThemeProvider({
  children,
  theme: themeProp,
  defaultTheme = "dark",
  storageKey = DEFAULT_STORAGE_KEY,
  root = null,
  onThemeChange,
}: ThemeProviderProps) {
  const [uncontrolled, setUncontrolled] = useState<BurneThemeMode>(() => {
    return readStoredTheme(storageKey) ?? defaultTheme;
  });

  const theme = themeProp ?? uncontrolled;
  const resolvedTheme = resolveTheme(theme);

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
      const el = root ?? document.documentElement;
      applyThemeMode(resolveTheme("system"), el);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, root]);

  const value = useMemo<BurneThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return createElement(BurneThemeContext.Provider, { value }, children);
}

export function useBurneTheme(): BurneThemeContextValue {
  const ctx = useContext(BurneThemeContext);
  if (!ctx) {
    throw new Error("useBurneTheme must be used within ThemeProvider or BurneUIProvider.");
  }
  return ctx;
}

/** Optional hook — returns null outside provider (for progressive enhancement). */
export function useBurneThemeOptional(): BurneThemeContextValue | null {
  return useContext(BurneThemeContext);
}
