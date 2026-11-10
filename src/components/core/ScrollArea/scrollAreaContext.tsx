import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { ScrollAreaClassNames, ScrollAreaContextValue } from "./scrollAreaTypes";

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);
const ScrollAreaClassNamesContext = createContext<ScrollAreaClassNames>({});

export function ScrollAreaProvider({
  value,
  children,
}: {
  value: ScrollAreaContextValue;
  children: ReactNode;
}) {
  return <ScrollAreaContext.Provider value={value}>{children}</ScrollAreaContext.Provider>;
}

export function useScrollAreaContext(): ScrollAreaContextValue {
  const value = useContext(ScrollAreaContext);
  if (!value) throw new Error("ScrollArea parts must be rendered inside ScrollArea.");
  return value;
}

export function ScrollAreaClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<ScrollAreaClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(ScrollAreaClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <ScrollAreaClassNamesContext.Provider value={merged}>{children}</ScrollAreaClassNamesContext.Provider>
  );
}

export function useScrollAreaClassNames(): ScrollAreaClassNames {
  return useContext(ScrollAreaClassNamesContext);
}

/** Scope only. Defaults and host play live in `scrollAreaAnimations.ts`. */
export const {
  MotionScopeProvider: ScrollAreaMotionProvider,
  useMotionScope: useScrollAreaMotionScope,
  useOptionalMotionScope: useOptionalScrollAreaMotionScope,
} = createMotionScope("ScrollArea");
