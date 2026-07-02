import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import {
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { initElementShadow, shadowBase } from "@/components/core/utils/hoverInteractiveLift";
import {
  SHADOW_LIFT_MOTION_CLASS,
  useSecondLevelShadow,
  useSecondLevelShadowContainer,
} from "@/components/core/utils/useShadowMotion";

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

  const selfLiftShadow = useSecondLevelShadow(rootRef, selfLiftEnabled && !isGloss);

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: (e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerOverProp?.(e);
        if (!e.defaultPrevented && selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOver(e);
          else selfLiftShadow.onPointerEnter(e);
        }
      },
      onPointerOut: (e: React.PointerEvent<HTMLSpanElement>) => {
        onPointerOutProp?.(e);
        if (selfLiftEnabled) {
          if (isGloss) glossLiftPointerHandlers.onPointerOut(e);
          else selfLiftShadow.onPointerLeave(e);
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
      selfLiftShadow.onPointerEnter,
      selfLiftShadow.onPointerLeave,
    ],
  );

  const selfLiftMotionCls = selfLiftEnabled
    ? isGloss
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : selfLiftShadow.motionClass
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
  return useSecondLevelShadowContainer(liftedRef, hoverLift, {
    liftScale: getMotionConfig().badgeAnchorHoverLiftScale,
  });
}

export function registerBadgeAnchorLiftTarget(
  el: HTMLElement | null,
  hoverLift: boolean,
): void {
  if (el && hoverLift) initElementShadow(el, shadowBase());
}
