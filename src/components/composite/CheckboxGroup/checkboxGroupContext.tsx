import { createContext, useContext } from "react";

export type CheckboxGroupSelection = "multiple" | "single";

export type CheckboxGroupContextValue = {
  selection: CheckboxGroupSelection;
  disabled: boolean;
  isRequired: boolean;
  hintId: string;
  errorId: string;
  /** Only for `selection="single"`. */
  selectedValue: string | undefined;
  /** Only for `selection="single"`. */
  selectSingleValue: (value: string, checked: boolean) => void;
  /** First option claims native `required` when `isRequired` (single selection only). */
  claimRequiredAnchor: () => boolean;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

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
