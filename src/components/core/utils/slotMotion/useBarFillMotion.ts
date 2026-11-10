import { useLayoutEffect, type RefObject } from "react";
 
import { gsap, killMotion, killMotionGeometry } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
 
import type { MotionScopeValue } from "./createMotionScope";
import {
  applyProgressFillInstant,
  progressScaleFromPercent,
} from "./recipes/progressFill";
 
/**
 * Determinate first-paint + `fill.enter`, `change: false` / reduced snap,
 * and indeterminate `fill.change` loop (ResizeObserver replay).
 * Track still broadcasts determinate `fill.change` via `useSlotPhaseOnChange`.
 *
 * `fill.enter` is played here (not `useOptionalEnterOnMount`). A mount-only
 * `useEffect` `killMotion` runs *after* enter in React Strict Mode and leaves
 * the fill at scale 0; cleanup on this layout effect kills and lets the second
 * setup replay enter.
 */
export function useBarFillMotion({
  scope,
  percent,
  isHorizontal,
  indeterminate = false,
  fillRef,
}: {
  scope: MotionScopeValue | null;
  percent: number;
  isHorizontal: boolean;
  indeterminate?: boolean;
  fillRef: RefObject<HTMLSpanElement | null>;
}) {
  const config = useMotionConfig();
  const reduceMotion = usePrefersReducedMotion();
  const scale = progressScaleFromPercent(percent);
  const fillEnabled = isMotionFeatureEnabledFor(config, "enableProgressFill");
 
  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill || indeterminate || !scope) return;
    const enter = scope.resolve("fill", "enter");
    if (enter == null || enter === false) return;
    const change = scope.resolve("fill", "change");
    if (change === false || reduceMotion || !fillEnabled) return;
 
    fill.style.width = "100%";
    fill.style.height = "100%";
    applyProgressFillInstant(fill, 0, isHorizontal);
    scope.play("fill", "enter", { el: fill });
    return () => {
      killMotion(fill);
    };
  }, [fillEnabled, fillRef, indeterminate, isHorizontal, reduceMotion, scope]);
 
  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill || indeterminate) return;
    fill.style.width = "100%";
    fill.style.height = "100%";
    const enter = scope?.resolve("fill", "enter");
    const hasEnter = enter != null && enter !== false;
    const change = scope?.resolve("fill", "change");
    if (change === false || reduceMotion || !fillEnabled || !hasEnter) {
      applyProgressFillInstant(fill, scale, isHorizontal);
    }
  }, [fillEnabled, fillRef, indeterminate, isHorizontal, reduceMotion, scale, scope]);
 
  useLayoutEffect(() => {
    if (!indeterminate) return;
    const fill = fillRef.current;
    const track = fill?.parentElement;
    if (!fill || !track || !scope) return;
    const change = scope.resolve("fill", "change");
    if (change === false || reduceMotion || !fillEnabled) {
      killMotionGeometry(fill);
      gsap.set(fill, { clearProps: "transform" });
      return;
    }
    const replay = () => {
      scope.play("fill", "change", { el: fill });
    };
    replay();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(replay);
    ro.observe(track);
    ro.observe(fill);
    return () => ro.disconnect();
  }, [fillEnabled, fillRef, indeterminate, isHorizontal, reduceMotion, scope]);
 
  return { reduceMotion };
}
 