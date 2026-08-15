import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  ToggleButtonClassNames,
  ToggleButtonContextValue,
  ToggleButtonGroupContextValue,
} from "./toggleButtonTypes";

/** Scope only. Defaults and host play live in `toggleButtonAnimations.ts`. */
export const {
  MotionScopeProvider: ToggleButtonMotionProvider,
  useMotionScope: useToggleButtonMotionScope,
  useOptionalMotionScope: useOptionalToggleButtonMotionScope,
} = createMotionScope("ToggleButton");

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | null>(null);
const ToggleButtonContext = createContext<ToggleButtonContextValue | null>(null);
const ToggleButtonClassNamesContext = createContext<ToggleButtonClassNames>({});

export function ToggleButtonGroupProvider({
  value,
  children,
}: {
  value: ToggleButtonGroupContextValue;
  children: ReactNode;
}) {
  return (
    <ToggleButtonGroupContext.Provider value={value}>
      {children}
    </ToggleButtonGroupContext.Provider>
  );
}

export function useOptionalToggleButtonGroupContext() {
  return useContext(ToggleButtonGroupContext);
}

function useToggleButtonGroupContext(): ToggleButtonGroupContextValue {
  const ctx = useContext(ToggleButtonGroupContext);
  if (!ctx) {
    throw new Error("ToggleButton with `value` must be inside <ToggleButtonGroup>.");
  }
  return ctx;
}

export function ToggleButtonClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<ToggleButtonClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(ToggleButtonClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ToggleButtonClassNamesContext.Provider value={merged}>
      {children}
    </ToggleButtonClassNamesContext.Provider>
  );
}

export function useToggleButtonClassNames(): ToggleButtonClassNames {
  return useContext(ToggleButtonClassNamesContext);
}

export function useOptionalToggleButtonContext(): ToggleButtonContextValue | null {
  return useContext(ToggleButtonContext);
}

export function ToggleButtonContextProvider({
  value,
  children,
}: {
  value: ToggleButtonContextValue;
  children: ReactNode;
}) {
  return <ToggleButtonContext.Provider value={value}>{children}</ToggleButtonContext.Provider>;
}

void useToggleButtonGroupContext;

export { ToggleButtonGroupContext };
