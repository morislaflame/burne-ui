import { createContext, useContext, useMemo } from "react";

import type {
  RadioClassNames,
  RadioClassNamesProviderProps,
  RadioFieldContextValue,
} from "./radioTypes";

const RadioFieldContext = createContext<RadioFieldContextValue | null>(null);
const RadioClassNamesContext = createContext<RadioClassNames>({});

export function RadioFieldProvider({
  value,
  children,
}: {
  value: RadioFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <RadioFieldContext.Provider value={value}>{children}</RadioFieldContext.Provider>
  );
}

export function RadioClassNamesProvider({
  classNames,
  children,
}: RadioClassNamesProviderProps) {
  const parent = useContext(RadioClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <RadioClassNamesContext.Provider value={merged}>
      {children}
    </RadioClassNamesContext.Provider>
  );
}

export function useRadioFieldContext(): RadioFieldContextValue {
  const ctx = useContext(RadioFieldContext);
  if (!ctx) {
    throw new Error("Radio.* должны быть внутри <Radio>.");
  }
  return ctx;
}

export function useOptionalRadioFieldContext(): RadioFieldContextValue | null {
  return useContext(RadioFieldContext);
}

export function useRadioClassNames(): RadioClassNames {
  return useContext(RadioClassNamesContext);
}

export { RadioFieldContext };
