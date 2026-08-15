import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { KbdClassNames, KbdClassNamesProviderProps } from "./kbdTypes";

/** Scope only. Defaults and host play live in `kbdAnimations.ts`. */
export const {
  MotionScopeProvider: KbdMotionProvider,
  useMotionScope: useKbdMotionScope,
  useOptionalMotionScope: useOptionalKbdMotionScope,
} = createMotionScope("Kbd");

const KbdClassNamesContext = createContext<KbdClassNames>({});

export function KbdClassNamesProvider({
  classNames,
  children,
}: KbdClassNamesProviderProps) {
  const parent = useContext(KbdClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <KbdClassNamesContext.Provider value={merged}>
      {children}
    </KbdClassNamesContext.Provider>
  );
}

export function useKbdClassNames(): KbdClassNames {
  return useContext(KbdClassNamesContext);
}
