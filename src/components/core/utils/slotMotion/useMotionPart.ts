import { useCallback, useLayoutEffect, useMemo, useRef, type ForwardedRef, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import type { MotionScopeValue } from "./createMotionScope";
import type { MotionPartPhases } from "./slotMotionTypes";
import { useMotionPointerPhases } from "./useMotionPointerPhases";

export function mergeMotionPointerHandlers<E extends HTMLElement>(
  userOver: ((e: ReactPointerEvent<E>) => void) | undefined,
  userOut: ((e: ReactPointerEvent<E>) => void) | undefined,
  motionOver: (e: ReactPointerEvent<E>) => void,
  motionOut: (e: ReactPointerEvent<E>) => void,
): {
  onPointerOver: (e: ReactPointerEvent<E>) => void;
  onPointerOut: (e: ReactPointerEvent<E>) => void;
} {
  return {
    onPointerOver: (e: ReactPointerEvent<E>) => {
      userOver?.(e);
      motionOver(e);
    },
    onPointerOut: (e: ReactPointerEvent<E>) => {
      userOut?.(e);
      motionOut(e);
    },
  };
}

export function mergeMotionPressHandlers<E extends HTMLElement>(
  userDown: ((e: ReactPointerEvent<E>) => void) | undefined,
  userUp: ((e: ReactPointerEvent<E>) => void) | undefined,
  motionDown: (e: ReactPointerEvent<E>) => void,
  motionUp: (e: ReactPointerEvent<E>) => void,
): {
  onPointerDown: (e: ReactPointerEvent<E>) => void;
  onPointerUp: (e: ReactPointerEvent<E>) => void;
} {
  return {
    onPointerDown: (e: ReactPointerEvent<E>) => {
      userDown?.(e);
      motionDown(e);
    },
    onPointerUp: (e: ReactPointerEvent<E>) => {
      userUp?.(e);
      motionUp(e);
    },
  };
}

/**
 * Registers a compound part as a motion target and optionally plays local hover/press phases.
 * User pointer handlers belong here — Parts must not merge them locally.
 */
export function useMotionPart<T extends HTMLElement>({
  scope,
  slot,
  motion,
  forwardedRef,
  pointerPhases = false,
  pressPhases = false,
  skipHover = shouldSkipInteractiveHoverLift,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  scope: MotionScopeValue | null;
  slot: string;
  motion?: MotionPartPhases;
  forwardedRef?: ForwardedRef<T>;
  /** When true, hoverIn/hoverOut on this node (trigger = this part). */
  pointerPhases?: boolean;
  /** When true, pressIn/pressOut on pointer down/up (trigger = this part). */
  pressPhases?: boolean;
  skipHover?: () => boolean;
  onPointerOver?: (e: ReactPointerEvent<T>) => void;
  onPointerOut?: (e: ReactPointerEvent<T>) => void;
  onPointerDown?: (e: ReactPointerEvent<T>) => void;
  onPointerUp?: (e: ReactPointerEvent<T>) => void;
}): {
  setRef: (node: T | null) => void;
  targetRef: RefObject<T | null>;
  pointerHandlers: {
    onPointerOver: (e: ReactPointerEvent<T>) => void;
    onPointerOut: (e: ReactPointerEvent<T>) => void;
    onPointerDown: (e: ReactPointerEvent<T>) => void;
    onPointerUp: (e: ReactPointerEvent<T>) => void;
  };
} {
  const targetRef = useRef<T | null>(null);
  const motionRef = useRef(motion);
  motionRef.current = motion;

  useLayoutEffect(() => {
    scope?.registerPartMotion(slot, motion);
    return () => scope?.registerPartMotion(slot, undefined);
  }, [motion, scope, slot]);

  const setRef = useCallback(
    (node: T | null) => {
      targetRef.current = node;
      scope?.registerTarget(slot, node);
      if (forwardedRef != null) mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope, slot],
  );

  const motionPointer = useMotionPointerPhases<T>({
    enabled: Boolean(scope && pointerPhases),
    targetRef,
    skipHover,
    onHoverIn: (el) => {
      if (!scope) return;
      const value = scope.resolve(slot, "hoverIn", motionRef.current);
      if (value === undefined) return;
      scope.play(slot, "hoverIn", { partMotion: motionRef.current, el });
    },
    onHoverOut: (el) => {
      if (!scope) return;
      const value = scope.resolve(slot, "hoverOut", motionRef.current);
      if (value === undefined) return;
      scope.play(slot, "hoverOut", { partMotion: motionRef.current, el });
    },
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

  const pressHandlers = useMemo(
    () =>
      mergeMotionPressHandlers(
        onPointerDown,
        onPointerUp,
        (e: ReactPointerEvent<T>) => {
          if (!scope || !pressPhases || e.defaultPrevented) return;
          const el = targetRef.current;
          if (!el) return;
          const value = scope.resolve(slot, "pressIn", motionRef.current);
          if (value === undefined) return;
          scope.play(slot, "pressIn", { partMotion: motionRef.current, el });
        },
        (e: ReactPointerEvent<T>) => {
          if (!scope || !pressPhases || e.defaultPrevented) return;
          const el = targetRef.current;
          if (!el) return;
          const value = scope.resolve(slot, "pressOut", motionRef.current);
          if (value === undefined) return;
          scope.play(slot, "pressOut", { partMotion: motionRef.current, el });
        },
      ),
    [onPointerDown, onPointerUp, pressPhases, scope, slot],
  );

  const pointerHandlers = useMemo(
    () => ({ ...hoverHandlers, ...pressHandlers }),
    [hoverHandlers, pressHandlers],
  );

  return { setRef, targetRef, pointerHandlers };
}
