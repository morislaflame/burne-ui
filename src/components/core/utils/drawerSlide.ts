import type { GsapMotionVars } from "@/components/core/utils/modalSurfaceMotion";

export type DrawerSlidePlacement = "left" | "right" | "top" | "bottom";

/** Slide distance in px — stable for vertical drawers whose height grows after mount. */
export function measureDrawerSlideDistance(
  panel: HTMLElement,
  placement: DrawerSlidePlacement,
): number {
  return placement === "left" || placement === "right"
    ? panel.offsetWidth
    : panel.offsetHeight;
}

export function getDrawerSlideOpenFrom(
  panel: HTMLElement,
  placement: DrawerSlidePlacement,
): GsapMotionVars {
  const distance = measureDrawerSlideDistance(panel, placement);
  switch (placement) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "top":
      return { x: 0, y: -distance };
    case "bottom":
      return { x: 0, y: distance };
  }
}

export function getDrawerSlideRest(): GsapMotionVars {
  return { x: 0, y: 0 };
}

export function getDrawerSlideCloseTo(
  panel: HTMLElement,
  placement: DrawerSlidePlacement,
): GsapMotionVars {
  return getDrawerSlideOpenFrom(panel, placement);
}
