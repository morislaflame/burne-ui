/**
 * Shared container pointer enter/leave guards for hover-lift surfaces.
 * Callers supply enter/leave effects (standard lift, gloss, future plugins).
 */

import { useEffect, useMemo, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { cameFromOutsideContainer } from "./cameFromOutsideContainer";
import { killMotion } from "./gsapMotion";

export type UseContainerPointerHoverHandlersOptions<
  Element extends HTMLElement = HTMLElement,
> = {
  enabled: boolean;
  /** Element that receives the effect (may differ from `event.currentTarget`). */
  targetRef: RefObject<HTMLElement | null>;
  pointerInsideRef?: RefObject<boolean> | RefObject<boolean>;
  /**
   * Skip hover motion (touch / reduced-motion / feature flag).
   * Pass `shouldSkipInteractiveHoverLift` from hover-lift utils.
   */
  skipHover?: () => boolean;
  /** Kill GSAP on the target when the hook unmounts (default true). */
  killMotionOnUnmount?: boolean;
  onEnter: (el: HTMLElement, e: ReactPointerEvent<Element>) => void;
  onLeave: (el: HTMLElement, e: ReactPointerEvent<Element>) => void;
};

export function useContainerPointerHoverHandlers<
  Element extends HTMLElement = HTMLElement,
>({
  enabled,
  targetRef,
  pointerInsideRef,
  skipHover,
  killMotionOnUnmount = true,
  onEnter,
  onLeave,
}: UseContainerPointerHoverHandlersOptions<Element>): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  useEffect(() => {
    if (!killMotionOnUnmount) return;
    const t = targetRef.current;
    return () => {
      if (t) killMotion(t);
    };
  }, [killMotionOnUnmount, targetRef]);

  return useMemo(() => {
    const onPointerOver = (e: ReactPointerEvent<Element>) => {
      if (!enabled) return;
      if (e.defaultPrevented) return;
      const c = e.currentTarget;
      if (!(e.target instanceof Node) || !c.contains(e.target)) return;
      if (!cameFromOutsideContainer(c, e.relatedTarget)) return;
      if (skipHover?.()) return;
      const el = targetRef.current;
      if (!el) return;
      if (pointerInsideRef) pointerInsideRef.current = true;
      onEnter(el, e);
    };

    const onPointerOut = (e: ReactPointerEvent<Element>) => {
      const c = e.currentTarget;
      const rt = e.relatedTarget;
      if (rt instanceof Node && c.contains(rt)) return;

      if (pointerInsideRef) pointerInsideRef.current = false;
      if (!enabled) return;
      if (skipHover?.()) return;
      const el = targetRef.current;
      if (!el) return;
      onLeave(el, e);
    };

    return { onPointerOver, onPointerOut };
  }, [enabled, onEnter, onLeave, pointerInsideRef, skipHover, targetRef]);
}
