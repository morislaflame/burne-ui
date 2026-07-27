import { createContext, useContext, useMemo, type ReactNode } from "react";

import type {
  PopoverClassNames,
  PopoverClassNamesProviderProps,
  PopoverContextValue,
  PopoverSide,
} from "./popoverTypes";

const PopoverContext = createContext<PopoverContextValue | null>(null);
const PopoverClassNamesContext = createContext<PopoverClassNames>({});
const PopoverResolvedSideContext = createContext<PopoverSide>("bottom");
/** Content chrome — Header/Body skip panel paddings when `unstyled`. */
const PopoverContentChromeContext = createContext({ unstyled: false });

export function PopoverProvider({
  value,
  children,
}: {
  value: PopoverContextValue;
  children: ReactNode;
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

export function PopoverResolvedSideProvider({
  value,
  children,
}: {
  value: PopoverSide;
  children: ReactNode;
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

export function PopoverContentChromeProvider({
  unstyled,
  children,
}: {
  unstyled: boolean;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ unstyled }), [unstyled]);
  return (
    <PopoverContentChromeContext.Provider value={value}>
      {children}
    </PopoverContentChromeContext.Provider>
  );
}

export function usePopoverContentChrome(): { unstyled: boolean } {
  return useContext(PopoverContentChromeContext);
}
