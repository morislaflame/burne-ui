import { createContext, useContext } from "react";

import type { InputSize, InputStatus } from "@/components/core/Input/Input";

export type InputFieldContextValue = {
  inputId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  isRequired: boolean;
  status: InputStatus;
  size: InputSize;
};

const InputFieldContext = createContext<InputFieldContextValue | null>(null);

export function useInputFieldContext() {
  const ctx = useContext(InputFieldContext);
  if (!ctx) {
    throw new Error("Input compound-части должны быть внутри <Input>.");
  }
  return ctx;
}

export function useOptionalInputFieldContext() {
  return useContext(InputFieldContext);
}

export { InputFieldContext };
