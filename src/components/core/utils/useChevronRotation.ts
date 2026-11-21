import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
 
import { gsap, killMotion } from "./gsapMotion";
import { motionInteractiveFor, resolveMotionConfig, type MotionConfig } from "./motionConfig";
import { useMotionConfig } from "./motionConfigContext";
import { prefersReducedMotion, usePrefersReducedMotion } from "./reducedMotion";
import type { MotionTransformVars, MotionValue } from "./slotMotion/slotMotionTypes";

type ChevronMotionScope = {
  resolve: (slot: string, phase: "enter" | "leave") => MotionValue | undefined;
  play: (slot: string, phase: "enter" | "leave", options?: { el?: HTMLElement | null }) => void;
};
 
const CHEVRON_INIT_ATTR = "data-chevron-init";

/** Stable default. An inline `() => true` would rerun the layout effect every render. */
function chevronRotationEnabled() {
  return true;
}
 
export function applyChevronRotationInstant(el: HTMLElement, open: boolean) {
  const vars: MotionTransformVars = { rotation: open ? 180 : 0 };
  gsap.set(el, vars);
}
 
export function createChevronRotationRefCallback(
  ref: RefObject<HTMLElement | null>,
  initialOpen: boolean,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && !node.hasAttribute(CHEVRON_INIT_ATTR)) {
      node.setAttribute(CHEVRON_INIT_ATTR, "");
      applyChevronRotationInstant(node, initialOpen);
    }
  };
}
 
/**
 * Chevron rotation. With a scope, plays `chevronRotate` on `enter` / `leave`.
 * Without one, calls `animateChevronRotation` (the same engine the recipe uses).
 */
export function useChevronRotation(
  open: boolean,
  chevronRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = chevronRotationEnabled,
  skipAnimRef?: RefObject<boolean>,
  scope?: ChevronMotionScope | null,
  slot = "chevron",
) {
  const initialOpenRef = useRef(open);
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  const reduceMotionPreferred = usePrefersReducedMotion();
  const config = useMotionConfig();
 
  const bindChevronRef = useMemo(
    () => createChevronRotationRefCallback(chevronRef, initialOpenRef.current),
    [chevronRef],
  );
 
  useLayoutEffect(() => {
    const el = chevronRef.current;
    if (!el) return;
 
    if (skipAnimRef?.current) {
      skipAnimRef.current = false;
      prevOpenRef.current = open;
      applyChevronRotationInstant(el, open);
      return;
    }
 
    const reduceMotion = reduceMotionPreferred || !enabled();
 
    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      applyChevronRotationInstant(el, open);
      return;
    }
 
    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;

    if (!enabled()) {
      applyChevronRotationInstant(el, open);
      return;
    }

    if (scope) {
      const phase = open ? "enter" : "leave";
      const value = scope.resolve(slot, phase);
      if (value === false || value === undefined) {
        applyChevronRotationInstant(el, open);
        return;
      }
      scope.play(slot, phase, { el });
      return;
    }

    animateChevronRotation(el, open, { reduced: reduceMotion, config });
  }, [config, enabled, open, chevronRef, reduceMotionPreferred, scope, skipAnimRef, slot]);
 
  return bindChevronRef;
}
 
export type AnimateChevronRotationOptions = {
  reduced?: boolean;
  duration?: number;
  ease?: string;
  config?: Readonly<MotionConfig>;
};
 
/** Rotation tween for a chevron. Used by `useChevronRotation` and the `chevronRotate` recipe. */
export function animateChevronRotation(
  el: HTMLElement,
  open: boolean,
  options?: AnimateChevronRotationOptions,
) {
  const reduced = options?.reduced ?? prefersReducedMotion();
  killMotion(el);
  if (reduced) {
    applyChevronRotationInstant(el, open);
    return undefined;
  }
  const timing = motionInteractiveFor(resolveMotionConfig(options?.config));
  const vars: MotionTransformVars = {
    rotation: open ? 180 : 0,
    duration: options?.duration ?? timing.duration,
    ease: options?.ease ?? timing.ease,
  };
  return gsap.to(el, {
    ...vars,
    overwrite: "auto",
  });
}
 