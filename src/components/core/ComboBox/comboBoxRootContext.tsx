import { createContext, useContext } from "react";

import type { ComboBoxContextValue } from "./comboBoxTypes";

const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);

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

export function useComboBoxContext(): ComboBoxContextValue {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) throw new Error("ComboBox.* must be inside <ComboBox>.");
  return ctx;
}
