import { createContext, useContext, useMemo } from "react";

import type {
  InputClassNames,
  InputClassNamesProviderProps,
  InputFieldContextValue,
} from "./inputTypes";

const InputFieldContext = createContext<InputFieldContextValue | null>(null);
const InputClassNamesContext = createContext<InputClassNames>({});

export function InputFieldProvider({
  value,
  children,
}: {
  value: InputFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <InputFieldContext.Provider value={value}>{children}</InputFieldContext.Provider>
  );
}

export function InputClassNamesProvider({
  classNames,
  children,
}: InputClassNamesProviderProps) {
  const parent = useContext(InputClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <InputClassNamesContext.Provider value={merged}>
      {children}
    </InputClassNamesContext.Provider>
  );
}

export function useInputFieldContext(): InputFieldContextValue {
  const ctx = useContext(InputFieldContext);
  if (!ctx) {
    throw new Error("Input compound parts must be used inside <Input>.");
  }
  return ctx;
}

export function useOptionalInputFieldContext() {
  return useContext(InputFieldContext);
}

export function useInputClassNames(): InputClassNames {
  return useContext(InputClassNamesContext);
}
