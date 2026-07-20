import { createContext, useContext, useMemo } from "react";

import type {
  BadgeClassNames,
  BadgeClassNamesProviderProps,
  BadgeDirectAnchorChildProviderProps,
  BadgeLiftContextValue,
  BadgeLiftTargetProviderProps,
} from "./badgeTypes";

const BadgeLiftTargetContext = createContext<BadgeLiftContextValue | null>(null);
const BadgeDirectAnchorChildContext = createContext(false);
const BadgeClassNamesContext = createContext<BadgeClassNames>({});

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
