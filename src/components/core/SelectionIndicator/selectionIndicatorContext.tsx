import { createContext, useContext, type ReactNode } from "react";

import type { SelectionIndicatorContextValue } from "./selectionIndicatorTypes";

const SelectionIndicatorContext = createContext<SelectionIndicatorContextValue | null>(null);

export function SelectionIndicatorProvider({
  value,
  children,
}: {
  value: SelectionIndicatorContextValue;
  children: ReactNode;
}) {
  return (
    <SelectionIndicatorContext.Provider value={value}>{children}</SelectionIndicatorContext.Provider>
  );
}

export function useSelectionIndicatorContext(): SelectionIndicatorContextValue {
  const ctx = useContext(SelectionIndicatorContext);
  if (!ctx) {
    throw new Error("SelectionIndicator.* parts must be inside <SelectionIndicator>.");
  }
  return ctx;
}
