import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { ComponentSize } from "@/components/core/utils/componentSize";

import type {
  FieldClassNames,
  FieldClassNamesProviderProps,
  FieldSetClassNames,
  FieldSetClassNamesProviderProps,
} from "./fieldTypes";

const FieldClassNamesContext = createContext<FieldClassNames>({});
const FieldSetClassNamesContext = createContext<FieldSetClassNames>({});
const FieldSetSizeContext = createContext<ComponentSize>("base");

export function FieldClassNamesProvider({
  classNames,
  children,
}: FieldClassNamesProviderProps) {
  const parent = useContext(FieldClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <FieldClassNamesContext.Provider value={merged}>
      {children}
    </FieldClassNamesContext.Provider>
  );
}

export function useFieldClassNames(): FieldClassNames {
  return useContext(FieldClassNamesContext);
}

export function FieldSetClassNamesProvider({
  classNames,
  children,
}: FieldSetClassNamesProviderProps) {
  const parent = useContext(FieldSetClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <FieldSetClassNamesContext.Provider value={merged}>
      {children}
    </FieldSetClassNamesContext.Provider>
  );
}

export function useFieldSetClassNames(): FieldSetClassNames {
  return useContext(FieldSetClassNamesContext);
}

export function FieldSetSizeProvider({
  size,
  children,
}: {
  size: ComponentSize;
  children: ReactNode;
}) {
  return (
    <FieldSetSizeContext.Provider value={size}>{children}</FieldSetSizeContext.Provider>
  );
}

export function useFieldSetSize(): ComponentSize {
  return useContext(FieldSetSizeContext);
}
