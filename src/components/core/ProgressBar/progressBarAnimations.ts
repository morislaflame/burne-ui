/**
 * Slot motion for ProgressBar — look here first.
 *
 * DOM slots: `track`, `fill` (Track nested host); `header`, `value`,
 * `label`, `hint`, `error` (Root scope — siblings of Track).
 *
 * Root passes the `motion` map. Track wraps defaults + `params.getProgressScale`.
 * Fill: `change` → `progressFill` / `progressIndeterminate`. `enter` on fill is
 * opt-in and played by `useBarFillMotion` (layout cleanup replays in Strict Mode).
 */
import { type ForwardedRef, type PointerEventHandler, type RefObject } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
import { useBarFillMotion } from "@/components/core/utils/slotMotion/useBarFillMotion";
import { progressScaleFromPercent } from "@/components/core/utils/slotMotion/recipes/progressFill";

import { useOptionalProgressBarMotionScope } from "./progressBarContext";
import type { ProgressBarMotion, ProgressBarPartMotion } from "./progressBarTypes";

export { progressScaleFromPercent };

export function resolveProgressBarMotionDefaults({
  indeterminate = false,
}: {
  indeterminate?: boolean;
} = {}): ProgressBarMotion {
  return {
    fill: {
      change: indeterminate ? "progressIndeterminate" : "progressFill",
    },
  };
}

export function useProgressBarTrackSlotMotion(
  scope: MotionScopeValue | null,
  identity: string,
) {
  useOptionalEnterOnMount(scope, "track");
  useSlotPhaseOnChange(scope, "track", identity, {
    phase: "change",
    skipFirst: true,
    broadcast: true,
  });
}

export function useProgressBarFillMotion({
  scope,
  percent,
  isHorizontal,
  indeterminate,
  fillRef,
}: {
  scope: MotionScopeValue | null;
  percent: number;
  isHorizontal: boolean;
  indeterminate: boolean;
  fillRef: RefObject<HTMLSpanElement | null>;
}) {
  return useBarFillMotion({ scope, percent, isHorizontal, indeterminate, fillRef });
}

export type ProgressBarChromeSlot = "label" | "hint" | "error";

export function useProgressBarChromeSlot(
  slot: ProgressBarChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: ProgressBarPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalProgressBarMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
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
