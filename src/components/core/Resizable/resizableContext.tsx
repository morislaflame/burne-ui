import { createContext, useContext, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { ResizableLayoutValue } from "./resizableTypes";

/** Scope only. Defaults and host play live in `resizableAnimations.ts`. */
export const {
  MotionScopeProvider: ResizableMotionProvider,
  useMotionScope: useResizableMotionScope,
} = createMotionScope("Resizable");

const ResizableLayoutContext = createContext<ResizableLayoutValue | null>(null);

export function ResizableLayoutProvider({
  value,
  children,
}: {
  value: ResizableLayoutValue;
  children: ReactNode;
}) {
  return (
    <ResizableLayoutContext.Provider value={value}>{children}</ResizableLayoutContext.Provider>
  );
}

export function useResizableLayout(): ResizableLayoutValue {
  const value = useContext(ResizableLayoutContext);
  if (!value) {
    throw new Error("Resizable.Panel and Resizable.Handle must render inside Resizable");
  }
  return value;
}
