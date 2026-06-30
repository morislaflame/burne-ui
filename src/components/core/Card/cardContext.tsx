import { createContext, useContext, useMemo } from "react";

import type { CardClassNames, CardClassNamesProviderProps } from "./cardTypes";

const CardClassNamesContext = createContext<CardClassNames>({});

export function CardClassNamesProvider({
  classNames,
  children,
}: CardClassNamesProviderProps) {
  const parent = useContext(CardClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <CardClassNamesContext.Provider value={merged}>
      {children}
    </CardClassNamesContext.Provider>
  );
}

export function useCardClassNames(): CardClassNames {
  return useContext(CardClassNamesContext);
}
