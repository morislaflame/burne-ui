import { createContext, useContext } from "react";

import type { DisclosureContextValue } from "./disclosureTypes";

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

export function DisclosureProvider({
  value,
  children,
}: {
  value: DisclosureContextValue;
  children: React.ReactNode;
}) {
  return (
    <DisclosureContext.Provider value={value}>{children}</DisclosureContext.Provider>
  );
}

export function useDisclosureContext(): DisclosureContextValue {
  const ctx = useContext(DisclosureContext);
  if (!ctx) throw new Error("Disclosure parts must be inside <Disclosure>.");
  return ctx;
}
