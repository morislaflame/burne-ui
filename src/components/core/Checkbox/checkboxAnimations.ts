/**
 * Slot motion for Checkbox — look here first.
 *
 * Hybrid: own `createMotionScope` for chrome (`label` / `hint` / `error`);
 * indicator keys still map onto SelectionIndicator (`CHECKBOX_MOTION_SLOT_MAP`).
 * Host play for fill/mark lives in `selectionIndicatorAnimations.ts`. Chrome
 * `check` / `uncheck` plays from `useCheckboxChromeSlot` (`useSlotPhaseOnChange`).
 *
 * Also: track opacity (`useCheckboxControlTrackAnimation`) and label squeeze
 * (`useCheckboxTextMotion`).
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
import { useLayoutEffect, useRef } from "react";
 
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { tweenDisabledTrack } from "@/components/core/utils/slotMotion/recipes/disabledTrackFade";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import {
  splitMotionRootMap,
  mergeMotionRootSiblings,
  remapMotionStateSlots,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionMapWithEvents,
} from "@/components/core/utils/slotMotion";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
 
import type { SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";
 
import { useCheckboxFieldContext, useOptionalCheckboxMotionScope } from "./checkboxContext";
import type { CheckboxPartMotion, CheckboxMotion, UseCheckboxAnimationsProps } from "./checkboxTypes";
 
/** Root Checkbox `motion` keys → SelectionIndicator slots. */
export const CHECKBOX_MOTION_SLOT_MAP = {
  indicator: "root",
  indicatorFill: "fill",
  indicatorMark: "mark",
} as const;
 
export function resolveCheckboxIndicatorMotion({
  rootMotion,
  indicatorMotion,
}: {
  rootMotion?: MotionMapWithEvents<CheckboxMotion>;
  indicatorMotion?: MotionMapWithEvents<SelectionIndicatorMotion>;
}): MotionMapWithEvents<SelectionIndicatorMotion> | undefined {
  const fromRoot: SelectionIndicatorMotion | undefined = rootMotion
    ? {
        [CHECKBOX_MOTION_SLOT_MAP.indicator]: rootMotion.indicator,
        [CHECKBOX_MOTION_SLOT_MAP.indicatorFill]: rootMotion.indicatorFill,
        [CHECKBOX_MOTION_SLOT_MAP.indicatorMark]: rootMotion.indicatorMark,
      }
    : undefined;
  const events = splitMotionRootMap(indicatorMotion).events ?? splitMotionRootMap(rootMotion).events;
  const states = mergeMotionRootSiblings(
    { states: remapMotionStateSlots(splitMotionRootMap(rootMotion).states, CHECKBOX_MOTION_SLOT_MAP) },
    { states: splitMotionRootMap(indicatorMotion).states },
  ).states;
  if (!fromRoot && !indicatorMotion && !events && !states) return undefined;
  const mapped: SelectionIndicatorMotion = {
    root: { ...fromRoot?.root, ...indicatorMotion?.root },
    fill: { ...fromRoot?.fill, ...indicatorMotion?.fill },
    mark: { ...fromRoot?.mark, ...indicatorMotion?.mark },
  };
  return {
    ...mapped,
    ...(events ? { events } : {}),
    ...(states ? { states } : {}),
  };
}
 
export function useCheckboxControlTrackAnimation() {
  const config = useMotionConfig();
  const ctx = useCheckboxFieldContext();
  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFirstLayoutRef = useRef(true);
  const reduceMotion = usePrefersReducedMotion();
 
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reduceMotion) {
      killMotion(track);
      track.style.opacity = ctx.isDisabled ? "0.48" : "1";
      return;
    }
 
    if (trackFirstLayoutRef.current) {
      trackFirstLayoutRef.current = false;
      track.style.opacity = ctx.isDisabled ? "0.48" : "1";
      return;
    }
 
    killMotion(track);
    const tween = tweenDisabledTrack(track, ctx.isDisabled, config);
    return () => {
      tween.kill();
    };
  }, [config, ctx.isDisabled, reduceMotion]);
 
  return trackRef;
}
 
export function useCheckboxTextMotion({
  isDisabled,
  enableTextMotion,
  textMotionRef,
  onPointerDown,
  onKeyDown,
}: UseCheckboxAnimationsProps) {
  return usePressableElementTextMotion({
    isDisabled,
    enabled: enableTextMotion,
    textMotionRef,
    onPointerDown,
    onKeyDown,
  });
}
 
export type CheckboxChromeSlot = "label" | "hint" | "error";
 
export function useCheckboxChromeSlot(
  slot: CheckboxChromeSlot,
  motion?: CheckboxPartMotion,
) {
  const ctx = useCheckboxFieldContext();
  const scope = useOptionalCheckboxMotionScope();
  const part = useMotionPart<HTMLElement>({
    scope,
    slot,
    motion,
  });
  useSlotPhaseOnChange(scope, slot, ctx.mergedChecked, {
    phase: ctx.mergedChecked ? "check" : "uncheck",
    skipFirst: true,
    target: part.targetRef,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
 
export function useCheckboxLabelSlot(motion?: CheckboxPartMotion) {
  return useCheckboxChromeSlot("label", motion);
}
 