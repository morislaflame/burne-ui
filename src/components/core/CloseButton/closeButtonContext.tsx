import { createContext, useContext, useMemo } from "react";

import type {
  CloseButtonClassNames,
  CloseButtonClassNamesProviderProps,
} from "./closeButtonTypes";

const CloseButtonClassNamesContext = createContext<CloseButtonClassNames>({});

export function CloseButtonClassNamesProvider({
  classNames,
  children,
}: CloseButtonClassNamesProviderProps) {
  const parent = useContext(CloseButtonClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <CloseButtonClassNamesContext.Provider value={merged}>
      {children}
    </CloseButtonClassNamesContext.Provider>
  );
}

export function useCloseButtonClassNames(): CloseButtonClassNames {
  return useContext(CloseButtonClassNamesContext);
}
