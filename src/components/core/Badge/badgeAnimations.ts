import { useCallback, useLayoutEffect, useMemo, useRef, type RefObject } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { initElementShadow, shadowBase } from "@/components/core/utils/hoverInteractiveLift";
import { SHADOW_LIFT_MOTION_CLASS, useSecondLevelShadow, useSecondLevelShadowContainer } from "@/components/core/utils/useShadowMotion";

import { useBadgeLiftContext } from "./badgeContext";
import type { UseBadgeAnimationsProps } from "./badgeTypes";

import "../utils/glossInteractive.css";

export function useBadgeAnimations({
  variant,
  hoverLift = true,
  forwardedRef,
  isDirectAnchorChild,
  placement,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
  syncDeps,
}: UseBadgeAnimationsProps) {
  const liftCtx = useBadgeLiftContext();
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const innerLiftRef = useRef<HTMLSpanElement | null>(null);

  const isGloss = variant === "gloss";
  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift && !isGloss);
  const selfLiftEnabled = hoverLift && !splitLift;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, selfLiftEnabled && isGloss),
    [isGloss, selfLiftEnabled],
  );

  const glossLiftPointerHandlers = useGlossInteractiveHandlers(
    rootRef,
    selfLiftEnabled && isGloss,
  );

  // Rest elevation when self-lifting (non-gloss); hoverLift only toggles interactive motion.
  const selfLiftShadow = useSecondLevelShadow(rootRef, !splitLift && !isGloss, {
    interactive: hoverLift,
  });

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: (e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerOverProp?.(e);
        if (!e.defaultPrevented && selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOver(e);
          else selfLiftShadow.onPointerOver(e);
        }
      },
      onPointerOut: (e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerOutProp?.(e);
        if (selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOut(e);
          else selfLiftShadow.onPointerOut(e);
        }
      },
    }),
    [
      glossLiftPointerHandlers.onPointerOut,
      glossLiftPointerHandlers.onPointerOver,
      isGloss,
      onPointerOutProp,
      onPointerOverProp,
      selfLiftEnabled,
      selfLiftShadow.onPointerOut,
      selfLiftShadow.onPointerOver,
    ],
  );

  const selfLiftMotionCls = !splitLift && !isGloss
    ? selfLiftShadow.motionClass
    : selfLiftEnabled && isGloss
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : "";

  const splitLiftMotionCls = splitLift && !isGloss ? SHADOW_LIFT_MOTION_CLASS : "";

  const syncDirectChild = useCallback(() => {
    if (!liftCtx || !isDirectAnchorChild || !liftCtx.hoverLift) {
      liftCtx?.registerLiftTarget(null);
      return;
    }
    liftCtx.registerLiftTarget(innerLiftRef.current);
  }, [isDirectAnchorChild, liftCtx]);

  const setMergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (node === null) {
        liftCtx?.registerLiftTarget(null);
      }

      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, liftCtx],
  );

  const { meaningChild, icon, dot, iconOnly, children } = syncDeps;

  useLayoutEffect(() => {
    syncDirectChild();
    queueMicrotask(() => {
      syncDirectChild();
    });
  }, [
    isDirectAnchorChild,
    liftCtx?.anchorCommitGen,
    liftCtx?.hoverLift,
    placement,
    syncDirectChild,
    meaningChild,
    icon,
    dot,
    iconOnly,
    children,
  ]);

  return {
    isGloss,
    splitLift,
    selfLiftEnabled,
    innerLiftRef,
    setMergedRef,
    pointerHandlers,
    selfLiftMotionCls,
    splitLiftMotionCls,
  };
}

export function useBadgeAnchorAnimations(
  liftedRef: RefObject<HTMLElement | null>,
  hoverLift: boolean,
) {
  return useSecondLevelShadowContainer(liftedRef, true, {
    interactive: hoverLift,
    liftScale: getMotionConfig().badgeAnchorHoverLiftScale,
  });
}

export function registerBadgeAnchorLiftTarget(
  el: HTMLElement | null,
  _hoverLift: boolean,
): void {
  if (el) initElementShadow(el, shadowBase());
}
