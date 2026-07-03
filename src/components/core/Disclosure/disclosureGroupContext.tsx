import { createContext, useContext } from "react";

import type { DisclosureGroupContextValue } from "./disclosureTypes";

const DisclosureGroupContext = createContext<DisclosureGroupContextValue | null>(null);

export function DisclosureGroupProvider({
  value,
  children,
}: {
  value: DisclosureGroupContextValue;
  children: React.ReactNode;
}) {
  return (
    <DisclosureGroupContext.Provider value={value}>
      {children}
    </DisclosureGroupContext.Provider>
  );
}

export function useDisclosureGroupContext(): DisclosureGroupContextValue | null {
  return useContext(DisclosureGroupContext);
}
