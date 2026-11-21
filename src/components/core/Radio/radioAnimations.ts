/**
 * Slot motion for Radio — look here first.
 *
 * Hybrid: own `createMotionScope` for chrome (`label` / `hint` / `error`);
 * indicator keys still map onto SelectionIndicator (`RADIO_MOTION_SLOT_MAP`).
 * Host play for fill/mark lives in `selectionIndicatorAnimations.ts`. Chrome
 * `check` / `uncheck` plays from `useRadioChromeSlot` (`useSlotPhaseOnChange`).
 *
 * Also: track opacity (`useRadioControlTrackAnimation`) and label squeeze
 * (`useRadioTextMotion`).
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
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
import { useLayoutEffect, useRef } from "react";
 
import type { SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";
 
import { useOptionalRadioMotionScope, useRadioFieldContext } from "./radioContext";
import type { RadioPartMotion, RadioMotion, UseRadioAnimationsProps } from "./radioTypes";
 
/** Root Radio `motion` keys → SelectionIndicator slots. */
export const RADIO_MOTION_SLOT_MAP = {
  indicator: "root",
  indicatorFill: "fill",
  indicatorMark: "mark",
} as const;
 
export function resolveRadioIndicatorMotion({
  rootMotion,
  indicatorMotion,
}: {
  rootMotion?: MotionMapWithEvents<RadioMotion>;
  indicatorMotion?: MotionMapWithEvents<SelectionIndicatorMotion>;
}): MotionMapWithEvents<SelectionIndicatorMotion> | undefined {
  const fromRoot: SelectionIndicatorMotion | undefined = rootMotion
    ? {
        [RADIO_MOTION_SLOT_MAP.indicator]: rootMotion.indicator,
        [RADIO_MOTION_SLOT_MAP.indicatorFill]: rootMotion.indicatorFill,
        [RADIO_MOTION_SLOT_MAP.indicatorMark]: rootMotion.indicatorMark,
      }
    : undefined;
  const events = splitMotionRootMap(indicatorMotion).events ?? splitMotionRootMap(rootMotion).events;
  const states = mergeMotionRootSiblings(
    { states: remapMotionStateSlots(splitMotionRootMap(rootMotion).states, RADIO_MOTION_SLOT_MAP) },
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
 
export function useRadioControlTrackAnimation() {
  const config = useMotionConfig();
  const ctx = useRadioFieldContext();
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
 
export function useRadioTextMotion({
  isDisabled,
  enableTextMotion,
  textMotionRef,
  onPointerDown,
  onKeyDown,
}: UseRadioAnimationsProps) {
  return usePressableElementTextMotion<HTMLLabelElement>({
    isDisabled,
    enabled: enableTextMotion,
    textMotionRef,
    onPointerDown,
    onKeyDown,
  });
}
 
export type RadioChromeSlot = "label" | "hint" | "error";
 
export function useRadioChromeSlot(slot: RadioChromeSlot, motion?: RadioPartMotion) {
  const ctx = useRadioFieldContext();
  const scope = useOptionalRadioMotionScope();
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
 
export function useRadioLabelSlot(motion?: RadioPartMotion) {
  return useRadioChromeSlot("label", motion);
}
 