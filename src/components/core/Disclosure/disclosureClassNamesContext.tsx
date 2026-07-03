import { createContext, useContext, useMemo } from "react";

import type { DisclosureClassNames, DisclosureClassNamesProviderProps } from "./disclosureTypes";

const DisclosureClassNamesContext = createContext<DisclosureClassNames>({});

export function DisclosureClassNamesProvider({
  classNames,
  children,
}: DisclosureClassNamesProviderProps) {
  const parent = useContext(DisclosureClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <DisclosureClassNamesContext.Provider value={merged}>
      {children}
    </DisclosureClassNamesContext.Provider>
  );
}

export function useDisclosureClassNames(): DisclosureClassNames {
  return useContext(DisclosureClassNamesContext);
}
