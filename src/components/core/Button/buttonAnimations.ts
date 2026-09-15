/**
 * Slot motion for Button — look here first.
 *
 * DOM slots: `root` (the `<button>`, or the inner content span when `groupSegment`),
 * `label`, `icon`, `text`, `loader`, `success`, `error`
 * (`content` is layout — not a slot, except it carries `root` when `groupSegment`)
 *
 * Host: root (`useButtonAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`
 * and broadcasts those phases to nested slots (`exclude` root + overlay layers).
 * Defaults: `resolveButtonMotionDefaults` (first-level lift + squeeze; gloss recipes when gloss).
 * Overlay `loader` / `success` / `error` stay CSS-hidden until the app plays `motion.states`.
 */
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";

import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import {
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import {
  killStoredMotion,
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
} from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import { useButtonMotionScope } from "./buttonContext";
import type {
  ButtonMotion,
  ButtonVariant,
  UseButtonAnimationsProps,
} from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";

/** Nested pointer broadcast skips overlay layers (app `motion.states` owns their autoAlpha). */
const BUTTON_POINTER_BROADCAST_EXCLUDE = ["root", "loader", "success", "error"] as const;

export function resolveButtonMotionDefaults({
  variant,
}: {
  variant: ButtonVariant;
}): ButtonMotion {
  const isGloss = variant === "gloss";
  return {
    root: {
      hoverIn: isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel",
      hoverOut: isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel",
      pressIn: isGloss ? "pressSqueezeGloss" : "pressSqueeze",
      pressOut: false,
    },
  };
}

export function useButtonAnimations({
  variant,
  blocked,
  groupSegment,
  motion,
  hoverPointerInsideRef,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: UseButtonAnimationsProps) {
  const isGloss = variant === "gloss";
  const useContentRef = Boolean(groupSegment);
  const hasHoverShadow = BUTTON_VARIANT_HAS_HOVER_SHADOW.has(variant) && !isGloss && !useContentRef;
  const enabled = !blocked;
  const scope = useButtonMotionScope();
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const motionTarget = useCallback(
    () => (useContentRef ? contentMotionRef.current : btnRef.current),
    [useContentRef],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      if (!useContentRef) scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, scope, useContentRef],
  );

  const btnShadow = useMemo(
    () => (hasHoverShadow ? shadowMotionFor("none") : undefined),
    [hasHoverShadow],
  );

  useLayoutEffect(() => {
    if (!enabled || !btnShadow || useContentRef) return;
    initElementShadow(btnRef.current, shadowNone());
  }, [btnShadow, enabled, useContentRef]);

  useEffect(() => {
    if (enabled) return;
    hoverPointerInsideRef.current = false;
    const el = btnRef.current;
    const content = contentMotionRef.current;
    if (el) {
      killStoredMotion(el);
      el.style.removeProperty("--el-shadow");
      el.style.removeProperty("box-shadow");
      gsap.set(el, { clearProps: "boxShadow,scale,transform" });
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [enabled, hoverPointerInsideRef]);

  useEffect(() => {
    const contentRef = contentMotionRef;
    return () => {
      if (contentRef.current) killMotion(contentRef.current);
    };
  }, []);

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!enabled) return;
      const el = motionTarget();
      if (el) {
        const value = scope.resolve("root", phase, rootMotionRef.current);
        if (value !== undefined) {
          scope.play("root", phase, { partMotion: rootMotionRef.current, el });
        }
      }
      void scope.playBroadcast(phase, { exclude: [...BUTTON_POINTER_BROADCAST_EXCLUDE] });
    },
    [enabled, motionTarget, scope],
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

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: hoverHandlers.onPointerOver,
      onPointerOut: hoverHandlers.onPointerOut,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    }),
    [handlePointerDown, handlePointerUp, hoverHandlers],
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
    contentMotionRef,
    pointerHandlers,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
  };
}
