/**
 * Slot motion for ProgressBar — look here first.
 *
 * DOM slots: `track`, `fill`, `header`, `value`
 *
 * Host: Track plays opt-in `enter` and `change` when value / indeterminate flips.
 * Fill scale and indeterminate travel stay kit-internal.
 * Defaults: empty.
 */
import { useEffect, useLayoutEffect, useRef } from "react";

import { clearWillChangeOnComplete, gsap, killMotion, killMotionGeometry, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  isMotionFeatureEnabled,
  motionProgressFill,
  motionProgressIndeterminate,
} from "@/components/core/utils/motionConfig";
import {
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";

import type { ProgressBarMotion, UseProgressBarFillAnimationProps } from "./progressBarTypes";

export function resolveProgressBarMotionDefaults(): ProgressBarMotion {
  return {};
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
    exclude: ["fill"],
  });
}

function clampUnit(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function useProgressBarFillAnimation({
  indeterminate,
  percent,
  isHorizontal,
}: UseProgressBarFillAnimationProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const firstLayoutRef = useRef(true);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (indeterminate) return;
    const fill = fillRef.current;
    if (!fill) return;

    const targetScale = clampUnit(percent / 100);
    const origin = isHorizontal ? "left center" : "bottom center";
    const scaleVars = isHorizontal
      ? { scaleX: targetScale, scaleY: 1, x: 0, y: 0 }
      : { scaleX: 1, scaleY: targetScale, x: 0, y: 0 };

    // Full track box; progress is compositor scale only.
    fill.style.width = "100%";
    fill.style.height = "100%";

    const applyInstant = () => {
      killMotionGeometry(fill);
      gsap.set(fill, { ...scaleVars, transformOrigin: origin });
    };

    if (
      reduceMotion ||
      !isMotionFeatureEnabled("enableProgressFill") ||
      firstLayoutRef.current
    ) {
      firstLayoutRef.current = false;
      applyInstant();
      return;
    }

    firstLayoutRef.current = false;
    killMotionGeometry(fill);
    setWillChangeTransform(fill, true);
    void gsap.to(fill, {
      ...scaleVars,
      transformOrigin: origin,
      ...motionProgressFill(),
      overwrite: "auto",
      onComplete: clearWillChangeOnComplete(fill),
    });
  }, [indeterminate, isHorizontal, percent, reduceMotion]);

  useLayoutEffect(() => {
    if (!indeterminate) return;
    const fill = fillRef.current;
    const track = fill?.parentElement;
    if (!fill || !track) return;

    killMotionGeometry(fill);

    if (reduceMotion || !isMotionFeatureEnabled("enableProgressFill")) {
      gsap.set(fill, { clearProps: "transform" });
      return;
    }

    const runIndeterminateMotion = () => {
      const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;
      const fillSize = isHorizontal ? fill.offsetWidth : fill.offsetHeight;
      if (trackSize <= 0 || fillSize <= 0) return;

      killMotionGeometry(fill);
      setWillChangeTransform(fill, true);

      void gsap.fromTo(
        fill,
        isHorizontal ? { x: -fillSize } : { y: fillSize },
        {
          ...(isHorizontal ? { x: trackSize } : { y: -trackSize }),
          ...motionProgressIndeterminate(),
          repeat: -1,
          overwrite: "auto",
        },
      );
    };

    runIndeterminateMotion();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => runIndeterminateMotion());
    ro.observe(track);
    ro.observe(fill);

    return () => ro.disconnect();
  }, [indeterminate, isHorizontal, reduceMotion]);

  useEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, []);

  return { fillRef, reduceMotion };
}
