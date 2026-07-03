import { createContext, useContext } from "react";

import type { SelectFieldContextValue } from "./selectTypes";

const SelectFieldContext = createContext<SelectFieldContextValue | null>(null);

export function SelectFieldProvider({
  value,
  children,
}: {
  value: SelectFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <SelectFieldContext.Provider value={value}>{children}</SelectFieldContext.Provider>
  );
}

export function useSelectFieldContext(): SelectFieldContextValue {
  const ctx = useContext(SelectFieldContext);
  if (!ctx) throw new Error("Select compound-parts must be inside <Select>.");
  return ctx;
}
