import { createContext, useContext, useMemo } from "react";

import type {
  CheckboxClassNames,
  CheckboxClassNamesProviderProps,
  CheckboxFieldContextValue,
} from "./checkboxTypes";

const CheckboxFieldContext = createContext<CheckboxFieldContextValue | null>(null);
const CheckboxClassNamesContext = createContext<CheckboxClassNames>({});

export function CheckboxFieldProvider({
  value,
  children,
}: {
  value: CheckboxFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <CheckboxFieldContext.Provider value={value}>{children}</CheckboxFieldContext.Provider>
  );
}

export function CheckboxClassNamesProvider({
  classNames,
  children,
}: CheckboxClassNamesProviderProps) {
  const parent = useContext(CheckboxClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <CheckboxClassNamesContext.Provider value={merged}>
      {children}
    </CheckboxClassNamesContext.Provider>
  );
}

export function useCheckboxFieldContext(): CheckboxFieldContextValue {
  const ctx = useContext(CheckboxFieldContext);
  if (!ctx) {
    throw new Error("Checkbox.* parts must be used inside <Checkbox>.");
  }
  return ctx;
}

export function useCheckboxClassNames(): CheckboxClassNames {
  return useContext(CheckboxClassNamesContext);
}
