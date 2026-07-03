import { createContext, useContext } from "react";

import type { ExpandableContextValue } from "./expandableTypes";

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

export function ExpandableProvider({
  value,
  children,
}: {
  value: ExpandableContextValue;
  children: React.ReactNode;
}) {
  return (
    <ExpandableContext.Provider value={value}>{children}</ExpandableContext.Provider>
  );
}

export function useExpandable(): ExpandableContextValue {
  const ctx = useContext(ExpandableContext);
  if (!ctx) {
    throw new Error("Expandable components must be used inside <Expandable>.");
  }
  return ctx;
}

export { useExpandable as useExpandableContext };
