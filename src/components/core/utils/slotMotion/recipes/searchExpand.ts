import { isMotionEnabled } from "@/components/core/utils/motionConfig";
import {
  animateSearchIconShift,
  animateSearchShellExpand,
  applySearchExpandInstant,
  type SearchExpandMetrics,
} from "@/components/core/utils/searchInputExpandMotion";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function metricsOf(ctx: MotionContext): SearchExpandMetrics | null {
  const targetW = ctx.params.targetW;
  const collapsedDim = ctx.params.collapsedDim;
  const expandedRadius = ctx.params.expandedRadius;
  const padX = ctx.params.padX;
  const iconBox = ctx.params.iconBox;
  const iconLeftCollapsedCss = ctx.params.iconLeftCollapsedCss;
  if (
    typeof targetW !== "number" ||
    typeof collapsedDim !== "number" ||
    typeof expandedRadius !== "number" ||
    typeof padX !== "number" ||
    typeof iconBox !== "number" ||
    typeof iconLeftCollapsedCss !== "string"
  ) {
    return null;
  }
  return { targetW, collapsedDim, expandedRadius, padX, iconBox, iconLeftCollapsedCss };
}

/** Shell width + radius. `enter` expands, `leave` collapses. Layout tween — not public MotionVars. */
export function searchExpandRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const metrics = metricsOf(ctx);
  if (!metrics) return undefined;
  const open = ctx.phase === "enter";
  const icon = ctx.targets.icon ?? null;
  if (ctx.reduced || !isMotionEnabled()) {
    applySearchExpandInstant(ctx.el, icon, open, metrics);
    return undefined;
  }
  return animateSearchShellExpand(ctx.el, open, metrics) as unknown as MotionAnimation;
}

/** Icon `left` during expand/collapse. */
export function searchIconShiftRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const metrics = metricsOf(ctx);
  if (!metrics) return undefined;
  const open = ctx.phase === "enter";
  if (ctx.reduced || !isMotionEnabled()) {
    ctx.el.style.left = open ? `${metrics.padX}px` : metrics.iconLeftCollapsedCss;
    return undefined;
  }
  const shell = ctx.targets.root;
  if (!(shell instanceof HTMLElement)) return undefined;
  return animateSearchIconShift(ctx.el, shell, open, metrics) as unknown as MotionAnimation;
}
