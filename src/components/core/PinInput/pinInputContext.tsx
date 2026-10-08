import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { PinInputClassNames, PinInputContextValue } from "./pinInputTypes";

const PinInputContext = createContext<PinInputContextValue | null>(null);
const PinInputClassNamesContext = createContext<PinInputClassNames>({});

export function PinInputProvider({
  value,
  children,
}: {
  value: PinInputContextValue;
  children: ReactNode;
}) {
  return <PinInputContext.Provider value={value}>{children}</PinInputContext.Provider>;
}

export function usePinInputContext(): PinInputContextValue {
  const value = useContext(PinInputContext);
  if (!value) throw new Error("PinInput parts must be rendered inside PinInput.");
  return value;
}

export function PinInputClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<PinInputClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(PinInputClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <PinInputClassNamesContext.Provider value={merged}>
      {children}
    </PinInputClassNamesContext.Provider>
  );
}

export function usePinInputClassNames(): PinInputClassNames {
  return useContext(PinInputClassNamesContext);
}

/** Scope only. Defaults and host play live in `pinInputAnimations.ts`. */
export const {
  MotionScopeProvider: PinInputMotionProvider,
  useMotionScope: usePinInputMotionScope,
  useOptionalMotionScope: useOptionalPinInputMotionScope,
} = createMotionScope("PinInput");
