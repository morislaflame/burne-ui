/**
 * Slot motion for Badge — look here first.
 *
 * DOM slots: `root` (badge surface; inner lift target when split inside Anchor),
 * `anchor` (`Badge.Anchor` host — controller target is the wrapper; hover plays the lift child)
 *
 * Host: Badge root (`useBadgeAnimations`) plays pointer `hoverIn` / `hoverOut`.
 * `Badge.Anchor` (`useBadgeAnchorMotion`) plays `anchor` hover on the lifted child.
 * Defaults: `resolveBadgeMotionDefaults` / `resolveBadgeAnchorMotionDefaults`.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
 
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { initElementShadow, shadowBase, shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { SHADOW_LIFT_MOTION_CLASS, useSecondLevelShadow, useSecondLevelShadowContainer } from "@/components/core/utils/useShadowMotion";
 
import { useBadgeLiftContext, useBadgeMotionScope } from "./badgeContext";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
import { KIT_BADGE_VARIANTS, type BadgeMotion, type BadgeVariant, type UseBadgeAnimationsProps } from "./badgeTypes";
 
 
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
  const rootPhase = hoverLift ? "hoverLiftSecondLevel" : false;
  return overlaySkinMotion(
    { root: { hoverIn: rootPhase, hoverOut: rootPhase } },
    variant,
    KIT_BADGE_VARIANTS,
    "badge",
  );
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
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
 
  const kitSurface = isKitVariant(variant, KIT_BADGE_VARIANTS);
  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift && kitSurface);
  const selfLiftEnabled = hoverLift && !splitLift;

  const selfLiftShadow = useSecondLevelShadow(rootRef, selfLiftEnabled && kitSurface, {
    interactive: false,
  });

  const setMergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (node === null) {
        liftCtx?.registerLiftTarget(null);
      }
      if (!splitLift) scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, liftCtx, scope, splitLift],
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
 
  const selfLiftMotionCls = selfLiftEnabled && kitSurface ? selfLiftShadow.motionClass : "";

  const splitLiftMotionCls = splitLift ? SHADOW_LIFT_MOTION_CLASS : "";
 
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
    kitSurface: isKitVariant(variant, KIT_BADGE_VARIANTS),
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
 
