/**
 * Slot motion for Radio — look here first.
 *
 * Radio is an embedder: it has no `createMotionScope`. Root `motion` keys
 * map onto SelectionIndicator slots (`RADIO_MOTION_SLOT_MAP`).
 * Host play and kit defaults live in `selectionIndicatorAnimations.ts`.
 *
 * Also: track opacity (`useRadioControlTrackAnimation`) and label squeeze
 * (`useRadioTextMotion`).
 */
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
import { useLayoutEffect, useRef } from "react";

import type { SelectionIndicatorMotion } from "@/components/core/SelectionIndicator";

import { useRadioFieldContext } from "./radioContext";
import type { RadioMotion, UseRadioAnimationsProps } from "./radioTypes";

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
  rootMotion?: RadioMotion;
  indicatorMotion?: SelectionIndicatorMotion;
}): SelectionIndicatorMotion | undefined {
  const fromRoot: SelectionIndicatorMotion | undefined = rootMotion
    ? {
        [RADIO_MOTION_SLOT_MAP.indicator]: rootMotion.indicator,
        [RADIO_MOTION_SLOT_MAP.indicatorFill]: rootMotion.indicatorFill,
        [RADIO_MOTION_SLOT_MAP.indicatorMark]: rootMotion.indicatorMark,
      }
    : undefined;
  if (!fromRoot && !indicatorMotion) return undefined;
  return {
    root: { ...fromRoot?.root, ...indicatorMotion?.root },
    fill: { ...fromRoot?.fill, ...indicatorMotion?.fill },
    mark: { ...fromRoot?.mark, ...indicatorMotion?.mark },
  };
}

export function useRadioControlTrackAnimation() {
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
    const from = Number.parseFloat(getComputedStyle(track).opacity);
    const start = Number.isFinite(from) ? from : 1;
    void gsap.fromTo(
      track,
      { autoAlpha: start },
      {
        autoAlpha: ctx.isDisabled ? 0.48 : 1,
        ...motionInteractive(),
        overwrite: "auto",
      },
    );
  }, [ctx.isDisabled, reduceMotion]);

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
