import { Children, isValidElement, type ReactNode } from "react";

import type {
  RtlScrollType,
  ScrollAreaOrientation,
  ScrollAxis,
  ScrollMetrics,
} from "./scrollAreaTypes";

export const SCROLL_AREA_VIEWPORT_DISPLAY_NAME = "ScrollAreaViewport";
export const SCROLL_AREA_SCROLLBAR_DISPLAY_NAME = "ScrollAreaScrollbar";
export const SCROLL_AREA_THUMB_DISPLAY_NAME = "ScrollAreaThumb";
export const SCROLL_AREA_CORNER_DISPLAY_NAME = "ScrollAreaCorner";

export const SCROLL_AREA_HIDE_DELAY = 600;
export const SCROLL_AREA_KEY_STEP = 48;
export const SCROLL_AREA_MIN_THUMB = 24;

export const EMPTY_SCROLL_METRICS: ScrollMetrics = {
  viewport: 0,
  content: 0,
  scroll: 0,
  maxScroll: 0,
  overflowing: false,
  track: 0,
  thumbSize: 0,
  thumbOffset: 0,
};

function childDisplayName(node: ReactNode): string | undefined {
  if (!isValidElement(node)) return undefined;
  return (node.type as { displayName?: string }).displayName;
}

export function scrollAreaHasPart(children: ReactNode, displayName: string): boolean {
  return Children.toArray(children).some((node) => childDisplayName(node) === displayName);
}

export function scrollAreaIsCompound(children: ReactNode): boolean {
  return scrollAreaHasPart(children, SCROLL_AREA_VIEWPORT_DISPLAY_NAME);
}

export function scrollAxisMetrics(
  viewport: number,
  content: number,
  scroll: number,
  track = viewport,
): ScrollMetrics {
  const maxScroll = Math.max(0, content - viewport);
  const overflowing = maxScroll > 1 && track > 0 && viewport > 0;
  if (!overflowing) {
    return {
      viewport,
      content,
      scroll: 0,
      maxScroll: 0,
      overflowing: false,
      track,
      thumbSize: 0,
      thumbOffset: 0,
    };
  }
  const proportional = (viewport / content) * track;
  const thumbSize = Math.min(track, Math.max(Math.min(SCROLL_AREA_MIN_THUMB, track), proportional));
  const maxOffset = Math.max(0, track - thumbSize);
  const clamped = Math.min(maxScroll, Math.max(0, scroll));
  const thumbOffset = maxOffset === 0 ? 0 : (clamped / maxScroll) * maxOffset;
  return {
    viewport,
    content,
    scroll: clamped,
    maxScroll,
    overflowing: true,
    track,
    thumbSize,
    thumbOffset,
  };
}

export function scrollFromThumbOffset(offset: number, metrics: ScrollMetrics): number {
  const maxOffset = Math.max(1, metrics.track - metrics.thumbSize);
  if (!metrics.overflowing) return 0;
  const clamped = Math.min(maxOffset, Math.max(0, offset));
  return (clamped / maxOffset) * metrics.maxScroll;
}

export function scrollAreaNextOffset(
  current: number,
  metrics: ScrollMetrics,
  delta: number | "start" | "end",
): number {
  if (delta === "start") return 0;
  if (delta === "end") return metrics.maxScroll;
  return Math.min(metrics.maxScroll, Math.max(0, current + delta));
}

export function scrollAreaKeyDelta(
  key: string,
  axis: ScrollAxis,
  page: number,
  rtl = false,
  step = SCROLL_AREA_KEY_STEP,
): number | "start" | "end" | null {
  if (key === "Home") return "start";
  if (key === "End") return "end";
  const pageKey = key === "PageDown" || key === "PageUp";
  const towardEnd =
    axis === "vertical"
      ? key === "ArrowDown" || key === "PageDown"
      : rtl
        ? key === "ArrowLeft" || key === "PageDown"
        : key === "ArrowRight" || key === "PageDown";
  const towardStart =
    axis === "vertical"
      ? key === "ArrowUp" || key === "PageUp"
      : rtl
        ? key === "ArrowRight" || key === "PageUp"
        : key === "ArrowLeft" || key === "PageUp";
  if (towardEnd) return pageKey ? page : step;
  if (towardStart) return pageKey ? -page : -step;
  return null;
}

export function scrollAreaBarActive({
  overflowing,
  visibility,
  hovered,
  focused,
  scrolling,
  dragging,
}: {
  overflowing: boolean;
  visibility: "hover" | "scroll" | "always";
  hovered: boolean;
  focused: boolean;
  scrolling: boolean;
  dragging: boolean;
}): boolean {
  if (!overflowing) return false;
  if (visibility === "always" || focused || dragging) return true;
  if (visibility === "hover") return hovered;
  return scrolling;
}

export function inlineScrollOffset(
  scrollLeft: number,
  max: number,
  direction: "ltr" | "rtl",
  rtlType: RtlScrollType,
): number {
  if (direction !== "rtl") return scrollLeft;
  if (rtlType === "negative") return -scrollLeft;
  if (rtlType === "positive-descending") return max - scrollLeft;
  return scrollLeft;
}

export function inlineScrollLeft(
  offset: number,
  max: number,
  direction: "ltr" | "rtl",
  rtlType: RtlScrollType,
): number {
  const next = Math.min(max, Math.max(0, offset));
  if (direction !== "rtl") return next;
  if (rtlType === "negative") return -next;
  if (rtlType === "positive-descending") return max - next;
  return next;
}

let cachedRtlScrollType: RtlScrollType | null = null;

export function rtlScrollType(): RtlScrollType {
  if (cachedRtlScrollType) return cachedRtlScrollType;
  if (typeof document === "undefined" || !document.body) return "negative";
  const probe = document.createElement("div");
  const child = document.createElement("div");
  probe.dir = "rtl";
  probe.style.width = "4px";
  probe.style.height = "1px";
  probe.style.position = "absolute";
  probe.style.overflow = "scroll";
  probe.style.top = "-9999px";
  child.style.width = "8px";
  child.style.height = "1px";
  probe.appendChild(child);
  document.body.appendChild(probe);
  const initial = probe.scrollLeft;
  probe.scrollLeft = 1;
  const after = probe.scrollLeft;
  probe.remove();
  if (initial < 0) cachedRtlScrollType = "negative";
  else if (after > initial) cachedRtlScrollType = "positive-ascending";
  else cachedRtlScrollType = "positive-descending";
  return cachedRtlScrollType;
}

export function readInlineScroll(element: HTMLElement): number {
  const max = Math.max(0, element.scrollWidth - element.clientWidth);
  const direction = getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr";
  return inlineScrollOffset(element.scrollLeft, max, direction, rtlScrollType());
}

export function writeInlineScroll(element: HTMLElement, offset: number): void {
  const max = Math.max(0, element.scrollWidth - element.clientWidth);
  const direction = getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr";
  element.scrollLeft = inlineScrollLeft(offset, max, direction, rtlScrollType());
}

export function scrollAreaEnabledAxes(orientation: ScrollAreaOrientation): {
  vertical: boolean;
  horizontal: boolean;
} {
  return {
    vertical: orientation !== "horizontal",
    horizontal: orientation !== "vertical",
  };
}

export function bindScrollAreaThumbDrag(
  thumb: HTMLElement,
  event: {
    button: number;
    pointerId: number;
    clientX: number;
    clientY: number;
    preventDefault: () => void;
    stopPropagation: () => void;
  },
  options: {
    axis: ScrollAxis;
    viewport: HTMLElement;
    metrics: ScrollMetrics;
    onDragging: (dragging: boolean) => void;
  },
): void {
  if (event.button !== 0 || !options.metrics.overflowing) return;
  event.preventDefault();
  event.stopPropagation();
  thumb.setPointerCapture(event.pointerId);
  const { axis, viewport, metrics, onDragging } = options;
  const rtl = axis === "horizontal" && getComputedStyle(viewport).direction === "rtl";
  const sign = rtl ? -1 : 1;
  const startClient = axis === "vertical" ? event.clientY : event.clientX;
  const startScroll = axis === "vertical" ? viewport.scrollTop : readInlineScroll(viewport);
  const maxOffset = Math.max(1, metrics.track - metrics.thumbSize);
  onDragging(true);

  const move = (ev: PointerEvent) => {
    const client = axis === "vertical" ? ev.clientY : ev.clientX;
    const delta = (client - startClient) * sign;
    const next = startScroll + (delta / maxOffset) * metrics.maxScroll;
    if (axis === "vertical") viewport.scrollTop = next;
    else writeInlineScroll(viewport, next);
  };
  const end = () => {
    thumb.removeEventListener("pointermove", move);
    thumb.removeEventListener("pointerup", end);
    thumb.removeEventListener("pointercancel", end);
    onDragging(false);
  };
  thumb.addEventListener("pointermove", move);
  thumb.addEventListener("pointerup", end);
  thumb.addEventListener("pointercancel", end);
}

export function jumpScrollAreaToPointer(
  bar: HTMLElement,
  event: { clientX: number; clientY: number; target: EventTarget | null; currentTarget: EventTarget | null },
  options: { axis: ScrollAxis; viewport: HTMLElement; metrics: ScrollMetrics },
): void {
  if (event.target !== event.currentTarget) return;
  const { axis, viewport, metrics } = options;
  if (!metrics.overflowing) return;
  const rect = bar.getBoundingClientRect();
  const rtl = axis === "horizontal" && getComputedStyle(viewport).direction === "rtl";
  const local = axis === "vertical" ? event.clientY - rect.top : event.clientX - rect.left;
  const along = rtl ? rect.width - local : local;
  const next = scrollFromThumbOffset(along - metrics.thumbSize / 2, metrics);
  if (axis === "vertical") viewport.scrollTop = next;
  else writeInlineScroll(viewport, next);
}

export function applyScrollAreaKey(
  viewport: HTMLElement,
  axis: ScrollAxis,
  metrics: ScrollMetrics,
  key: string,
): boolean {
  const rtl = axis === "horizontal" && getComputedStyle(viewport).direction === "rtl";
  const delta = scrollAreaKeyDelta(key, axis, metrics.viewport, rtl);
  if (delta == null || !metrics.overflowing) return false;
  const current = axis === "vertical" ? viewport.scrollTop : readInlineScroll(viewport);
  const next = scrollAreaNextOffset(current, metrics, delta);
  if (axis === "vertical") viewport.scrollTop = next;
  else writeInlineScroll(viewport, next);
  return true;
}

export function paintScrollThumb(bar: HTMLElement, metrics: ScrollMetrics): void {
  bar.style.setProperty("--scroll-thumb-size", `${metrics.thumbSize}px`);
  bar.style.setProperty("--scroll-thumb-offset", `${metrics.thumbOffset}px`);
}
