import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { MotionConfig } from "@/components/core/utils/motionConfig";
import { Toast } from "@/components/core/Toast";
import type { ToastProviderProps } from "@/components/core/Toast/toastTypes";

import { BurneLabelsProvider } from "./BurneLabelsProvider";
import type { BurneLabels } from "./burneLabels";
import { applyBurneThemeConfig, clearCustomThemeTokens, type BurneThemeConfig, type BurneThemeMode, type CustomThemeTokens, type ThemeTokenOverrides } from "./themeConfig";
import { applyThemeMode, ThemeProvider, useBurneTheme, type ThemeProviderProps } from "./ThemeProvider";
import { applyThemeTokens, clearThemeInlineTokens, createDefaultThemeState } from "./themeDefaults";
import { BurneThemeRuntimeContextProvider, type BurneThemeRuntimeContextValue } from "./themeRuntimeContext";

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
  customTokens?: CustomThemeTokens;
  motion?: Partial<MotionConfig>;
  /**
   * Override default accessible / UI strings (Close, Search, Pagination, …).
   * Merged over English defaults. Prop wins over `config.labels`.
   */
  labels?: Partial<BurneLabels>;
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
  const { config, theme, tokens, customTokens, motion, toast, storageKey, labels } = props;
  return {
    theme: theme ?? config?.theme ?? "dark",
    storageKey: storageKey !== undefined ? storageKey : (config?.storageKey ?? "burne-ui-theme"),
    tokens: tokens ?? config?.tokens,
    colors: config?.colors,
    customTokens: customTokens ?? config?.customTokens,
    motion: motion ?? config?.motion,
    toast: toast !== undefined ? toast : (config?.toast ?? true),
    labels: labels ?? config?.labels,
  };
}

function BurneUIRuntime({
  children,
  resolvedConfig,
  root,
}: {
  children: ReactNode;
  resolvedConfig: BurneThemeConfig;
  root?: HTMLElement | null;
}) {
  const { resolvedTheme } = useBurneTheme();
  const [previewConfig, setPreviewConfig] = useState<BurneThemeConfig | null>(null);
  const didApplyOverrides = useRef(false);
  const clearPreview = useCallback(() => setPreviewConfig(null), []);
  const effectiveConfig = previewConfig ?? resolvedConfig;

  useLayoutEffect(() => {
    // Skip when no overrides — keep CSS from `burne-ui/styles.css` / user overrides file.
    if (
      !effectiveConfig.tokens &&
      !effectiveConfig.motion &&
      !effectiveConfig.colors &&
      !effectiveConfig.customTokens
    ) {
      if (didApplyOverrides.current) {
        const target = root ?? (typeof document !== "undefined" ? document.documentElement : null);
        if (!target) return;
        applyThemeTokens(createDefaultThemeState(resolvedTheme), target);
        clearThemeInlineTokens(target);
        clearCustomThemeTokens(target);
        applyThemeMode(resolvedTheme, target);
        didApplyOverrides.current = false;
      }
      return;
    }
    const target = root ?? (typeof document !== "undefined" ? document.documentElement : null);
    if (!target) return;
    applyBurneThemeConfig(effectiveConfig, target, resolvedTheme);
    didApplyOverrides.current = true;
  }, [effectiveConfig, resolvedTheme, root]);

  useLayoutEffect(() => {
    const target = root ?? (typeof document !== "undefined" ? document.documentElement : null);
    return () => {
      if (!didApplyOverrides.current || !target) return;
      applyThemeTokens(createDefaultThemeState(resolvedTheme), target);
      clearThemeInlineTokens(target);
      clearCustomThemeTokens(target);
      didApplyOverrides.current = false;
    };
  }, [root, resolvedTheme]);

  const runtimeValue = useMemo<BurneThemeRuntimeContextValue>(
    () => ({
      baseConfig: resolvedConfig,
      config: effectiveConfig,
      previewConfig,
      resolvedTheme,
      setPreviewConfig,
      clearPreview,
    }),
    [resolvedConfig, effectiveConfig, previewConfig, resolvedTheme, clearPreview],
  );

  return (
    <BurneThemeRuntimeContextProvider value={runtimeValue}>
      {children}
    </BurneThemeRuntimeContextProvider>
  );
}

/**
 * App-level provider: theme (`data-theme`), design tokens, motion, labels, and Toast.
 *
 * @example
 * ```tsx
 * import { BurneUIProvider, BURNE_LABELS_RU } from "burne-ui";
 * import burneTheme from "./burne-theme";
 *
 * <BurneUIProvider config={burneTheme} labels={BURNE_LABELS_RU}>
 *   {children}
 * </BurneUIProvider>
 * ```
 */
export function BurneUIProvider(props: BurneUIProviderProps) {
  const {
    children,
    config,
    theme,
    tokens,
    customTokens,
    motion,
    labels,
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
        customTokens,
        motion,
        labels,
        toast,
        storageKey,
      }),
    [config, theme, tokens, customTokens, motion, labels, toast, storageKey],
  );

  const themeMode = resolvedConfig.theme ?? "dark";
  const resolvedStorageKey =
    resolvedConfig.storageKey === undefined ? "burne-ui-theme" : resolvedConfig.storageKey;

  let content = (
    <BurneUIRuntime resolvedConfig={resolvedConfig} root={root}>{children}</BurneUIRuntime>
  );

  const toastOpt = resolvedConfig.toast ?? true;
  if (toastOpt) {
    const toastProps = typeof toastOpt === "object" ? toastOpt : {};
    content = <Toast.Provider {...toastProps}>{content}</Toast.Provider>;
  }

  content = (
    <BurneLabelsProvider labels={resolvedConfig.labels}>{content}</BurneLabelsProvider>
  );

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
