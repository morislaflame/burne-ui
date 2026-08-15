import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  DisclosureClassNames,
  DisclosureClassNamesProviderProps,
  DisclosureContextValue,
  DisclosureGroupContextValue,
} from "./disclosureTypes";

const DisclosureContext = createContext<DisclosureContextValue | null>(null);
const DisclosureGroupContext = createContext<DisclosureGroupContextValue | null>(null);
const DisclosureClassNamesContext = createContext<DisclosureClassNames>({});

export function DisclosureProvider({
  value,
  children,
}: {
  value: DisclosureContextValue;
  children: ReactNode;
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

export function DisclosureGroupProvider({
  value,
  children,
}: {
  value: DisclosureGroupContextValue;
  children: ReactNode;
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

export function useDisclosureClassNames(): DisclosureClassNames {
  return useContext(DisclosureClassNamesContext);
}

/** Scope only. Defaults and host play live in `disclosureAnimations.ts`. */
export const {
  MotionScopeProvider: DisclosureMotionProvider,
  useMotionScope: useDisclosureMotionScope,
  useOptionalMotionScope: useOptionalDisclosureMotionScope,
} = createMotionScope("Disclosure");
