import { createContext, useContext, useMemo } from "react";

import type {
  ProgressBarClassNames,
  ProgressBarClassNamesProviderProps,
  ProgressBarFieldContextValue,
} from "./progressBarTypes";

const ProgressBarFieldContext = createContext<ProgressBarFieldContextValue | null>(
  null,
);
const ProgressBarClassNamesContext = createContext<ProgressBarClassNames>({});

export function ProgressBarFieldProvider({
  value,
  children,
}: {
  value: ProgressBarFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <ProgressBarFieldContext.Provider value={value}>
      {children}
    </ProgressBarFieldContext.Provider>
  );
}

export function ProgressBarClassNamesProvider({
  classNames,
  children,
}: ProgressBarClassNamesProviderProps) {
  const parent = useContext(ProgressBarClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ProgressBarClassNamesContext.Provider value={merged}>
      {children}
    </ProgressBarClassNamesContext.Provider>
  );
}

export function useProgressBarFieldContext(): ProgressBarFieldContextValue {
  const ctx = useContext(ProgressBarFieldContext);
  if (!ctx) {
    throw new Error("ProgressBar.* components must be inside <ProgressBar>.");
  }
  return ctx;
}

export function useOptionalProgressBarFieldContext() {
  return useContext(ProgressBarFieldContext);
}

export function useProgressBarClassNames(): ProgressBarClassNames {
  return useContext(ProgressBarClassNamesContext);
}

export { ProgressBarFieldContext };
