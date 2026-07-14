import { useMemo, useLayoutEffect, type ReactNode } from "react";

import type { MotionConfig } from "@/components/core/utils/motionConfig";
import { Toast } from "@/components/core/Toast";
import type { ToastProviderProps } from "@/components/core/Toast/toastTypes";

import {
  applyBurneThemeConfig,
  type BurneThemeConfig,
  type BurneThemeMode,
  type ThemeTokenOverrides,
} from "./themeConfig";
import { ThemeProvider, useBurneTheme, type ThemeProviderProps } from "./ThemeProvider";

export type BurneUIProviderProps = {
  children: ReactNode;
  /**
   * Full config object (e.g. imported from a playground-exported `burne-theme.ts`).
   * Individual props below override matching fields from `config`.
   */
  config?: BurneThemeConfig;
  theme?: BurneThemeMode;
  defaultTheme?: BurneThemeMode;
  storageKey?: string | null;
  tokens?: ThemeTokenOverrides;
  motion?: Partial<MotionConfig>;
  /**
   * Wrap with `Toast.Provider`.
   * Pass `false` to skip, or an options object for Toast defaults.
   * @default true
   */
  toast?: boolean | Omit<ToastProviderProps, "children">;
  root?: ThemeProviderProps["root"];
  onThemeChange?: ThemeProviderProps["onThemeChange"];
};

function mergeProviderConfig(props: BurneUIProviderProps): BurneThemeConfig {
  const { config, theme, tokens, motion, toast, storageKey } = props;
  return {
    theme: theme ?? config?.theme ?? "dark",
    storageKey: storageKey !== undefined ? storageKey : (config?.storageKey ?? "burne-ui-theme"),
    tokens: tokens ?? config?.tokens,
    motion: motion ?? config?.motion,
    toast: toast !== undefined ? toast : (config?.toast ?? true),
  };
}

function BurneUIRuntime({
  children,
  resolvedConfig,
}: {
  children: ReactNode;
  resolvedConfig: BurneThemeConfig;
}) {
  const { resolvedTheme } = useBurneTheme();

  useLayoutEffect(() => {
    // Skip when no overrides — keep CSS from `burne-ui/styles.css` / user overrides file.
    if (!resolvedConfig.tokens && !resolvedConfig.motion) return;
    applyBurneThemeConfig(resolvedConfig, document.documentElement, resolvedTheme);
  }, [resolvedConfig, resolvedTheme]);

  return children;
}

/**
 * App-level provider: theme (`data-theme`), design tokens, motion, and Toast.
 *
 * @example
 * ```tsx
 * import { BurneUIProvider } from "burne-ui";
 * import burneTheme from "./burne-theme";
 *
 * <BurneUIProvider config={burneTheme}>{children}</BurneUIProvider>
 * ```
 */
export function BurneUIProvider(props: BurneUIProviderProps) {
  const {
    children,
    config,
    theme,
    tokens,
    motion,
    toast,
    storageKey,
    defaultTheme,
    root,
    onThemeChange,
  } = props;

  const resolvedConfig = useMemo(
    () =>
      mergeProviderConfig({
        children: null,
        config,
        theme,
        tokens,
        motion,
        toast,
        storageKey,
      }),
    [config, theme, tokens, motion, toast, storageKey],
  );

  const themeMode = resolvedConfig.theme ?? "dark";
  const resolvedStorageKey =
    resolvedConfig.storageKey === undefined ? "burne-ui-theme" : resolvedConfig.storageKey;

  let content = (
    <BurneUIRuntime resolvedConfig={resolvedConfig}>{children}</BurneUIRuntime>
  );

  const toastOpt = resolvedConfig.toast ?? true;
  if (toastOpt) {
    const toastProps = typeof toastOpt === "object" ? toastOpt : {};
    content = <Toast.Provider {...toastProps}>{content}</Toast.Provider>;
  }

  return (
    <ThemeProvider
      theme={theme}
      defaultTheme={defaultTheme ?? (themeMode === "system" ? "system" : themeMode)}
      storageKey={resolvedStorageKey}
      root={root}
      onThemeChange={onThemeChange}
    >
      {content}
    </ThemeProvider>
  );
}
