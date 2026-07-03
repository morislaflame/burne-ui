import { createContext, useContext } from "react";

import type { BadgeDirectAnchorChildProviderProps } from "./badgeTypes";

const BadgeDirectAnchorChildContext = createContext(false);

export function useBadgeDirectAnchorChild() {
  return useContext(BadgeDirectAnchorChildContext);
}

export function BadgeDirectAnchorChildProvider({ children }: BadgeDirectAnchorChildProviderProps) {
  return (
    <BadgeDirectAnchorChildContext.Provider value={true}>
      {children}
    </BadgeDirectAnchorChildContext.Provider>
  );
}
