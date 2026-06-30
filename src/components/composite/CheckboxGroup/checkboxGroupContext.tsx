import { createContext, useContext, type ReactNode } from "react";

import type { CheckboxGroupContextValue } from "./checkboxGroupTypes";

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function CheckboxGroupProvider({
  value,
  children,
}: {
  value: CheckboxGroupContextValue;
  children: ReactNode;
}) {
  return (
    <CheckboxGroupContext.Provider value={value}>{children}</CheckboxGroupContext.Provider>
  );
}

export function useCheckboxGroupContext() {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) {
    throw new Error("CheckboxGroup components must be inside <CheckboxGroup>.");
  }
  return ctx;
}

export function useOptionalCheckboxGroupContext() {
  return useContext(CheckboxGroupContext);
}

export { CheckboxGroupContext };
