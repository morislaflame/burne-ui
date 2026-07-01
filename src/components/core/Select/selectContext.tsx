import { createContext, useContext, useMemo } from "react";

import type {
  SelectClassNames,
  SelectClassNamesProviderProps,
  SelectContextValue,
  SelectFieldContextValue,
} from "./selectTypes";

const SelectFieldContext = createContext<SelectFieldContextValue | null>(null);
const SelectContext = createContext<SelectContextValue | null>(null);
const SelectClassNamesContext = createContext<SelectClassNames>({});

export function SelectFieldProvider({
  value,
  children,
}: {
  value: SelectFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <SelectFieldContext.Provider value={value}>{children}</SelectFieldContext.Provider>
  );
}

export function SelectProvider({
  value,
  children,
}: {
  value: SelectContextValue;
  children: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  );
}

export function SelectClassNamesProvider({
  classNames,
  children,
}: SelectClassNamesProviderProps) {
  const parent = useContext(SelectClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <SelectClassNamesContext.Provider value={merged}>
      {children}
    </SelectClassNamesContext.Provider>
  );
}

export function useSelectFieldContext(): SelectFieldContextValue {
  const ctx = useContext(SelectFieldContext);
  if (!ctx) throw new Error("Select compound-parts must be inside <Select>.");
  return ctx;
}

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select.* must be inside <Select>.");
  return ctx;
}

export function useSelectClassNames(): SelectClassNames {
  return useContext(SelectClassNamesContext);
}
