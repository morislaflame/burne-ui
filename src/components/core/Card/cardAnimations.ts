/**
 * Slot motion for Card — look here first.
 *
 * DOM slots: `root`, `title`, `description`, `header`, `headingBlock`, `body`, `footer`
 * (`content` / `glossContent` are layout wrappers, not public motion slots)
 *
 * Host: root (`useCardAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`
 * when pressable (or when `motion.root` is set).
 * Defaults: `resolveCardMotionDefaults` (second-level lift + squeeze; gloss recipes when gloss).
 */
import { killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useMemo, useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { isInteractivePressKey, shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useCardMotionScope } from "./cardContext";
import type { CardMotion, CardVariant, UseCardAnimationsProps } from "./cardTypes";

export function resolveCardMotionDefaults({
  variant,
  pressable,
}: {
  variant: CardVariant;
  pressable: boolean;
}): CardMotion {
  if (!pressable) return {};
  const isGloss = variant === "gloss";
  const hover = isGloss ? "hoverLiftGloss" : "hoverLiftSecondLevel";
  return {
    root: {
      hoverIn: hover,
      hoverOut: hover,
      pressIn: isGloss ? "pressSqueezeGloss" : "pressSqueeze",
      pressOut: false,
    },
  };
}

export function useCardAnimations({
  pressable,
  isGloss,
  shadow = "base",
  motion,
  onPress,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  onPointerDown: onPointerDownProp,
  onPointerUp: onPointerUpProp,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
  hoverPointerInsideRef,
  forwardedRef,
}: UseCardAnimationsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const scope = useCardMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const glossEnabled = isGloss && (pressable || motion?.root != null);
  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, glossEnabled),
    [glossEnabled],
  );

  const setRootRef = useCallback(
    (node: HTMLElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, scope],
  );

  const secondLevelLift = useSecondLevelShadow(rootRef, pressable && !isGloss, {
    interactive: false,
    shadowSize: shadow,
    pointerInsideRef: hoverPointerInsideRef,
  });

  const hoverEnabled = pressable || motion?.root != null;

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      const el = rootRef.current;
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [scope],
  );

  const motionPointer = useMotionPointerPhases<HTMLElement>({
    enabled: hoverEnabled,
    targetRef: rootRef,
    pointerInsideRef: hoverPointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playRoot("hoverIn"),
    onHoverOut: () => playRoot("hoverOut"),
  });

  useEffect(() => {
    if (pressable) return;
    const el = rootRef.current;
    if (el) killMotion(el);
    hoverPointerInsideRef.current = false;
  }, [hoverPointerInsideRef, pressable]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerDownProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      playRoot("pressIn");
    },
    [onPointerDownProp, playRoot, pressable],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerUpProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      playRoot("pressOut");
    },
    [onPointerUpProp, playRoot, pressable],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      onClickProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      onPress?.(e);
    },
    [onClickProp, onPress, pressable],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      onKeyDownProp?.(e);
      if (!pressable || e.defaultPrevented || !isInteractivePressKey(e)) return;
      playRoot("pressIn");
    },
    [onKeyDownProp, playRoot, pressable],
  );

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

  const pressableLiftMotionClass = pressable
    ? isGloss
      ? glossEnabled
        ? GLOSS_INTERACTIVE_MOTION_CLASS
        : ""
      : secondLevelLift.motionClass
    : "";

  return {
    setRootRef,
    pressableLiftMotionClass,
    handlePointerDown,
    handlePointerUp,
    handleClick,
    handleKeyDown,
    onPointerOver: pointerHandlers.onPointerOver,
    onPointerOut: pointerHandlers.onPointerOut,
    onPointerDownProp,
    onPointerUpProp,
    onClickProp,
    onKeyDownProp,
  };
}
