import { createContext, createElement, useContext, useMemo, type ReactNode, type RefObject } from "react";

/** Shared side for every floating overlay. */
export const OVERLAY_SIDES = ["top", "right", "bottom", "left"] as const;
export type OverlaySide = (typeof OVERLAY_SIDES)[number];
export type OverlayAlign = "start" | "center" | "end";

/**
 * Placement lives on one part (the floating panel) and may be repeated on the
 * root so the simple API can set it. The panel value wins.
 */
export type OverlayPlacementProps = {
  side?: OverlaySide;
  align?: OverlayAlign;
  offset?: number;
  /** Viewport inset used when flipping and clamping. Default 8. */
  collisionPadding?: number;
  /** Flip to a side that fits. Default true. */
  avoidCollisions?: boolean;
};

export type OverlayDismissEvent = {
  preventDefault: () => void;
  readonly defaultPrevented: boolean;
  target: EventTarget | null;
};

/**
 * One close dictionary for Dialog, Drawer, AlertDialog, Popover, Dropdown,
 * HoverCard and Tooltip.
 * `preventDefault()` on the callback keeps the overlay open.
 */
export type OverlayDismissProps = {
  /** Escape closes. Default true. */
  closeOnEscape?: boolean;
  /** Pointer outside the panel (backdrop or document) closes. */
  closeOnInteractOutside?: boolean;
  onEscapeKeyDown?: (event: OverlayDismissEvent) => void;
  onInteractOutside?: (event: OverlayDismissEvent) => void;
  /** Element to focus when the overlay opens. Default: first tab stop in the panel. */
  initialFocus?: RefObject<HTMLElement | null> | null;
};

/** Runs the handler, then returns whether the overlay should close. */
export function overlayShouldClose(
  event: OverlayDismissEvent,
  handler: ((event: OverlayDismissEvent) => void) | undefined,
  allow: boolean,
): boolean {
  handler?.(event);
  if (event.defaultPrevented) return false;
  return allow;
}

export type OverlayDelayValue = {
  openDelay?: number;
  closeDelay?: number;
};

const OverlayDelayContext = createContext<OverlayDelayValue>({});

/** Shared open/close delays for Tooltip and HoverCard in a subtree. */
export function OverlayDelayProvider({
  openDelay,
  closeDelay,
  children,
}: OverlayDelayValue & { children: ReactNode }) {
  const value = useMemo(() => ({ openDelay, closeDelay }), [openDelay, closeDelay]);
  return createElement(OverlayDelayContext.Provider, { value }, children);
}

export function useOverlayDelay(): OverlayDelayValue {
  return useContext(OverlayDelayContext);
}
