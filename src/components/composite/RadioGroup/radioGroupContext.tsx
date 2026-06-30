import { createContext, useContext, type ReactNode } from "react";

import type { RadioGroupContextValue } from "./radioGroupTypes";

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroupProvider({
  value,
  children,
}: {
  value: RadioGroupContextValue;
  children: ReactNode;
}) {
  return (
    <RadioGroupContext.Provider value={value}>{children}</RadioGroupContext.Provider>
  );
}

export function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("RadioGroup components must be inside <RadioGroup>.");
  }
  return ctx;
}

export function useOptionalRadioGroupContext() {
  return useContext(RadioGroupContext);
}

export { RadioGroupContext };
