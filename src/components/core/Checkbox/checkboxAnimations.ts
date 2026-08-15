/**
 * Slot motion for Checkbox — look here first.
 *
 * Checkbox is an embedder: it has no `createMotionScope`. Root `motion` keys
 * map onto SelectionIndicator slots (`CHECKBOX_MOTION_SLOT_MAP`).
 * Host play and kit defaults live in `selectionIndicatorAnimations.ts`.
 *
 * Also: track opacity (`useCheckboxControlTrackAnimation`) and label squeeze
 * (`useCheckboxTextMotion`).
 */
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useLayoutEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { motionInteractiveFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

import type { SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";

import { useCheckboxFieldContext } from "./checkboxContext";
import type { CheckboxMotion, UseCheckboxAnimationsProps } from "./checkboxTypes";

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
  rootMotion?: CheckboxMotion;
  indicatorMotion?: SelectionIndicatorMotion;
}): SelectionIndicatorMotion | undefined {
  const fromRoot: SelectionIndicatorMotion | undefined = rootMotion
    ? {
        [CHECKBOX_MOTION_SLOT_MAP.indicator]: rootMotion.indicator,
        [CHECKBOX_MOTION_SLOT_MAP.indicatorFill]: rootMotion.indicatorFill,
        [CHECKBOX_MOTION_SLOT_MAP.indicatorMark]: rootMotion.indicatorMark,
      }
    : undefined;
  if (!fromRoot && !indicatorMotion) return undefined;
  return {
    root: { ...fromRoot?.root, ...indicatorMotion?.root },
    fill: { ...fromRoot?.fill, ...indicatorMotion?.fill },
    mark: { ...fromRoot?.mark, ...indicatorMotion?.mark },
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
    const from = Number.parseFloat(getComputedStyle(track).opacity);
    const start = Number.isFinite(from) ? from : 1;
    void gsap.fromTo(
      track,
      { autoAlpha: start },
      {
        autoAlpha: ctx.isDisabled ? 0.48 : 1,
        ...motionInteractiveFor(config),
        overwrite: "auto",
      },
    );
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
