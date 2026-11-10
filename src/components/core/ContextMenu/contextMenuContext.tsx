import { createContext, useContext } from "react";

import type { ContextMenuAnchorProviderProps, ContextMenuAnchorContextValue } from "./contextMenuTypes";

const ContextMenuAnchorContext = createContext<ContextMenuAnchorContextValue | null>(null);

export function ContextMenuAnchorProvider({
  anchorRef,
  children,
}: ContextMenuAnchorProviderProps) {
  return (
    <ContextMenuAnchorContext.Provider value={anchorRef}>
      {children}
    </ContextMenuAnchorContext.Provider>
  );
}

export function useContextMenuAnchor(): ContextMenuAnchorContextValue {
  const anchorRef = useContext(ContextMenuAnchorContext);
  if (!anchorRef) {
    throw new Error("ContextMenu parts must render inside ContextMenu");
  }
  return anchorRef;
}
