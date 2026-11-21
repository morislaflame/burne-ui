import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { NumberInputClassNames, NumberInputContextValue } from "./numberInputTypes";

const NumberInputContext = createContext<NumberInputContextValue | null>(null);
const NumberInputClassNamesContext = createContext<NumberInputClassNames>({});

export function NumberInputProvider({
  value,
  children,
}: {
  value: NumberInputContextValue;
  children: ReactNode;
}) {
  return <NumberInputContext.Provider value={value}>{children}</NumberInputContext.Provider>;
}

export function useNumberInputContext(): NumberInputContextValue {
  const value = useContext(NumberInputContext);
  if (!value) {
    throw new Error("NumberInput parts must be rendered inside NumberInput.");
  }
  return value;
}

export function NumberInputClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<NumberInputClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(NumberInputClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <NumberInputClassNamesContext.Provider value={merged}>
      {children}
    </NumberInputClassNamesContext.Provider>
  );
}

export function useNumberInputClassNames(): NumberInputClassNames {
  return useContext(NumberInputClassNamesContext);
}

/** Scope only. Defaults and host play live in `numberInputAnimations.ts`. */
export const {
  MotionScopeProvider: NumberInputMotionProvider,
  useMotionScope: useNumberInputMotionScope,
  useOptionalMotionScope: useOptionalNumberInputMotionScope,
} = createMotionScope("NumberInput");
