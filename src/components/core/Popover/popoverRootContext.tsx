import { createContext, useContext } from "react";

import type { PopoverContextValue } from "./popoverTypes";

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function PopoverProvider({
  value,
  children,
}: {
  value: PopoverContextValue;
  children: React.ReactNode;
}) {
  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

export function usePopoverContext(who: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(`${who} must be inside <Popover>.`);
  }
  return ctx;
}
