import { createContext, useContext, useMemo } from "react";
 
import { createMotionScope } from "@/components/core/utils/slotMotion";
 
import type {
  CheckboxClassNames,
  CheckboxClassNamesProviderProps,
  CheckboxFieldContextValue,
  CheckboxMotion,
} from "./checkboxTypes";
 
const CheckboxFieldContext = createContext<CheckboxFieldContextValue | null>(null);
const CheckboxClassNamesContext = createContext<CheckboxClassNames>({});
 
/** Own scope for chrome (`label` / `hint` / `error`). Indicator keys still embed into SelectionIndicator. */
export const {
  MotionScopeProvider: CheckboxMotionProvider,
  useMotionScope: useCheckboxMotionScope,
  useOptionalMotionScope: useOptionalCheckboxMotionScope,
} = createMotionScope("Checkbox");
 
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
 
export function useCheckboxMotion(): CheckboxMotion | undefined {
  return useOptionalCheckboxMotionScope()?.getRootMotion() as CheckboxMotion | undefined;
}
 