import { createContext, useContext } from "react";

import type { PopoverSide } from "./popoverTypes";

const PopoverResolvedSideContext = createContext<PopoverSide>("bottom");

export function PopoverResolvedSideProvider({
  value,
  children,
}: {
  value: PopoverSide;
  children: React.ReactNode;
}) {
  return (
    <PopoverResolvedSideContext.Provider value={value}>
      {children}
    </PopoverResolvedSideContext.Provider>
  );
}

export function usePopoverResolvedSide(): PopoverSide {
  return useContext(PopoverResolvedSideContext);
}
