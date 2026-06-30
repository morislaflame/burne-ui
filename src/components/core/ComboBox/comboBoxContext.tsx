import { createContext, useContext, useMemo } from "react";

import type {
  ComboBoxClassNames,
  ComboBoxClassNamesProviderProps,
  ComboBoxContextValue,
  ComboBoxFieldContextValue,
} from "./comboBoxTypes";

const ComboBoxFieldContext = createContext<ComboBoxFieldContextValue | null>(null);
const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);
const ComboBoxClassNamesContext = createContext<ComboBoxClassNames>({});

export function ComboBoxFieldProvider({
  value,
  children,
}: {
  value: ComboBoxFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <ComboBoxFieldContext.Provider value={value}>{children}</ComboBoxFieldContext.Provider>
  );
}

export function ComboBoxProvider({
  value,
  children,
}: {
  value: ComboBoxContextValue;
  children: React.ReactNode;
}) {
  return (
    <ComboBoxContext.Provider value={value}>{children}</ComboBoxContext.Provider>
  );
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

export function useComboBoxFieldContext(): ComboBoxFieldContextValue {
  const ctx = useContext(ComboBoxFieldContext);
  if (!ctx) throw new Error("ComboBox compound-parts must be inside <ComboBox>.");
  return ctx;
}

export function useComboBoxContext(): ComboBoxContextValue {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) throw new Error("ComboBox.* must be inside <ComboBox>.");
  return ctx;
}

export function useComboBoxClassNames(): ComboBoxClassNames {
  return useContext(ComboBoxClassNamesContext);
}
