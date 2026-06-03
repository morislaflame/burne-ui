import { createContext, useContext } from "react";

import type { InputSize, InputStatus } from "@/components/core/Input";

export type SelectorFieldContextValue = {
  selectorId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  isRequired: boolean;
  status: InputStatus;
  size: InputSize;
};

const SelectorFieldContext = createContext<SelectorFieldContextValue | null>(null);

export function useSelectorFieldContext() {
  const ctx = useContext(SelectorFieldContext);
  if (!ctx) {
    throw new Error("Selector compound-части должны быть внутри <Selector>.");
  }
  return ctx;
}

export function useOptionalSelectorFieldContext() {
  return useContext(SelectorFieldContext);
}

export { SelectorFieldContext };
