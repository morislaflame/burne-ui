import { createContext, useContext, useMemo } from "react";

import type {
  ExpandableClassNames,
  ExpandableClassNamesProviderProps,
  ExpandableContextValue,
} from "./expandableTypes";

const ExpandableContext = createContext<ExpandableContextValue | null>(null);
const ExpandableClassNamesContext = createContext<ExpandableClassNames>({});

export function ExpandableProvider({
  value,
  children,
}: {
  value: ExpandableContextValue;
  children: React.ReactNode;
}) {
  return (
    <ExpandableContext.Provider value={value}>{children}</ExpandableContext.Provider>
  );
}

export function ExpandableClassNamesProvider({
  classNames,
  children,
}: ExpandableClassNamesProviderProps) {
  const parent = useContext(ExpandableClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ExpandableClassNamesContext.Provider value={merged}>
      {children}
    </ExpandableClassNamesContext.Provider>
  );
}

export function useExpandable(): ExpandableContextValue {
  const ctx = useContext(ExpandableContext);
  if (!ctx) {
    throw new Error("Компоненты Expandable должны быть внутри <Expandable>.");
  }
  return ctx;
}

export { useExpandable as useExpandableContext };

export function useExpandableClassNames(): ExpandableClassNames {
  return useContext(ExpandableClassNamesContext);
}
