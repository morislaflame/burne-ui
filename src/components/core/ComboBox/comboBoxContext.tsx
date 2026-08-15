import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  ComboBoxClassNames,
  ComboBoxClassNamesProviderProps,
  ComboBoxContextValue,
  ComboBoxFieldContextValue,
} from "./comboBoxTypes";

const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);
const ComboBoxFieldContext = createContext<ComboBoxFieldContextValue | null>(null);
const ComboBoxClassNamesContext = createContext<ComboBoxClassNames>({});

export function ComboBoxProvider({
  value,
  children,
}: {
  value: ComboBoxContextValue;
  children: ReactNode;
}) {
  return (
    <ComboBoxContext.Provider value={value}>{children}</ComboBoxContext.Provider>
  );
}

export function useComboBoxContext(): ComboBoxContextValue {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) throw new Error("ComboBox.* must be inside <ComboBox>.");
  return ctx;
}

export function ComboBoxFieldProvider({
  value,
  children,
}: {
  value: ComboBoxFieldContextValue;
  children: ReactNode;
}) {
  return (
    <ComboBoxFieldContext.Provider value={value}>{children}</ComboBoxFieldContext.Provider>
  );
}

export function useComboBoxFieldContext(): ComboBoxFieldContextValue {
  const ctx = useContext(ComboBoxFieldContext);
  if (!ctx) throw new Error("ComboBox compound-parts must be inside <ComboBox>.");
  return ctx;
}

export function ComboBoxClassNamesProvider({
  classNames,
  children,
}: ComboBoxClassNamesProviderProps) {
  const parent = useContext(ComboBoxClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ComboBoxClassNamesContext.Provider value={merged}>
      {children}
    </ComboBoxClassNamesContext.Provider>
  );
}

export function useComboBoxClassNames(): ComboBoxClassNames {
  return useContext(ComboBoxClassNamesContext);
}

/** Scope only. Defaults and host play live in `comboBoxAnimations.ts`. */
export const {
  MotionScopeProvider: ComboBoxMotionProvider,
  useMotionScope: useComboBoxMotionScope,
  useOptionalMotionScope: useOptionalComboBoxMotionScope,
} = createMotionScope("ComboBox");
