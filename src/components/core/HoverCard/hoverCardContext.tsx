import { createContext, useContext, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { HoverCardHostContextValue } from "./hoverCardTypes";

const HoverCardHostContext = createContext<HoverCardHostContextValue | null>(null);

export function HoverCardHostProvider({
  value,
  children,
}: {
  value: HoverCardHostContextValue;
  children: ReactNode;
}) {
  return <HoverCardHostContext.Provider value={value}>{children}</HoverCardHostContext.Provider>;
}

export function useHoverCardHost(): HoverCardHostContextValue {
  const value = useContext(HoverCardHostContext);
  if (!value) throw new Error("HoverCard parts must be rendered inside HoverCard.");
  return value;
}

/** Scope only. Defaults and trigger registration live in `hoverCardAnimations.ts`. */
export const {
  MotionScopeProvider: HoverCardMotionProvider,
  useMotionScope: useHoverCardMotionScope,
  useOptionalMotionScope: useOptionalHoverCardMotionScope,
} = createMotionScope("HoverCard");
