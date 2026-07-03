import { createContext, useContext, useMemo } from "react";

import type { SwitchClassNames, SwitchClassNamesProviderProps } from "./switchTypes";

const SwitchClassNamesContext = createContext<SwitchClassNames>({});

export function SwitchClassNamesProvider({
  classNames,
  children,
}: SwitchClassNamesProviderProps) {
  const parent = useContext(SwitchClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <SwitchClassNamesContext.Provider value={merged}>
      {children}
    </SwitchClassNamesContext.Provider>
  );
}

export function useSwitchClassNames(): SwitchClassNames {
  return useContext(SwitchClassNamesContext);
}
