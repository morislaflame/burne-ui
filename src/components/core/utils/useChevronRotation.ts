import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { motionInteractive } from "./motionConfig";
import { prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

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
 * GSAP-поворот шеврона при open/close (Expandable, Accordion, ComboBox, Disclosure).
 */
export function useChevronRotation(
  open: boolean,
  chevronRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true,
  skipAnimRef?: RefObject<boolean>,
) {
  const initialOpenRef = useRef(open);
  const prevOpenRef = useRef<boolean | undefined>(undefined);

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

    const reduceMotion = prefersReducedInteractiveHoverLift() || !enabled();

    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      applyChevronRotationInstant(el, open);
      return;
    }

    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;

    killMotion(el);

    if (reduceMotion) {
      applyChevronRotationInstant(el, open);
      return;
    }

    gsap.to(el, {
      rotation: open ? 180 : 0,
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [open, chevronRef, enabled, skipAnimRef]);

  return bindChevronRef;
}
