/**
 * Slot motion for Loading — look here first.
 *
 * DOM slots: `root`, `spinner`, `dots` (track), `dot` (repeated)
 *
 * `dot.enter` → `loadingDots` (cycle). The host replays when config or reduced motion changes.
 * Host: root plays optional `enter`.
 */
import { useLayoutEffect } from "react";

import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";
import { applyLoadingDotInstant } from "@/components/core/utils/slotMotion/recipes/loadingDots";

import type { LoadingMotion } from "./loadingTypes";

export function useLoadingDotsAnimation(scope: MotionScopeValue | null) {
  const config = useMotionConfig();
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!scope) return;
    const dots = scope.getTargets("dot");
    if (dots.length === 0) return;

    const value = scope.resolve("dot", "enter");
    if (reduceMotion || value === false || value === undefined) {
      for (const dot of dots) applyLoadingDotInstant(dot);
      return;
    }

    for (const dot of dots) {
      scope.play("dot", "enter", { el: dot });
    }
  }, [config, reduceMotion, scope]);
}

export function resolveLoadingMotionDefaults(): LoadingMotion {
  return { dot: { enter: "loadingDots" } };
}
 