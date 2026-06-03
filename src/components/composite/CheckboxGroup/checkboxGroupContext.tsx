import { createContext, useContext } from "react";

export type CheckboxGroupSelection = "multiple" | "single";

export type CheckboxGroupContextValue = {
  selection: CheckboxGroupSelection;
  disabled: boolean;
  isRequired: boolean;
  hintId: string;
  errorId: string;
  /** Только для `selection="single"`. */
  selectedValue: string | undefined;
  /** Только для `selection="single"`. */
  selectSingleValue: (value: string, checked: boolean) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext() {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) {
    throw new Error("Компоненты CheckboxGroup должны быть внутри <CheckboxGroup>.");
  }
  return ctx;
}

export function useOptionalCheckboxGroupContext() {
  return useContext(CheckboxGroupContext);
}

export { CheckboxGroupContext };
