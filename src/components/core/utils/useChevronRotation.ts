import { useLayoutEffect, useRef, type RefObject } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { motionInteractive } from "./motionConfig";
import { prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

/**
 * GSAP-поворот шеврона при open/close (Expandable, Accordion, ComboBox).
 */
export function useChevronRotation(
  open: boolean,
  chevronRef: RefObject<HTMLElement | null>,
  enabled: () => boolean = () => true,
) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const el = chevronRef.current;
    if (!el) return;

    const reduceMotion = prefersReducedInteractiveHoverLift() || !enabled();

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(el, { rotation: open ? 180 : 0 });
      return;
    }

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, { rotation: open ? 180 : 0 });
      return;
    }

    gsap.to(el, {
      rotation: open ? 180 : 0,
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [open, chevronRef, enabled]);
}
