/**
 * Slot motion for Badge — look here first.
 *
 * DOM slots: `root` (badge surface; inner lift target when split inside Anchor),
 * `anchor` (`Badge.Anchor` host — plays on the registered lift target)
 *
 * Host: Badge root (`useBadgeAnimations`) plays pointer `hoverIn` / `hoverOut`.
 * `Badge.Anchor` (`useBadgeAnchorMotion`) plays `anchor` hover on the lifted child.
 * Defaults: `resolveBadgeMotionDefaults` / `resolveBadgeAnchorMotionDefaults`.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type RefObject } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { initElementShadow, shadowBase, shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { SHADOW_LIFT_MOTION_CLASS, useSecondLevelShadow, useSecondLevelShadowContainer } from "@/components/core/utils/useShadowMotion";

import { useBadgeLiftContext, useBadgeMotionScope } from "./badgeContext";
import type { BadgeMotion, BadgeVariant, UseBadgeAnimationsProps } from "./badgeTypes";

import "../utils/glossInteractive.css";

export function resolveBadgeMotionDefaults({
  variant,
  hoverLift,
  splitLift,
}: {
  variant: BadgeVariant;
  hoverLift: boolean;
  splitLift: boolean;
}): BadgeMotion {
  if (splitLift) {
    return { root: { hoverIn: false, hoverOut: false } };
  }
  const recipe = variant === "gloss" ? "hoverLiftGloss" : "hoverLiftSecondLevel";
  const rootPhase = hoverLift ? recipe : false;
  return { root: { hoverIn: rootPhase, hoverOut: rootPhase } };
}

export function resolveBadgeAnchorMotionDefaults({
  hoverLift,
}: {
  hoverLift: boolean;
}): BadgeMotion {
  const recipe = hoverLift ? "hoverLiftSecondLevel" : false;
  return { anchor: { hoverIn: recipe, hoverOut: recipe } };
}

export function useBadgeAnimations({
  variant,
  hoverLift = true,
  motion,
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
  const scope = useBadgeMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const isGloss = variant === "gloss";
  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift && !isGloss);
  const selfLiftEnabled = hoverLift && !splitLift;
  const glossEnabled = isGloss && (selfLiftEnabled || motion?.root != null);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, glossEnabled),
    [glossEnabled],
  );

  const selfLiftShadow = useSecondLevelShadow(rootRef, !splitLift && !isGloss, {
    interactive: false,
  });

  const setMergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (node === null) {
        liftCtx?.registerLiftTarget(null);
      }
      if (!splitLift) scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, liftCtx, scope, splitLift],
  );

  const motionPointer = useMotionPointerPhases<HTMLSpanElement>({
    enabled: !splitLift,
    targetRef: rootRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: (el) => {
      const value = scope.resolve("root", "hoverIn", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverIn", { partMotion: rootMotionRef.current, el });
    },
    onHoverOut: (el) => {
      const value = scope.resolve("root", "hoverOut", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverOut", { partMotion: rootMotionRef.current, el });
    },
  });

  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverProp,
        onPointerOutProp,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOutProp, onPointerOverProp],
  );

  const selfLiftMotionCls = !splitLift && !isGloss
    ? selfLiftShadow.motionClass
    : glossEnabled
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : "";

  const splitLiftMotionCls = splitLift && !isGloss ? SHADOW_LIFT_MOTION_CLASS : "";

  const syncDirectChild = useCallback(() => {
    if (!liftCtx || !isDirectAnchorChild || !liftCtx.hoverLift) {
      liftCtx?.registerLiftTarget(null);
      return;
    }
    const inner = innerLiftRef.current;
    liftCtx.registerLiftTarget(inner);
    if (splitLift) scope.registerTarget("root", inner);
  }, [isDirectAnchorChild, liftCtx, scope, splitLift]);

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

export function useBadgeAnchorMotion(
  liftedRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLDivElement | null>,
) {
  const scope = useBadgeMotionScope();

  return useMotionPointerPhases<HTMLDivElement>({
    enabled: true,
    targetRef: anchorRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => {
      const el = liftedRef.current;
      if (!el) return;
      const value = scope.resolve("anchor", "hoverIn");
      if (value === undefined) return;
      scope.play("anchor", "hoverIn", { el });
    },
    onHoverOut: () => {
      const el = liftedRef.current;
      if (!el) return;
      const value = scope.resolve("anchor", "hoverOut");
      if (value === undefined) return;
      scope.play("anchor", "hoverOut", { el });
    },
  });
}

export function useBadgeAnchorAnimations(liftedRef: RefObject<HTMLElement | null>) {
  const config = useMotionConfig();
  return useSecondLevelShadowContainer(liftedRef, true, {
    interactive: false,
    liftScale: config.badgeAnchorHoverLiftScale,
  });
}

export function registerBadgeAnchorLiftTarget(
  el: HTMLElement | null,
  _hoverLift: boolean,
): void {
  if (el) initElementShadow(el, shadowBase());
}
