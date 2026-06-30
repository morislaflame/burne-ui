import { createContext, useContext, useMemo } from "react";

import type {
  TextAreaClassNames,
  TextAreaClassNamesProviderProps,
  TextAreaFieldContextValue,
} from "./textAreaTypes";

const TextAreaFieldContext = createContext<TextAreaFieldContextValue | null>(null);
const TextAreaClassNamesContext = createContext<TextAreaClassNames>({});

export function TextAreaFieldProvider({
  value,
  children,
}: {
  value: TextAreaFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <TextAreaFieldContext.Provider value={value}>{children}</TextAreaFieldContext.Provider>
  );
}

export function TextAreaClassNamesProvider({
  classNames,
  children,
}: TextAreaClassNamesProviderProps) {
  const parent = useContext(TextAreaClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <TextAreaClassNamesContext.Provider value={merged}>
      {children}
    </TextAreaClassNamesContext.Provider>
  );
}

export function useTextAreaFieldContext(): TextAreaFieldContextValue {
  const ctx = useContext(TextAreaFieldContext);
  if (!ctx) {
    throw new Error("TextArea compound parts must be inside <TextArea>.");
  }
  return ctx;
}

export function useOptionalTextAreaFieldContext() {
  return useContext(TextAreaFieldContext);
}

export function useTextAreaClassNames(): TextAreaClassNames {
  return useContext(TextAreaClassNamesContext);
}

export { TextAreaFieldContext };
