/**
 * Slot motion for Stepper — look here first.
 *
 * DOM slots: `root`, `item` (one per step), `indicator`, `title`, `description`, `separator`
 *
 * The connector is a slot (`separator`), not a compound part.
 * Defaults are empty: color changes ride CSS on `data-state`.
 */
import type { ForwardedRef, PointerEventHandler } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useOptionalStepperMotionScope } from "./stepperContext";
import type { StepperMotion, StepperPartMotion } from "./stepperTypes";

export function resolveStepperMotionDefaults(): StepperMotion {
  return {};
}

type PointerProps<T extends HTMLElement> = {
  forwardedRef?: ForwardedRef<T>;
  onPointerOver?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerDown?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
};

export function useStepperRootMotion(props: PointerProps<HTMLOListElement>) {
  const scope = useOptionalStepperMotionScope();
  const pointer = hasPointerPhases(scope?.getRootMotion()?.root);
  const part = useMotionPart<HTMLOListElement>({
    scope,
    slot: "root",
    forwardedRef: props.forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver: props.onPointerOver,
    onPointerOut: props.onPointerOut,
    onPointerDown: props.onPointerDown,
    onPointerUp: props.onPointerUp,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
  return part;
}

export function useStepperSlotMotion<T extends HTMLElement>({
  slot,
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: PointerProps<T> & {
  slot: keyof StepperMotion;
  motion?: StepperPartMotion;
}) {
  const scope = useOptionalStepperMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
