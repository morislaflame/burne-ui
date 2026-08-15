import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  TimeFieldClassNames,
  TimeFieldClassNamesProviderProps,
  TimeFieldFieldContextValue,
} from "./timeFieldTypes";

const TimeFieldContext = createContext<TimeFieldFieldContextValue | null>(null);
const TimeFieldClassNamesContext = createContext<TimeFieldClassNames>({});

export function TimeFieldFieldProvider({
  value,
  children,
}: {
  value: TimeFieldFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <TimeFieldContext.Provider value={value}>{children}</TimeFieldContext.Provider>
  );
}

export function TimeFieldClassNamesProvider({
  classNames,
  children,
}: TimeFieldClassNamesProviderProps) {
  const parent = useContext(TimeFieldClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <TimeFieldClassNamesContext.Provider value={merged}>
      {children}
    </TimeFieldClassNamesContext.Provider>
  );
}

export function useTimeFieldContext(): TimeFieldFieldContextValue {
  const ctx = useContext(TimeFieldContext);
  if (!ctx) throw new Error("Components TimeField must be inside <TimeField>.");
  return ctx;
}

export function useOptionalTimeFieldContext() {
  return useContext(TimeFieldContext);
}

export function useTimeFieldClassNames(): TimeFieldClassNames {
  return useContext(TimeFieldClassNamesContext);
}

/** Scope only. Defaults and host play live in `timeFieldAnimations.ts`. */
export const {
  MotionScopeProvider: TimeFieldMotionProvider,
  useMotionScope: useTimeFieldMotionScope,
  useOptionalMotionScope: useOptionalTimeFieldMotionScope,
} = createMotionScope("TimeField");

export { TimeFieldContext };
