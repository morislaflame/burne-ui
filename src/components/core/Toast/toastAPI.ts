import { Children, isValidElement, type ReactNode } from "react";
 
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { ToastEntry, ToastStackItemLayout, ToastStatus } from "./toastTypes";
 
/** Toast stack peek above the next card — intentional layout constant. */
export const TOAST_STACK_PEEK_PX = 8;
/** Vertical gap between cards when the stack expands on hover/focus. */
export const TOAST_STACK_EXPANDED_GAP_PX = 10;
/** Fallback card height when DOM layout is unmeasured (SSR / jsdom). */
export const TOAST_EXPANDED_FALLBACK_HEIGHT_PX = 64;
/** Per-depth scale step in the toast stack — intentional layout constant. */
export const TOAST_STACK_SCALE_STEP = 0.04;
export const TOAST_MAX_VISIBLE = 3;
export const TOAST_DEFAULT_DURATION_MS = 4000;
/** Enter slide offset — intentional motion constant (not in `configureMotion`). */
export const TOAST_ENTRY_OFFSET_PX = 24;
 
/** Stack container height: front card + peek for visible depth (capped). */
export function resolveToastStackContainerHeight(
  frontHeight: number,
  stackCount: number,
): number {
  if (frontHeight <= 0 || stackCount <= 0) return 0;
  const extraPeek =
    Math.min(stackCount - 1, TOAST_MAX_VISIBLE - 1) * TOAST_STACK_PEEK_PX;
  return frontHeight + extraPeek;
}

/** Computes collapsed peek or expanded hover layout for all items in a viewport. */
export function resolveToastStackLayout({
  sorted,
  dismissingIds,
  heights,
  isTop,
  paused,
}: {
  sorted: readonly ToastEntry[];
  dismissingIds: ReadonlySet<string>;
  heights: Readonly<Record<string, number>>;
  isTop: boolean;
  paused: boolean;
}): {
  expanded: boolean;
  containerHeight: number;
  items: Map<string, ToastStackItemLayout>;
} {
  const activeEntries = sorted.filter((entry) => !dismissingIds.has(entry.id));
  const expanded = paused && activeEntries.length > 1;
  const frontId = activeEntries[0]?.id ?? sorted[0]?.id;
  const frontMeasured = frontId != null ? (heights[frontId] ?? 0) : 0;

  const heightOf = (id: string): number => {
    const measured = heights[id] ?? 0;
    if (measured > 0) return measured;
    return frontMeasured > 0 ? frontMeasured : TOAST_EXPANDED_FALLBACK_HEIGHT_PX;
  };

  const items = new Map<string, ToastStackItemLayout>();
  let runningOffset = 0;
  let lastVisibleOffset = 0;

  for (let activeIdx = 0; activeIdx < activeEntries.length; activeIdx++) {
    const entry = activeEntries[activeIdx]!;
    const hidden = activeIdx >= TOAST_MAX_VISIBLE;
    const opacity = hidden ? 0 : 1;

    if (expanded) {
      if (!hidden) {
        lastVisibleOffset = runningOffset;
        items.set(entry.id, {
          peekY: runningOffset === 0 ? 0 : isTop ? runningOffset : -runningOffset,
          scale: 1,
          opacity,
          hidden: false,
          interactive: true,
        });
        runningOffset += heightOf(entry.id) + TOAST_STACK_EXPANDED_GAP_PX;
      } else {
        items.set(entry.id, {
          peekY: lastVisibleOffset === 0 ? 0 : isTop ? lastVisibleOffset : -lastVisibleOffset,
          scale: 1 - (TOAST_MAX_VISIBLE - 1) * TOAST_STACK_SCALE_STEP,
          opacity: 0,
          hidden: true,
          interactive: false,
        });
      }
    } else {
      const capped = Math.min(activeIdx, TOAST_MAX_VISIBLE - 1);
      const collapsedOffset = capped * TOAST_STACK_PEEK_PX;
      items.set(entry.id, {
        peekY: collapsedOffset === 0 ? 0 : isTop ? collapsedOffset : -collapsedOffset,
        scale: 1 - capped * TOAST_STACK_SCALE_STEP,
        opacity,
        hidden,
        interactive: activeIdx === 0,
      });
    }
  }

  for (const entry of sorted) {
    if (!items.has(entry.id)) {
      items.set(entry.id, {
        peekY: 0,
        scale: 1,
        opacity: 1,
        hidden: false,
        interactive: false,
      });
    }
  }

  let containerHeight: number;
  if (expanded) {
    const visibleActive = activeEntries.slice(0, TOAST_MAX_VISIBLE);
    const cardsHeight = visibleActive.reduce((sum, entry) => sum + heightOf(entry.id), 0);
    const gapsHeight = Math.max(0, visibleActive.length - 1) * TOAST_STACK_EXPANDED_GAP_PX;
    containerHeight = cardsHeight + gapsHeight;
  } else {
    containerHeight = resolveToastStackContainerHeight(frontMeasured, activeEntries.length);
  }

  return { expanded, containerHeight, items };
}
 
export function createToastId(): string {
  return `toast-${Math.random().toString(36).slice(2)}`;
}
 
function walkToastChildren(
  node: ReactNode,
  match: (displayName: string | undefined) => boolean,
): boolean {
  let found = false;
 
  const walk = (current: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(current)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      if (match(displayName)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };
 
  walk(node);
  return found;
}
 
export function toastHasTitle(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastTitle");
}
 
export function toastHasDescription(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastDescription");
}
 
export function toastHasIndicator(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastIndicator");
}
 
export function toastHasAction(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastAction");
}
 
export function toastHasClose(children: ReactNode): boolean {
  return walkToastChildren(children, (name) => name === "ToastClose");
}
 
export function toastShowsIndicator(
  status: ToastStatus,
  loading: boolean,
  isCompound: boolean,
  compoundHasIndicator: boolean,
): boolean {
  if (isCompound) return compoundHasIndicator;
  if (loading) return true;
  return status !== "default";
}
 
export function resolveToastGridSlots(
  status: ToastStatus,
  title: ReactNode | undefined,
  description: ReactNode | undefined,
  action: ReactNode | undefined,
  onClose: (() => void) | undefined,
  loading: boolean,
  isCompound: boolean,
  children: ReactNode,
): MessageBannerGridSlots {
  const hasTitle = title != null || toastHasTitle(children);
  const hasDescription = description != null || toastHasDescription(children);
 
  return {
    hasIndicator: toastShowsIndicator(
      status,
      loading,
      isCompound,
      toastHasIndicator(children),
    ),
    hasTitle,
    hasDescription,
    hasAction: isCompound ? toastHasAction(children) : action != null,
    hasClose: isCompound ? toastHasClose(children) : onClose != null,
  };
}
 