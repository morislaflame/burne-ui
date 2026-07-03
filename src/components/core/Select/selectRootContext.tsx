import { createContext, useContext } from "react";

import type { SelectContextValue } from "./selectTypes";

const SelectContext = createContext<SelectContextValue | null>(null);

export function SelectProvider({
  value,
  children,
}: {
  value: SelectContextValue;
  children: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  );
}

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.* must be inside <Select>.");
  return ctx;
}
