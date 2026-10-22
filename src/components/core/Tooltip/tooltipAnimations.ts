/**
 * Slot motion for Tooltip — look here first.
 *
 * DOM slots: `content` and `panel` share the visual bubble (classes + motion).
 * The positioning wrapper is not a slot. `title`, `description`, `indicator`, `arrow`
 * (`message` is `display: contents`; `*` are layout)
 *
 * Host: `Tooltip.Content` (`useTooltipPortalMotion`) plays `enter` / `leave` on
 * the bubble (`content`, the same node as `tooltip.panel` classes).
 * Root has no portal DOM — it only passes the `motion` map through context.
 * Defaults wrap the portal host (`TOOLTIP_MOTION_DEFAULTS` on the Content provider).
 */
import { useLayoutEffect, useRef } from "react";
 
import {
  hideNestedEnterSlots,
  invalidateEnterFrame,
  killStoredMotion,
  scheduleNestedEnterBroadcast,
  waitForLeaveGeneration,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
 
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { TooltipMotion, TooltipVariant } from "./tooltipTypes";
import { KIT_TOOLTIP_VARIANTS } from "./tooltipTypes";

import { bindPortalRecipes } from "@/components/core/utils/slotMotion/recipes/bindPortal";

bindPortalRecipes();
 
export const TOOLTIP_MOTION_HOST_SLOTS = ["content"] as const;
 
export const TOOLTIP_MOTION_DEFAULTS: TooltipMotion = {
  content: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
};

export function resolveTooltipMotionDefaults(variant: TooltipVariant): TooltipMotion {
  return overlaySkinMotion(TOOLTIP_MOTION_DEFAULTS, variant, KIT_TOOLTIP_VARIANTS, "tooltip");
}
 
export function useTooltipPortalMotion({
  open,
  portalMounted,
  setPortalMounted,
  scope,
}: {
  open: boolean;
  portalMounted: boolean;
  setPortalMounted: (mounted: boolean) => void;
  scope: MotionScopeValue;
}) {
  const enterFrameRef = useRef(0);
  const enterGenRef = useRef(0);
 
  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = scope.getTarget("content");
    if (!el) return undefined;
 
    const cancelEnterFrame = () => invalidateEnterFrame(enterFrameRef, enterGenRef);
 
    if (open) {
      const gen = ++enterGenRef.current;
      scope.play("content", "enter", { el });
      hideNestedEnterSlots(scope, [...TOOLTIP_MOTION_HOST_SLOTS]);
      enterFrameRef.current = scheduleNestedEnterBroadcast(
        scope,
        TOOLTIP_MOTION_HOST_SLOTS,
        () => {
          if (gen !== enterGenRef.current) return false;
          enterFrameRef.current = 0;
          return true;
        },
      );
      return () => {
        cancelEnterFrame();
      };
    }
 
    cancelEnterFrame();
    const contentRun = scope.play("content", "leave", {
      el,
      waitForComplete: true,
    });
    const extra = scope.playBroadcast("leave", {
      exclude: [...TOOLTIP_MOTION_HOST_SLOTS],
      waitForComplete: true,
    });
    const leaveWait = waitForLeaveGeneration({
      runs: [contentRun],
      extra,
      onComplete: () => setPortalMounted(false),
      onKill: () => killStoredMotion(el),
    });
    return () => {
      leaveWait.kill();
    };
  }, [open, portalMounted, scope, setPortalMounted]);
}
 