import { createContext, useContext, useMemo } from "react";

import type { SelectClassNames, SelectClassNamesProviderProps } from "./selectTypes";

const SelectClassNamesContext = createContext<SelectClassNames>({});

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

export function useSelectClassNames(): SelectClassNames {
  return useContext(SelectClassNamesContext);
}
