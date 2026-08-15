/**
 * Slot motion for Tooltip — look here first.
 *
 * DOM slots: `content` (portal surface)
 * Host: `Tooltip.Content` (`useTooltipPortalMotion`) plays `enter` / `leave`.
 * Root has no portal DOM — it only passes the `motion` map through context.
 * Defaults wrap the portal host (`TOOLTIP_MOTION_DEFAULTS` on the Content provider).
 */
import { useLayoutEffect, type RefObject } from "react";

import { killStoredMotion, type MotionScopeValue } from "@/components/core/utils/slotMotion";

import type { TooltipMotion } from "./tooltipTypes";

export const TOOLTIP_MOTION_DEFAULTS: TooltipMotion = {
  content: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
};

export function useTooltipPortalMotion({
  open,
  portalMounted,
  setPortalMounted,
  tipRef,
  scope,
}: {
  open: boolean;
  portalMounted: boolean;
  setPortalMounted: (mounted: boolean) => void;
  tipRef: RefObject<HTMLDivElement | null>;
  scope: MotionScopeValue;
}) {
  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = tipRef.current;
    if (!el) return undefined;

    let cancelled = false;

    if (open) {
      scope.play("content", "enter", { el });
      return () => {
        cancelled = true;
      };
    }

    const run = scope.play("content", "leave", {
      el,
      waitForComplete: true,
    });
    void run.finished.then(() => {
      if (!cancelled) setPortalMounted(false);
    });
    return () => {
      cancelled = true;
      run.animation?.kill();
      killStoredMotion(el);
    };
  }, [open, portalMounted, scope, setPortalMounted, tipRef]);
}
