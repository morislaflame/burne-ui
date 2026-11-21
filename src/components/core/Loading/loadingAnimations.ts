/**
 * Slot motion for Loading — look here first.
 *
 * DOM slots: `root`, `spinner`, `dots` (track), `dot` (repeated)
 *
 * `dot.enter` → `loadingDots` (cycle). The host replays when config or reduced motion changes.
 * Host: root plays optional `enter`.
 */
import { useLayoutEffect } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";
import { applyLoadingDotInstant } from "@/components/core/utils/slotMotion/recipes/loadingDots";

import type { LoadingMotion, LoadingSize } from "./loadingTypes";

import { bindLoadingRecipe } from "@/components/core/utils/slotMotion/recipes/bindLoading";

bindLoadingRecipe();

export function useLoadingDotsAnimation(scope: MotionScopeValue | null, size?: LoadingSize) {
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

    const runs = dots.map((dot) => scope.play("dot", "enter", { el: dot }));
    return () => {
      for (const run of runs) {
        run.cancel("unmount");
      }
      for (const dot of dots) {
        killMotion(dot);
      }
    };
  }, [config, reduceMotion, scope, size]);
}

export function resolveLoadingMotionDefaults(): LoadingMotion {
  return { dot: { enter: "loadingDots" } };
}
 