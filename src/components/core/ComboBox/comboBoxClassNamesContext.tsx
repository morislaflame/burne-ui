import { createContext, useContext, useMemo } from "react";

import type { ComboBoxClassNames, ComboBoxClassNamesProviderProps } from "./comboBoxTypes";

const ComboBoxClassNamesContext = createContext<ComboBoxClassNames>({});

export function ComboBoxClassNamesProvider({
  classNames,
  children,
}: ComboBoxClassNamesProviderProps) {
  const parent = useContext(ComboBoxClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ComboBoxClassNamesContext.Provider value={merged}>
      {children}
    </ComboBoxClassNamesContext.Provider>
  );
}

export function useComboBoxClassNames(): ComboBoxClassNames {
  return useContext(ComboBoxClassNamesContext);
}
