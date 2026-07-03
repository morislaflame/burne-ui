import type { ClassValue } from "clsx";
import { Children, isValidElement, type ReactNode } from "react";

import type { GsapMotionVars } from "@/components/core/utils/modalSurfaceMotion";
import { cn } from "@/utils/cn";

import type { DrawerBackdropProps, DrawerPanelSegment, DrawerPlacement } from "./drawerTypes";

export function mergeDrawerSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function readDrawerPartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

export function partitionDrawerChildren(children: ReactNode): {
  backdropIsDismissable: boolean;
  panelSegments: DrawerPanelSegment[];
} {
  let backdropIsDismissable = true;
  const panelSegments: DrawerPanelSegment[] = [];
  let contentChunk: ReactNode[] = [];

  const flushContent = () => {
    if (contentChunk.length === 0) return;
    const chunk = contentChunk;
    contentChunk = [];
    panelSegments.push({ kind: "content", children: chunk });
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      contentChunk.push(child);
      return;
    }

    const name = readDrawerPartDisplayName(child.type);
    if (name === "DrawerBackdrop") {
      const props = child.props as DrawerBackdropProps;
      if (props.isDismissable === false) backdropIsDismissable = false;
      return;
    }

    if (name === "DrawerHandle") {
      flushContent();
      panelSegments.push({ kind: "handle", node: child });
      return;
    }

    contentChunk.push(child);
  });

  flushContent();

  return { backdropIsDismissable, panelSegments };
}

/** Slide distance in px — stable for vertical drawers whose height grows after mount. */
export function measureDrawerSlideDistance(
  panel: HTMLElement,
  placement: DrawerPlacement,
): number {
  return placement === "left" || placement === "right"
    ? panel.offsetWidth
    : panel.offsetHeight;
}

export function getDrawerSlideOpenFrom(
  panel: HTMLElement,
  placement: DrawerPlacement,
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
  placement: DrawerPlacement,
): GsapMotionVars {
  return getDrawerSlideOpenFrom(panel, placement);
}
