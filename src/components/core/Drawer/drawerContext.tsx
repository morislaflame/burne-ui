import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  DrawerClassNames,
  DrawerClassNamesProviderProps,
  DrawerContextValue,
} from "./drawerTypes";

const DrawerContext = createContext<DrawerContextValue | null>(null);
const DrawerClassNamesContext = createContext<DrawerClassNames>({});

export function DrawerProvider({
  value,
  children,
}: {
  value: DrawerContextValue;
  children: React.ReactNode;
}) {
  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

export function DrawerClassNamesProvider({
  classNames,
  children,
}: DrawerClassNamesProviderProps) {
  const parent = useContext(DrawerClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <DrawerClassNamesContext.Provider value={merged}>
      {children}
    </DrawerClassNamesContext.Provider>
  );
}

export function useDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("Drawer.* components must be used inside <Drawer>.");
  }
  return ctx;
}

export function useDrawerClassNames(): DrawerClassNames {
  return useContext(DrawerClassNamesContext);
}

/** Scope only. Defaults and host play live in `drawerAnimations.ts`. */
export const {
  MotionScopeProvider: DrawerMotionProvider,
  useMotionScope: useDrawerMotionScope,
  useOptionalMotionScope: useOptionalDrawerMotionScope,
} = createMotionScope("Drawer");
