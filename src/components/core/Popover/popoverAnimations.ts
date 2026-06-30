import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import { shadowSm } from "@/components/core/utils/hoverInteractiveLift";
import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
} from "@/components/core/utils/modalSurfaceMotion";
import { motionTooltip } from "@/components/core/utils/motionConfig";
import { usePersistentElShadow } from "@/components/core/utils/useShadowMotion";
import {
  computeTooltipPlacement,
  type FloatingAlign,
} from "@/components/core/Tooltip/tooltipPosition";

import { mergePopoverRefs } from "./popoverAPI";
import type { PopoverSide, UsePopoverContentLifecycleProps } from "./popoverTypes";

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
}: UsePopoverContentLifecycleProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const glossPanelRef = useRef<HTMLDivElement | null>(null);
  const bindGlossPanelRef = useMemo(
    () => createGlossInteractiveRefCallback(glossPanelRef, isGloss),
    [isGloss],
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<PopoverSide>(side);

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
    const placement = computeTooltipPlacement(
      anchorRect,
      panel.getBoundingClientRect(),
      side,
      offset,
      { align },
    );

    setResolvedSide(placement.resolvedSide);
    panel.style.position = "fixed";
    panel.style.left = `${placement.left}px`;
    panel.style.top = `${placement.top}px`;
    panel.style.transform = "";
    if (matchAnchorWidth) {
      panel.style.minWidth = `${Math.max(anchorRect.width, 12 * 16)}px`;
    } else {
      panel.style.minWidth = "";
    }
  }, [align, anchorRef, matchAnchorWidth, offset, side, triggerRef]);

  useLayoutEffect(() => {
    if (open) setPortalMounted(true);
  }, [open]);

  usePersistentElShadow(panelRef, !isGloss, shadowSm);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const raf = window.requestAnimationFrame(() => reposition());
    const onReflow = () => reposition();
    window.addEventListener("scroll", onReflow, true);
    window.addEventListener("resize", onReflow);

    const panel = panelRef.current;
    const ro =
      panel && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => reposition())
        : null;
    if (panel && ro) ro.observe(panel);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onReflow, true);
      window.removeEventListener("resize", onReflow);
      ro?.disconnect();
    };
  }, [open, reposition, showArrow, offset, align, matchAnchorWidth]);

  useLayoutEffect(() => {
    if (!portalMounted) return undefined;
    const el = panelRef.current;
    if (!el) return undefined;

    const reduced = isReducedModalMotion();
    let cancelled = false;

    if (reduced) {
      killMotion(el);
      if (open) {
        applyReducedPortalMotion(el);
      } else {
        setPortalMounted(false);
      }
      return () => {
        cancelled = true;
      };
    }

    killMotion(el);

    if (open) {
      animatePortalOpen({
        surface: el,
        vars: { ...motionTooltip(), overwrite: "auto" },
      });
      return () => {
        cancelled = true;
        killMotion(el);
      };
    }

    const anim = animatePortalClose({
      surface: el,
      vars: { ...motionTooltip(), overwrite: "auto" },
      onComplete: () => {
        if (!cancelled) setPortalMounted(false);
      },
    });
    return () => {
      cancelled = true;
      killMotion(el);
      anim.kill();
    };
  }, [open, portalMounted]);

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
