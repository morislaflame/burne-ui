import { createContext, useContext, useMemo } from "react";

import type { PopoverClassNames, PopoverClassNamesProviderProps } from "./popoverTypes";

const PopoverClassNamesContext = createContext<PopoverClassNames>({});

export function PopoverClassNamesProvider({
  classNames,
  children,
}: PopoverClassNamesProviderProps) {
  const parent = useContext(PopoverClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <PopoverClassNamesContext.Provider value={merged}>
      {children}
    </PopoverClassNamesContext.Provider>
  );
}

export function usePopoverClassNames(): PopoverClassNames {
  return useContext(PopoverClassNamesContext);
}
