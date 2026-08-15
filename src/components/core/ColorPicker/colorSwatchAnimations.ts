/**
 * Slot motion for ColorSwatch — look here first.
 *
 * DOM slots: `root` (interactive `<button>` only)
 *
 * Decorative `<span>` (no onClick) has no motion scope.
 * Host: `useColorSwatchAnimations` — first-level lift with hover shadow + squeeze.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";

import {
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import { useColorSwatchMotionScope } from "./colorSwatchContext";
import type { ColorSwatchMotion, UseColorSwatchAnimationsProps } from "./colorSwatchTypes";

export function resolveColorSwatchMotionDefaults({
  disabled,
}: {
  disabled: boolean;
}): ColorSwatchMotion {
  const enabled = !disabled;
  return {
    root: {
      hoverIn: enabled ? "hoverLiftFirstLevel" : false,
      hoverOut: enabled ? "hoverLiftFirstLevel" : false,
      pressIn: enabled ? "pressSqueeze" : false,
      pressOut: false,
    },
  };
}

export function resolveColorSwatchMotionParams({
  disabled,
  pointerInside,
}: {
  disabled: boolean;
  pointerInside: React.MutableRefObject<boolean>;
}) {
  return {
    pointerInside,
    hasHoverShadow: !disabled,
    isGloss: false,
  };
}

export function useColorSwatchAnimations({
  disabled,
  forwardedRef,
  motion,
  hoverPointerInsideRef,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onKeyDown,
}: UseColorSwatchAnimationsProps) {
  const enabled = !disabled;
  const btnRef = useRef<HTMLButtonElement>(null);
  const scope = useColorSwatchMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      btnRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope],
  );

  const btnShadow = useMemo(() => (enabled ? shadowMotionFor("none") : undefined), [enabled]);

  useLayoutEffect(() => {
    if (!enabled || !btnShadow) return;
    initElementShadow(btnRef.current, shadowNone());
  }, [btnShadow, enabled]);

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!enabled) return;
      const el = btnRef.current;
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [enabled, scope],
  );

  const motionPointer = useMotionPointerPhases<HTMLButtonElement>({
    enabled,
    targetRef: btnRef,
    pointerInsideRef: hoverPointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playRoot("hoverIn"),
    onHoverOut: () => playRoot("hoverOut"),
  });

  const hoverHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOver,
        onPointerOut,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOut, onPointerOver],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (!enabled || e.defaultPrevented) return;
      playRoot("pressIn");
    },
    [enabled, onPointerDown, playRoot],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (!enabled || e.defaultPrevented) return;
      playRoot("pressOut");
    },
    [enabled, onPointerUp, playRoot],
  );

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
    },
    [onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
    },
    [onPointerLeave],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (!enabled || e.defaultPrevented || !isInteractivePressKey(e)) return;
      playRoot("pressIn");
    },
    [enabled, onKeyDown, playRoot],
  );

  return {
    setRefs,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
    pointerHandlers: hoverHandlers,
  };
}
