import { createContext, useContext, useMemo } from "react";

import type { KbdClassNames, KbdClassNamesProviderProps } from "./kbdTypes";

const KbdClassNamesContext = createContext<KbdClassNames>({});

export function KbdClassNamesProvider({
  classNames,
  children,
}: KbdClassNamesProviderProps) {
  const parent = useContext(KbdClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <KbdClassNamesContext.Provider value={merged}>
      {children}
    </KbdClassNamesContext.Provider>
  );
}

export function useKbdClassNames(): KbdClassNames {
  return useContext(KbdClassNamesContext);
}
