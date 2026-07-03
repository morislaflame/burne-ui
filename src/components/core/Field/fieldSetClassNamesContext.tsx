import { createContext, useContext, useMemo } from "react";

import type { FieldSetClassNames, FieldSetClassNamesProviderProps } from "./fieldTypes";

const FieldSetClassNamesContext = createContext<FieldSetClassNames>({});

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
