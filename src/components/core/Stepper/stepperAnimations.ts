/**
 * Slot motion for Stepper — look here first.
 *
 * DOM slots: `root`, `item` (one per step), `indicator`, `title`, `description`, `separator`
 *
 * The connector is a slot (`separator`), not a compound part.
 * `indicator` hover/press: `hoverLiftFirstLevel` + `pressSqueeze`. The trigger
 * plays those phases on the mark so the label is part of the hit target.
 */
import { useCallback, type ForwardedRef, type PointerEventHandler, type RefObject } from "react";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useOptionalStepperMotionScope } from "./stepperContext";
import type { StepperMotion, StepperPartMotion } from "./stepperTypes";

bindLiftRecipes();

export function resolveStepperMotionDefaults(): StepperMotion {
  return {
    indicator: {
      hoverIn: "hoverLiftFirstLevel",
      hoverOut: "hoverLiftFirstLevel",
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

/** Hover and press on the step mark, from the trigger that wraps the label. */
export function useStepperIndicatorPointer(
  indicatorRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const scope = useOptionalStepperMotionScope();
  const play = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn") => {
      if (!enabled) return;
      const el = indicatorRef.current;
      if (!el || !scope) return;
      const value = scope.resolve("indicator", phase);
      if (value === undefined || value === false) return;
      scope.play("indicator", phase, { el });
    },
    [enabled, indicatorRef, scope],
  );

  return {
    onPointerOver: () => play("hoverIn"),
    onPointerOut: () => play("hoverOut"),
    onPointerDown: () => play("pressIn"),
  };
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
