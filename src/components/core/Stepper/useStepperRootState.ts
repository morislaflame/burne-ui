import { useCallback, useLayoutEffect, useMemo, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";

import { STEPPER_ITEM_NAME, stepperValues } from "./stepperAPI";
import type { StepperContextValue, StepperProps, UseStepperRootStateResult } from "./stepperTypes";

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
}: StepperProps): UseStepperRootStateResult {
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
  const [highestReached, setHighestReached] = useState(currentIndex);
  const maxReachedIndex =
    values.length > 0
      ? Math.min(Math.max(highestReached, currentIndex), values.length - 1)
      : -1;

  useLayoutEffect(() => {
    if (currentIndex > highestReached) {
      setHighestReached(currentIndex);
    }
  }, [currentIndex, highestReached]);

  const select = useCallback(
    (next: string) => {
      if (next === current) return;
      setCurrent(next);
    },
    [current, setCurrent],
  );
  const context = useMemo<StepperContextValue>(
    () => ({ orientation, size, currentIndex, maxReachedIndex, linear, select }),
    [currentIndex, linear, maxReachedIndex, orientation, select, size],
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
