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
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { useSecondLevelShadowContainer } from "@/components/core/utils/useShadowMotion";

import type { UseCardAnimationsProps } from "./cardTypes";

export function useCardAnimations({
  pressable,
  isGloss,
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
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
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
      if (!pressable || e.defaultPrevented || prefersReducedInteractiveHoverLift()) {
        return;
      }
      const shell = rootRef.current;
      if (!shell) return;

      if (isGloss) {
        void animateGlossInteractivePressSqueeze(shell, pointerInsideRef.current);
        return;
      }

      void animateInteractivePressSqueeze(shell).then(() => {
        const el = rootRef.current;
        if (!el) return;
        if (shouldSkipInteractiveHoverLift()) return;
        if (pointerInsideRef.current) {
          animateInteractiveHoverLift(el, true, undefined, pressableLift.shadow);
        }
      });
    },
    [isGloss, onPointerDownProp, pressable, pressableLift.shadow],
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

  return {
    setRootRef,
    glossPointerHandlers,
    pressableLift,
    handlePointerDown,
    handleClick,
    handleKeyDown,
    onPointerOverProp,
    onPointerOutProp,
  };
}
