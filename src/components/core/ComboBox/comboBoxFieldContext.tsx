import { createContext, useContext } from "react";

import type { ComboBoxFieldContextValue } from "./comboBoxTypes";

const ComboBoxFieldContext = createContext<ComboBoxFieldContextValue | null>(null);

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

export function useComboBoxFieldContext(): ComboBoxFieldContextValue {
  const ctx = useContext(ComboBoxFieldContext);
  if (!ctx) throw new Error("ComboBox compound-parts must be inside <ComboBox>.");
  return ctx;
}
