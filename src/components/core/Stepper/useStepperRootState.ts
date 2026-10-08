import { useCallback, useMemo } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";

import { STEPPER_ITEM_NAME, stepperValues } from "./stepperAPI";
import type { StepperContextValue, StepperProps } from "./stepperTypes";

export function useStepperRootState({
  steps,
  children,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  linear = true,
  size = "base",
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: StepperProps) {
  const compound = hasCompoundChild(children, STEPPER_ITEM_NAME);
  const values = useMemo(
    () => stepperValues(compound, steps, children),
    [children, compound, steps],
  );
  const fallback = defaultValue ?? values[0] ?? "";
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: fallback,
    onChange: onValueChange,
  });
  const currentIndex = values.indexOf(current);
  const select = useCallback(
    (next: string) => {
      if (next === current) return;
      setCurrent(next);
    },
    [current, setCurrent],
  );
  const context = useMemo<StepperContextValue>(
    () => ({ orientation, size, currentIndex, linear, select }),
    [currentIndex, linear, orientation, select, size],
  );

  return {
    compound,
    steps,
    children,
    classNames,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    context,
    rest,
  };
}
