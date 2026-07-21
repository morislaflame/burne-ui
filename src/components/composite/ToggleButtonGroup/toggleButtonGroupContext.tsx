import { createContext, useContext, useMemo } from "react";

import type {
  ToggleButtonGroupClassNames,
  ToggleButtonGroupClassNamesProviderProps,
} from "./toggleButtonGroupTypes";

const ToggleButtonGroupClassNamesContext = createContext<ToggleButtonGroupClassNames>({});

export function ToggleButtonGroupClassNamesProvider({
  classNames,
  children,
}: ToggleButtonGroupClassNamesProviderProps) {
  const parent = useContext(ToggleButtonGroupClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ToggleButtonGroupClassNamesContext.Provider value={merged}>
      {children}
    </ToggleButtonGroupClassNamesContext.Provider>
  );
}

export function useToggleButtonGroupClassNames(): ToggleButtonGroupClassNames {
  return useContext(ToggleButtonGroupClassNamesContext);
}
