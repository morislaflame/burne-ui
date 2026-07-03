import { createContext, useContext, useMemo } from "react";

import type { BadgeClassNames, BadgeClassNamesProviderProps } from "./badgeTypes";

const BadgeClassNamesContext = createContext<BadgeClassNames>({});

export function BadgeClassNamesProvider({
  classNames,
  children,
}: BadgeClassNamesProviderProps) {
  const parent = useContext(BadgeClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <BadgeClassNamesContext.Provider value={merged}>
      {children}
    </BadgeClassNamesContext.Provider>
  );
}

export function useBadgeClassNames(): BadgeClassNames {
  return useContext(BadgeClassNamesContext);
}
