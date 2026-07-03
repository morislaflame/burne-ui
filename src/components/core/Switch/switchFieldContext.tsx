import { createContext, useContext } from "react";

import type { SwitchFieldContextValue } from "./switchTypes";

const SwitchFieldContext = createContext<SwitchFieldContextValue | null>(null);

export function SwitchFieldProvider({
  value,
  children,
}: {
  value: SwitchFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <SwitchFieldContext.Provider value={value}>{children}</SwitchFieldContext.Provider>
  );
}

export function useSwitchFieldContext(): SwitchFieldContextValue {
  const ctx = useContext(SwitchFieldContext);
  if (!ctx) {
    throw new Error("Switch components must be inside <Switch>.");
  }
  return ctx;
}

export function useOptionalSwitchFieldContext(): SwitchFieldContextValue | null {
  return useContext(SwitchFieldContext);
}

export { SwitchFieldContext };
