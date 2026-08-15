/**
 * Slot motion for Popover — look here first.
 *
 * DOM slots: `content` (portal surface), `title`, `description`, `body`
 * Host: `Popover.Content` (`usePopoverContentLifecycle`) plays `enter` / `leave`
 * on `content` and broadcasts nested slots. Root has no portal DOM — it only
 * passes the `motion` map through context. Defaults wrap the portal host
 * (`POPOVER_MOTION_DEFAULTS` on the Content provider).
 *
 * Trigger squeeze stays `runOpenAfterSqueeze` (asChild Button already presses).
 */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { focusPanelOnOpen, isFocusVisibleElement } from "@/components/core/utils/focusElement";
import { killMotion } from "@/components/core/utils/gsapMotion";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { applyFloatingPortalPosition, resolvePortalContainer } from "@/components/core/utils/portalContainer";
import { computeTooltipPlacement, type FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
import {
  hideNestedEnterSlots,
  invalidateEnterFrame,
  killMotionScope,
  killStoredMotion,
  scheduleNestedEnterBroadcast,
  waitForLeaveGeneration,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";

import { mergePopoverRefs } from "./popoverAPI";
import type { PopoverMotion, PopoverSide, UsePopoverContentLifecycleProps } from "./popoverTypes";

export const POPOVER_MOTION_HOST_SLOTS = ["content"] as const;

export const POPOVER_MOTION_DEFAULTS: PopoverMotion = {
  content: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
};

export function usePopoverContentLifecycle({
  open,
  side,
  offset,
  align,
  matchAnchorWidth,
  showArrow,
  isGloss,
  forwardedRef,
  contentRef,
  triggerRef,
  anchorRef,
  portalContainer,
  motionScope,
}: UsePopoverContentLifecycleProps & { motionScope: MotionScopeValue }) {
  const config = useMotionConfig();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const glossPanelRef = useRef<HTMLDivElement | null>(null);
  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, isGloss),
    [isGloss],
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<PopoverSide>(side);
  const enterFrameRef = useRef(0);
  const enterGenRef = useRef(0);

  if (open && !portalMounted) {
    setPortalMounted(true);
  }

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      contentRef.current = node;
      mergePopoverRefs(forwardedRef)(node);
    },
    [contentRef, forwardedRef],
  );

  const reposition = useCallback(() => {
    const anchor = anchorRef?.current ?? triggerRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const anchorRect = anchor.getBoundingClientRect();
    if (matchAnchorWidth) {
      panel.style.minWidth = `${Math.max(anchorRect.width, 12 * 16)}px`;
    } else {
      panel.style.minWidth = "";
    }

    const placement = computeTooltipPlacement(
      anchorRect,
      panel.getBoundingClientRect(),
      side,
      offset,
      { align },
    );

    setResolvedSide(placement.resolvedSide);
    applyFloatingPortalPosition(panel, placement, portalContainer);
    panel.style.transform = "";
  }, [align, anchorRef, matchAnchorWidth, offset, portalContainer, side, triggerRef]);

  useLayoutEffect(() => {
    if (!open || !portalMounted) return;
    reposition();
    const raf = window.requestAnimationFrame(() => reposition());
    const onReflow = () => reposition();
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);

    const panel = panelRef.current;
    const host =
      typeof document !== "undefined"
        ? resolvePortalContainer(portalContainer)
        : null;
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => reposition()) : null;
    if (panel && ro) ro.observe(panel);
    if (host && host !== document.body && ro) ro.observe(host);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
      ro?.disconnect();
    };
  }, [open, portalMounted, portalContainer, reposition, showArrow, offset, align, matchAnchorWidth]);

  useLayoutEffect(() => {
    if (!open || !portalMounted) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel || !trigger) return;
    const active = document.activeElement;
    if (active !== trigger && !trigger.contains(active)) return;
    const fromKeyboard = isFocusVisibleElement(trigger);
    focusPanelOnOpen(panel, { focusVisible: fromKeyboard });
  }, [open, portalMounted, triggerRef]);

  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = panelRef.current;
    if (!el) return undefined;

    const cancelEnterFrame = () => invalidateEnterFrame(enterFrameRef, enterGenRef);

    if (isReducedModalMotion(config)) {
      killMotion(el);
      if (open) {
        applyReducedPortalMotion(el);
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelEnterFrame();
      };
    }

    if (open) {
      const gen = ++enterGenRef.current;
      motionScope.play("content", "enter", { el });
      hideNestedEnterSlots(motionScope, [...POPOVER_MOTION_HOST_SLOTS]);
      enterFrameRef.current = scheduleNestedEnterBroadcast(
        motionScope,
        POPOVER_MOTION_HOST_SLOTS,
        () => {
          if (gen !== enterGenRef.current) return false;
          enterFrameRef.current = 0;
          return true;
        },
      );
      return () => {
        cancelEnterFrame();
        killStoredMotion(el);
      };
    }

    cancelEnterFrame();
    const contentRun = motionScope.play("content", "leave", {
      el,
      waitForComplete: true,
    });
    const extra = motionScope.playBroadcast("leave", {
      exclude: [...POPOVER_MOTION_HOST_SLOTS],
      waitForComplete: true,
    });
    const leaveWait = waitForLeaveGeneration({
      runs: [contentRun],
      extra,
      onComplete: () => setPortalMounted(false),
      onKill: () => {
        killMotionScope(motionScope);
        killStoredMotion(el);
      },
    });
    return () => {
      leaveWait.kill();
    };
  }, [config, open, portalMounted, motionScope]);

  return {
    panelRef,
    setPanelRef,
    bindGlossPanelRef,
    portalMounted,
    resolvedSide,
  };
}

export function resolvePopoverContentAlign({
  alignProp,
  matchAnchorWidth,
}: {
  alignProp?: FloatingAlign;
  matchAnchorWidth: boolean;
}): FloatingAlign {
  return alignProp ?? (matchAnchorWidth ? "start" : "center");
}
