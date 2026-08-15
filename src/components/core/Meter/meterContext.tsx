import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  MeterClassNames,
  MeterClassNamesProviderProps,
  MeterFieldContextValue,
} from "./meterTypes";

const MeterFieldContext = createContext<MeterFieldContextValue | null>(null);
const MeterClassNamesContext = createContext<MeterClassNames>({});

export function MeterFieldProvider({
  value,
  children,
}: {
  value: MeterFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <MeterFieldContext.Provider value={value}>{children}</MeterFieldContext.Provider>
  );
}

export function MeterClassNamesProvider({
  classNames,
  children,
}: MeterClassNamesProviderProps) {
  const parent = useContext(MeterClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <MeterClassNamesContext.Provider value={merged}>
      {children}
    </MeterClassNamesContext.Provider>
  );
}

export function useMeterFieldContext(): MeterFieldContextValue {
  const ctx = useContext(MeterFieldContext);
  if (!ctx) {
    throw new Error("Meter.* components must be inside <Meter>.");
  }
  return ctx;
}

export function useOptionalMeterFieldContext() {
  return useContext(MeterFieldContext);
}

export function useMeterClassNames(): MeterClassNames {
  return useContext(MeterClassNamesContext);
}

/** Scope only. Defaults and host play live in `meterAnimations.ts`. */
export const {
  MotionScopeProvider: MeterMotionProvider,
  useMotionScope: useMeterMotionScope,
  useOptionalMotionScope: useOptionalMeterMotionScope,
} = createMotionScope("Meter");

export { MeterFieldContext };
