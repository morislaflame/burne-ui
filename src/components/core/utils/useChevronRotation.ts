import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { motionInteractive } from "./motionConfig";
import { prefersReducedMotion, usePrefersReducedMotion } from "./reducedMotion";

const CHEVRON_INIT_ATTR = "data-chevron-init";

export function applyChevronRotationInstant(el: HTMLElement, open: boolean) {
  gsap.set(el, { rotation: open ? 180 : 0 });
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
 * GSAP chevron rotation on open/close (Expandable, Accordion, ComboBox, Disclosure).
 */
export function useChevronRotation(
  open: boolean,
  chevronRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true,
  skipAnimRef?: RefObject<boolean>,
) {
  const initialOpenRef = useRef(open);
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  const reduceMotionPreferred = usePrefersReducedMotion();

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

    animateChevronRotation(el, open, { reduced: reduceMotion });
  }, [open, chevronRef, enabled, skipAnimRef, reduceMotionPreferred]);

  return bindChevronRef;
}

export type AnimateChevronRotationOptions = {
  reduced?: boolean;
  duration?: number;
  ease?: string;
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
  const vars = motionInteractive();
  return gsap.to(el, {
    rotation: open ? 180 : 0,
    duration: options?.duration ?? vars.duration,
    ease: options?.ease ?? vars.ease,
    overwrite: "auto",
  });
}
