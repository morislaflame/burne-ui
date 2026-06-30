import { createContext, useContext, useMemo } from "react";

import type {
  DisclosureClassNames,
  DisclosureClassNamesProviderProps,
  DisclosureContextValue,
  DisclosureGroupContextValue,
} from "./disclosureTypes";

const DisclosureGroupContext = createContext<DisclosureGroupContextValue | null>(null);
const DisclosureContext = createContext<DisclosureContextValue | null>(null);
const DisclosureClassNamesContext = createContext<DisclosureClassNames>({});

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

export function DisclosureClassNamesProvider({
  classNames,
  children,
}: DisclosureClassNamesProviderProps) {
  const parent = useContext(DisclosureClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <DisclosureClassNamesContext.Provider value={merged}>
      {children}
    </DisclosureClassNamesContext.Provider>
  );
}

export function useDisclosureGroupContext(): DisclosureGroupContextValue | null {
  return useContext(DisclosureGroupContext);
}

export function useDisclosureContext(): DisclosureContextValue {
  const ctx = useContext(DisclosureContext);
  if (!ctx) throw new Error("Disclosure parts must be inside <Disclosure>.");
  return ctx;
}

export function useDisclosureClassNames(): DisclosureClassNames {
  return useContext(DisclosureClassNamesContext);
}
