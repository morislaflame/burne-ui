import { createContext, useContext } from "react";

export type RadioGroupContextValue = {
  name: string;
  disabled: boolean;
  isRequired: boolean;
  hintId: string;
  errorId: string;
  selectedValue: string | undefined;
  selectValue: (value: string | undefined) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

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
