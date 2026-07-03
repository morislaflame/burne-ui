import { createContext, useContext, useMemo } from "react";

import type { FieldClassNames, FieldClassNamesProviderProps } from "./fieldTypes";

const FieldClassNamesContext = createContext<FieldClassNames>({});

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
