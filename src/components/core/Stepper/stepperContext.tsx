import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";
import type { Prettify } from "@/utils/prettify";

import type {
  StepperClassNames,
  StepperContextValue,
  StepperItemContextValue,
} from "./stepperTypes";

const StepperContext = createContext<StepperContextValue | null>(null);
const StepperItemContext = createContext<StepperItemContextValue | null>(null);
const StepperClassNamesContext = createContext<StepperClassNames>({});

export function StepperProvider({
  value,
  children,
}: {
  value: StepperContextValue;
  children: ReactNode;
}) {
  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
}

export function useStepperContext(): StepperContextValue {
  const value = useContext(StepperContext);
  if (!value) throw new Error("Stepper parts must be rendered inside Stepper.");
  return value;
}

export function StepperItemProvider({
  value,
  children,
}: {
  value: StepperItemContextValue;
  children: ReactNode;
}) {
  return <StepperItemContext.Provider value={value}>{children}</StepperItemContext.Provider>;
}

export function useStepperItemContext(): StepperItemContextValue {
  const value = useContext(StepperItemContext);
  if (!value) throw new Error("Stepper.Indicator, Title, and Description must be rendered inside Stepper.Item.");
  return value;
}

export function StepperClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<StepperClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(StepperClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <StepperClassNamesContext.Provider value={merged}>{children}</StepperClassNamesContext.Provider>
  );
}

export function useStepperClassNames(): StepperClassNames {
  return useContext(StepperClassNamesContext);
}

/** Scope only. Defaults and host play live in `stepperAnimations.ts`. */
export const {
  MotionScopeProvider: StepperMotionProvider,
  useMotionScope: useStepperMotionScope,
  useOptionalMotionScope: useOptionalStepperMotionScope,
} = createMotionScope("Stepper");
