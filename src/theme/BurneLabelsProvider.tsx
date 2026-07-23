import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  DEFAULT_BURNE_LABELS,
  mergeBurneLabels,
  type BurneLabels,
  type BurneLabelsKey,
} from "./burneLabels";

const BurneLabelsContext = createContext<BurneLabels>(DEFAULT_BURNE_LABELS);

export type BurneLabelsProviderProps = {
  children: ReactNode;
  /** Partial override of default accessible / UI strings. */
  labels?: Partial<BurneLabels>;
};

/**
 * Provides localized default aria / UI strings for burne-ui components.
 * Usually used via `BurneUIProvider` (`labels` prop); stand-alone when you
 * only need strings without theme/toast.
 */
export function BurneLabelsProvider({ children, labels }: BurneLabelsProviderProps) {
  const value = useMemo(() => mergeBurneLabels(labels), [labels]);
  return (
    <BurneLabelsContext.Provider value={value}>{children}</BurneLabelsContext.Provider>
  );
}

/** Full merged label dictionary (defaults + overrides). Safe outside provider. */
export function useBurneLabels(): BurneLabels {
  return useContext(BurneLabelsContext);
}

/** Single label by key. Safe outside provider (falls back to English defaults). */
export function useBurneLabel<K extends BurneLabelsKey>(key: K): BurneLabels[K] {
  return useBurneLabels()[key];
}
