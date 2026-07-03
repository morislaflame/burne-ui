import { createContext, useContext, useMemo } from "react";

import type { ExpandableClassNames, ExpandableClassNamesProviderProps } from "./expandableTypes";

const ExpandableClassNamesContext = createContext<ExpandableClassNames>({});

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

export function useExpandableClassNames(): ExpandableClassNames {
  return useContext(ExpandableClassNamesContext);
}
