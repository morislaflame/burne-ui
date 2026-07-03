import { createContext, useContext } from "react";

import type { BadgeLiftContextValue, BadgeLiftTargetProviderProps } from "./badgeTypes";

const BadgeLiftTargetContext = createContext<BadgeLiftContextValue | null>(null);

export function useBadgeLiftContext() {
  return useContext(BadgeLiftTargetContext);
}

export function BadgeLiftTargetProvider({
  value,
  children,
}: BadgeLiftTargetProviderProps) {
  return (
    <BadgeLiftTargetContext.Provider value={value}>
      {children}
    </BadgeLiftTargetContext.Provider>
  );
}
