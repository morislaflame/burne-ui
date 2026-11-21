import { Children, isValidElement, type ReactNode } from "react";

import type { StepperStep, StepperStepState } from "./stepperTypes";

export const STEPPER_ITEM_NAME = "StepperItem";

export const STEPPER_TRIGGER_NAME = "StepperTrigger";

export function isStepperTrigger(node: ReactNode): boolean {
  return isValidElement(node) && (node.type as { displayName?: string }).displayName === STEPPER_TRIGGER_NAME;
}

export function isStepperItem(node: ReactNode): boolean {
  return isValidElement(node) && (node.type as { displayName?: string }).displayName === STEPPER_ITEM_NAME;
}

export function stepperStepState(index: number, currentIndex: number): StepperStepState {
  if (currentIndex < 0 || index > currentIndex) return "inactive";
  if (index === currentIndex) return "active";
  return "checked";
}

/** Linear steppers accept the current step and any step already reached. */
export function stepperStepSelectable(
  index: number,
  currentIndex: number,
  linear: boolean,
  maxReachedIndex = currentIndex,
): boolean {
  if (!linear) return true;
  const reached = Math.max(currentIndex, maxReachedIndex);
  if (reached < 0) return index === 0;
  return index <= reached;
}

export function readStepperValues(children: ReactNode): string[] {
  const values: string[] = [];
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if ((child.type as { displayName?: string }).displayName !== STEPPER_ITEM_NAME) continue;
    const value = (child.props as { value?: string }).value;
    if (value) values.push(value);
  }
  return values;
}

export function stepperValues(
  compound: boolean,
  steps: readonly StepperStep[] | undefined,
  children: ReactNode,
): string[] {
  if (compound) return readStepperValues(children);
  return (steps ?? []).map((step) => step.value);
}
