/**
 * Slot motion for Meter — look here first.
 *
 * DOM slots: `track`, `fill` (Track nested host); `header`, `value`,
 * `label`, `hint`, `error` (Root scope — siblings of Track).
 *
 * Root passes the `motion` map. Track wraps defaults + `params.getProgressScale`.
 * Fill: `change` → `progressFill`. `enter` on fill is opt-in and played by
 * `useBarFillMotion` (layout cleanup replays in Strict Mode).
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
 
import { useOptionalMeterMotionScope } from "./meterContext";
import type { MeterMotion, MeterPartMotion } from "./meterTypes";
 
export { progressScaleFromPercent };
 
export function resolveMeterMotionDefaults(): MeterMotion {
  return {
    fill: {
      change: "progressFill",
    },
  };
}
 
export function useMeterTrackSlotMotion(
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
 
export function useMeterFillMotion({
  scope,
  percent,
  isHorizontal,
  fillRef,
}: {
  scope: MotionScopeValue | null;
  percent: number;
  isHorizontal: boolean;
  fillRef: RefObject<HTMLSpanElement | null>;
}) {
  return useBarFillMotion({ scope, percent, isHorizontal, fillRef });
}
 
export type MeterChromeSlot = "label" | "hint" | "error";
 
export function useMeterChromeSlot(
  slot: MeterChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: MeterPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalMeterMotionScope();
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
 