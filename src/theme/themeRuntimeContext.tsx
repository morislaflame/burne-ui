import {
  createContext,
  createElement,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { BurneThemeConfig } from "./themeConfig";
import type { ThemeMode } from "./themeDefaults";

export type BurneThemeRuntimeContextValue = {
  /** Config supplied to BurneUIProvider before a temporary preview is applied. */
  baseConfig: BurneThemeConfig;
  /** Config currently rendered by BurneUIProvider. */
  config: BurneThemeConfig;
  previewConfig: BurneThemeConfig | null;
  resolvedTheme: ThemeMode;
  setPreviewConfig: Dispatch<SetStateAction<BurneThemeConfig | null>>;
  clearPreview: () => void;
};

const BurneThemeRuntimeContext = createContext<BurneThemeRuntimeContextValue | null>(null);

export function BurneThemeRuntimeContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: BurneThemeRuntimeContextValue;
}) {
  return createElement(BurneThemeRuntimeContext.Provider, { value }, children);
}

export function useBurneThemeRuntime(): BurneThemeRuntimeContextValue {
  const context = useContext(BurneThemeRuntimeContext);
  if (!context) {
    throw new Error("useBurneThemeRuntime must be used within BurneUIProvider.");
  }
  return context;
}

export function useBurneThemeRuntimeOptional(): BurneThemeRuntimeContextValue | null {
  return useContext(BurneThemeRuntimeContext);
}
