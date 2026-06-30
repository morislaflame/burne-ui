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

export function getDrawerSlideInFrom(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left":
      return { xPercent: -100 };
    case "right":
      return { xPercent: 100 };
    case "top":
      return { yPercent: -100 };
    case "bottom":
      return { yPercent: 100 };
  }
}

export function getDrawerSlideInTo(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left":
    case "right":
      return { xPercent: 0 };
    case "top":
    case "bottom":
      return { yPercent: 0 };
  }
}

export function getDrawerSlideOutTo(placement: DrawerPlacement): GsapMotionVars {
  switch (placement) {
    case "left":
      return { xPercent: -100 };
    case "right":
      return { xPercent: 100 };
    case "top":
      return { yPercent: -100 };
    case "bottom":
      return { yPercent: 100 };
  }
}
