/**
 * Slot motion for Meter — look here first.
 *
 * DOM slots: `track`, `fill`, `header`, `value`
 *
 * Host: `Meter.Track` plays `enter` (opt-in) and `change` when value updates.
 * Fill width/height stays kit-internal (`useMeterFillAnimation`) — `change` is
 * not auto-played on `fill` so a custom factory can tween color via `ctx.targets.fill`.
 * Defaults: empty.
 */
import { useEffect, useLayoutEffect, useRef } from "react";

import { gsap, killMotion, killMotionGeometry } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import {
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";

import type { MeterMotion, UseMeterFillAnimationProps } from "./meterTypes";

export function resolveMeterMotionDefaults(): MeterMotion {
  return {};
}

export function useMeterTrackSlotMotion(
  scope: MotionScopeValue | null,
  value: number,
) {
  useOptionalEnterOnMount(scope, "track");
  useSlotPhaseOnChange(scope, "track", value, {
    phase: "change",
    skipFirst: true,
    broadcast: true,
    exclude: ["fill"],
  });
}

export function useMeterFillAnimation({
  fillTargetStyle,
  isHorizontal,
}: UseMeterFillAnimationProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const firstLayoutRef = useRef(true);
  const geometryKeyRef = useRef<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const width = fillTargetStyle.width != null ? String(fillTargetStyle.width) : "";
    const height = fillTargetStyle.height != null ? String(fillTargetStyle.height) : "";
    const geometryKey = `${width}\0${height}`;

    const applyInstant = () => {
      fill.style.width = width;
      fill.style.height = height;
    };

    if (reduceMotion || firstLayoutRef.current) {
      firstLayoutRef.current = false;
      geometryKeyRef.current = geometryKey;
      applyInstant();
      return;
    }

    killMotionGeometry(fill);
    void gsap.to(fill, {
      ...(isHorizontal ? { width } : { height }),
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [fillTargetStyle.height, fillTargetStyle.width, isHorizontal, reduceMotion]);

  useEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, []);

  return { fillRef };
}
