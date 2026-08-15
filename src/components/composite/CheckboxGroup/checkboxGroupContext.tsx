import { createContext, useContext, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";
import { createOptionGroupClassNamesContext } from "@/components/composite/utils/optionGroupClassNames";

import type { CheckboxGroupClassNames, CheckboxGroupContextValue } from "./checkboxGroupTypes";

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

const {
  Provider: CheckboxGroupClassNamesProvider,
  useClassNames: useCheckboxGroupClassNames,
} = createOptionGroupClassNamesContext<CheckboxGroupClassNames>();

export { CheckboxGroupClassNamesProvider, useCheckboxGroupClassNames };

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

/** Scope only. Defaults and host play live in `checkboxGroupAnimations.ts`. */
export const {
  MotionScopeProvider: CheckboxGroupMotionProvider,
  useMotionScope: useCheckboxGroupMotionScope,
  useOptionalMotionScope: useOptionalCheckboxGroupMotionScope,
} = createMotionScope("CheckboxGroup");

export { CheckboxGroupContext };
