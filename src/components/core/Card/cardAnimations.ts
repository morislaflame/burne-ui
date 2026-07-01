import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { useSecondLevelShadowContainer } from "@/components/core/utils/useShadowMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import type { UseCardAnimationsProps } from "./cardTypes";

export function useCardAnimations({
  pressable,
  isGloss,
  animated,
  onPress,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  onPointerDown: onPointerDownProp,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
  forwardedRef,
}: UseCardAnimationsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const pointerInsideRef = useRef(false);
  const glossPressable = pressable && isGloss;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, isGloss),
    [isGloss],
  );

  const setRootRef = useCallback(
    (node: HTMLElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef],
  );

  const glossPointerHandlers = useGlossInteractiveHandlers(
    rootRef,
    glossPressable,
    { pointerInsideRef },
  );

  const pressableLift = useSecondLevelShadowContainer(
    rootRef,
    pressable && !isGloss,
    { pointerInsideRef },
  );

  useEffect(() => {
    if (pressable) return;
    const el = rootRef.current;
    if (el) killMotion(el);
    pointerInsideRef.current = false;
  }, [pressable]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerDownProp?.(e);
      if (!pressable || !animated || e.defaultPrevented || prefersReducedInteractiveHoverLift()) {
        return;
      }
      const shell = rootRef.current;
      if (!shell) return;

      if (isGloss) {
        void animateGlossInteractivePressSqueeze(shell, pointerInsideRef.current);
        return;
      }

      void animateInteractivePressSqueeze(shell, {
        pointerInside: pointerInsideRef.current,
        shadow: pressableLift.shadow,
      });
    },
    [animated, isGloss, onPointerDownProp, pressable, pressableLift.shadow],
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
    },
    [onKeyDownProp],
  );

  // Merged pointer handlers — safe to use in all CardRootShell branches.
  // When pressable=false, animation handlers are no-ops (checked inside hooks).
  const onPointerOver = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerOverProp?.(e);
      if (!pressable || e.defaultPrevented || !animated) return;
      if (isGloss) glossPointerHandlers.onPointerOver(e);
      else pressableLift.onPointerOver(e);
    },
    [animated, glossPointerHandlers, isGloss, onPointerOverProp, pressable, pressableLift],
  );

  const onPointerOut = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerOutProp?.(e);
      if (!pressable || !animated) return;
      if (isGloss) glossPointerHandlers.onPointerOut(e);
      else pressableLift.onPointerOut(e);
    },
    [animated, glossPointerHandlers, isGloss, onPointerOutProp, pressable, pressableLift],
  );

  return {
    setRootRef,
    pressableLiftMotionClass: pressableLift.motionClass,
    handlePointerDown,
    handleClick,
    handleKeyDown,
    onPointerOver,
    onPointerOut,
    // Raw passthrough handlers for non-pressable shell branches
    onPointerDownProp,
    onClickProp,
    onKeyDownProp,
  };
}
