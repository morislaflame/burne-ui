/**
 * Slot motion for Link — look here first.
 *
 * DOM slots: `root` (`<a>` / asChild host), `text`, `icon`
 *
 * Host: root (`useLinkAnimations`) plays hover/press.
 * Defaults: `hoverLiftFirstLevel` (no hover shadow) + `pressSqueeze` (`pressOut: false`).
 */
import { useCallback, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";

import {
  isInteractivePressKey,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";

import { useLinkMotionScope } from "./linkContext";
import type { LinkMotion, UseLinkAnimationsProps } from "./linkTypes";

export function resolveLinkMotionDefaults(): LinkMotion {
  return {
    root: {
      hoverIn: "hoverLiftFirstLevel",
      hoverOut: "hoverLiftFirstLevel",
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

export function useLinkAnimations({
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: UseLinkAnimationsProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const scope = useLinkMotionScope();
  const rootMotionRef = useRef(scope.getRootMotion()?.root);
  rootMotionRef.current = scope.getRootMotion()?.root;

  const setAnchorRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      anchorRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope],
  );

  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      const el = anchorRef.current;
      if (!el) return;
      const partMotion = rootMotionRef.current;
      const value = scope.resolve("root", phase, partMotion);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion, el });
    },
    [scope],
  );

  const motionPointer = useMotionPointerPhases<HTMLAnchorElement>({
    enabled: true,
    targetRef: anchorRef,
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
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented) return;
      playRoot("pressIn");
    },
    [onPointerDown, playRoot],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerUp?.(e);
      if (e.defaultPrevented) return;
      playRoot("pressOut");
    },
    [onPointerUp, playRoot],
  );

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(e);
    },
    [onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      onPointerLeave?.(e);
    },
    [onPointerLeave],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !isInteractivePressKey(e)) return;
      playRoot("pressIn");
    },
    [onKeyDown, playRoot],
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

  return {
    setAnchorRef,
    handlePointerEnter,
    handlePointerLeave,
    handleKeyDown,
    pointerHandlers,
  };
}
