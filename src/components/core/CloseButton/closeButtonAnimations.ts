/**
 * Slot motion for CloseButton — look here first.
 *
 * DOM slots: `root` (`<button>`), `icon`
 *
 * Host: root (`useCloseButtonAnimations`) plays hover/press.
 * Defaults: first-level lift + squeeze; gloss recipes when gloss.
 * Ripple stays kit-internal.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";

import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import {
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import { useCloseButtonMotionScope } from "./closeButtonContext";
import { CLOSE_BUTTON_HAS_HOVER_SHADOW } from "./closeButtonStyles";
import type {
  CloseButtonMotion,
  CloseButtonVariant,
  UseCloseButtonAnimationsProps,
} from "./closeButtonTypes";

import "../utils/glossInteractive.css";

export function resolveCloseButtonMotionDefaults({
  variant,
  disabled,
}: {
  variant: CloseButtonVariant;
  disabled: boolean;
}): CloseButtonMotion {
  const isGloss = variant === "gloss";
  const enabled = !disabled;
  return {
    root: {
      hoverIn: enabled ? (isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel") : false,
      hoverOut: enabled ? (isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel") : false,
      pressIn: enabled ? (isGloss ? "pressSqueezeGloss" : "pressSqueeze") : false,
      pressOut: false,
    },
  };
}

export function resolveCloseButtonMotionParams({
  variant,
  disabled,
  pointerInside,
}: {
  variant: CloseButtonVariant;
  disabled: boolean;
  pointerInside: React.MutableRefObject<boolean>;
}) {
  return {
    pointerInside,
    hasHoverShadow: !disabled && CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant),
    isGloss: variant === "gloss",
  };
}

export function useCloseButtonAnimations({
  variant,
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
}: UseCloseButtonAnimationsProps) {
  const enabled = !disabled;
  const isGloss = variant === "gloss";
  const hasHoverShadow = CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant);
  const btnRef = useRef<HTMLButtonElement>(null);
  const scope = useCloseButtonMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, scope],
  );

  const btnShadow = useMemo(
    () => (hasHoverShadow && !isGloss ? shadowMotionFor("none") : undefined),
    [hasHoverShadow, isGloss],
  );

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
