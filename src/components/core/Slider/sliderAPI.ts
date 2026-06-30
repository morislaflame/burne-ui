import { Children, isValidElement, useCallback, useState, type ReactNode } from "react";

import { selectionIndicatorFallbackPx } from "@/components/core/SelectionIndicator";
import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type {
  FillSpan,
  SliderDisplayState,
  SliderOrientation,
  SliderSize,
} from "./sliderTypes";

export function mergeSliderSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function sliderThicknessToCss(thickness: number | string): string {
  return typeof thickness === "number" ? `${thickness}px` : thickness;
}

export const SLIDER_THUMB_PX: Record<SliderSize, number> = {
  small: selectionIndicatorFallbackPx("small"),
  base: selectionIndicatorFallbackPx("base"),
  mid: selectionIndicatorFallbackPx("mid"),
  large: selectionIndicatorFallbackPx("large"),
};

export function clampSliderValue(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function sliderValueToPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export function sliderValueToRatio(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return (value - min) / (max - min);
}

export function sliderThumbCenterPercent(
  value: number,
  min: number,
  max: number,
  trackPx: number,
  thumbPx: number,
): number {
  if (trackPx <= 0) return sliderValueToPercent(value, min, max);
  if (trackPx <= thumbPx) return 50;
  const half = thumbPx / 2;
  const travel = trackPx - thumbPx;
  const centerPx = half + sliderValueToRatio(value, min, max) * travel;
  return (centerPx / trackPx) * 100;
}

export function sliderThumbCenterPx(
  value: number,
  min: number,
  max: number,
  trackPx: number,
  thumbPx: number,
): number {
  if (trackPx <= thumbPx) return trackPx / 2;
  const half = thumbPx / 2;
  return half + sliderValueToRatio(value, min, max) * (trackPx - thumbPx);
}

export function sliderFillSpanForValues(
  trackPx: number,
  thumbPx: number,
  min: number,
  max: number,
  range: boolean,
  singleValue: number,
  rangeValue: [number, number],
): FillSpan {
  if (trackPx <= 0) {
    return { start: 0, end: sliderValueToPercent(singleValue, min, max) };
  }

  const half = thumbPx / 2;

  if (range) {
    const loPx = sliderThumbCenterPx(rangeValue[0], min, max, trackPx, thumbPx);
    const hiPx = sliderThumbCenterPx(rangeValue[1], min, max, trackPx, thumbPx);
    return {
      start: (Math.max(0, loPx - half) / trackPx) * 100,
      end: (Math.min(trackPx, hiPx + half) / trackPx) * 100,
    };
  }

  const centerPx = sliderThumbCenterPx(singleValue, min, max, trackPx, thumbPx);
  return { start: 0, end: (Math.min(trackPx, centerPx + half) / trackPx) * 100 };
}

export function sliderFillStyleFromSpan(
  span: FillSpan,
  orientation: SliderOrientation,
): { left?: string; width?: string; bottom?: string; height?: string } {
  const size = span.end - span.start;
  if (orientation === "horizontal") {
    return { left: `${span.start}%`, width: `${size}%` };
  }
  return { bottom: `${span.start}%`, height: `${size}%` };
}

export function snapSliderToStep(value: number, min: number, max: number, step: number): number {
  if (step <= 0) return clampSliderValue(value, min, max);
  const steps = Math.round((value - min) / step);
  return clampSliderValue(min + steps * step, min, max);
}

export function snapSliderToMarks(value: number, marks: number[]): number {
  if (marks.length === 0) return value;
  let nearest = marks[0]!;
  let best = Math.abs(value - nearest);
  for (const mark of marks) {
    const distance = Math.abs(value - mark);
    if (distance < best) {
      best = distance;
      nearest = mark;
    }
  }
  return nearest;
}

export function normalizeSliderMarks(
  marks: number[] | undefined,
  min: number,
  max: number,
): number[] | undefined {
  if (!marks?.length) return undefined;
  return [...new Set(marks.map((mark) => clampSliderValue(mark, min, max)))].toSorted(
    (a, b) => a - b,
  );
}

export function sliderPointerToValue(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  orientation: SliderOrientation,
  min: number,
  max: number,
  thumbPx: number,
): number {
  const span = orientation === "horizontal" ? rect.width : rect.height;
  const half = thumbPx / 2;
  const travel = span - thumbPx;

  if (travel <= 0) return min;

  const ratio =
    orientation === "horizontal"
      ? clampSliderValue((clientX - rect.left - half) / travel, 0, 1)
      : clampSliderValue(1 - (clientY - rect.top - half) / travel, 0, 1);

  return min + ratio * (max - min);
}

export function sliderAdjacentMark(
  value: number,
  marks: number[],
  direction: 1 | -1,
): number {
  const idx = marks.findIndex((mark) => mark === value);
  if (idx >= 0) {
    const next = marks[idx + direction];
    if (next !== undefined) return next;
    return value;
  }
  if (direction > 0) {
    return marks.find((mark) => mark > value) ?? marks[marks.length - 1]!;
  }
  return [...marks].reverse().find((mark) => mark < value) ?? marks[0]!;
}

export function sliderStepDelta(
  marks: number[] | undefined,
  step: number,
  key: string,
  orientation: SliderOrientation,
): number | "home" | "end" | "mark-prev" | "mark-next" {
  const isHoriz = orientation === "horizontal";
  if (marks?.length) {
    switch (key) {
      case "ArrowRight":
        return isHoriz ? "mark-next" : 0;
      case "ArrowLeft":
        return isHoriz ? "mark-prev" : 0;
      case "ArrowUp":
        return isHoriz ? 0 : "mark-next";
      case "ArrowDown":
        return isHoriz ? 0 : "mark-prev";
      case "Home":
        return "home";
      case "End":
        return "end";
      default:
        return 0;
    }
  }
  const big = step > 0 ? step * 10 : 10;
  switch (key) {
    case "ArrowRight":
      return isHoriz ? step : 0;
    case "ArrowLeft":
      return isHoriz ? -step : 0;
    case "ArrowUp":
      return isHoriz ? 0 : step;
    case "ArrowDown":
      return isHoriz ? 0 : -step;
    case "PageUp":
      return big;
    case "PageDown":
      return -big;
    case "Home":
      return "home";
    case "End":
      return "end";
    default:
      return 0;
  }
}

export function defaultSliderFormatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function readSliderTrackMetrics(
  rect: DOMRect,
  orientation: SliderOrientation,
): { trackSpanPx: number; thumbSpanPx: number } {
  const trackSpanPx = orientation === "horizontal" ? rect.width : rect.height;
  const thumbSpanPx = orientation === "horizontal" ? rect.height : rect.width;
  return { trackSpanPx, thumbSpanPx };
}

export function resolveSliderFallbackThumbPx(
  thickness: number | string | undefined,
  size: SliderSize,
): number {
  if (thickness == null) return SLIDER_THUMB_PX[size];
  if (typeof thickness === "number") return thickness;
  const trimmed = thickness.trim();
  const pxMatch = /^([\d.]+)px$/i.exec(trimmed);
  if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  const remMatch = /^([\d.]+)rem$/i.exec(trimmed);
  if (remMatch && typeof document !== "undefined") {
    const root =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.parseFloat(remMatch[1]!) * root;
  }
  return SLIDER_THUMB_PX[size];
}

export function sliderDisplayEqual(
  a: SliderDisplayState | null,
  b: SliderDisplayState | null,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.valueLabel === b.valueLabel &&
    a.min === b.min &&
    a.max === b.max &&
    a.range === b.range &&
    a.singleValue === b.singleValue &&
    a.rangeValue[0] === b.rangeValue[0] &&
    a.rangeValue[1] === b.rangeValue[1] &&
    a.label === b.label
  );
}

export function partitionSliderTrackChildren(children: ReactNode): {
  body: ReactNode | null;
  hasCompoundParts: boolean;
} {
  let hasCompoundParts = false;
  const parts: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      parts.push(child);
      continue;
    }
    const name = (child.type as { displayName?: string }).displayName;
    if (
      name === "SliderRail" ||
      name === "SliderFill" ||
      name === "SliderThumb" ||
      name === "SliderIcon"
    ) {
      hasCompoundParts = true;
    }
    parts.push(child);
  }

  if (!hasCompoundParts) return { body: null, hasCompoundParts: false };
  return { body: parts, hasCompoundParts: true };
}

export function useMergedSingle(
  value: number | undefined,
  defaultValue: number | undefined,
  min: number,
): [number, (next: number) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? min);
  const merged = isControlled ? value! : internal;
  const setMerged = useCallback(
    (next: number) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [merged, setMerged, isControlled];
}

export function useMergedRange(
  value: [number, number] | undefined,
  defaultValue: [number, number] | undefined,
  min: number,
  max: number,
): [[number, number], (next: [number, number]) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<[number, number]>(defaultValue ?? [min, max]);
  const merged = isControlled ? value! : internal;
  const setMerged = useCallback(
    (next: [number, number]) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [merged, setMerged, isControlled];
}

export function resolveSliderThumbIcon(children: ReactNode, fallback?: ReactNode): ReactNode {
  if (children == null) return fallback;
  const nodes = Children.toArray(children);
  if (nodes.length === 0) return fallback;
  if (nodes.length === 1 && isValidElement(nodes[0])) {
    const name = (nodes[0].type as { displayName?: string }).displayName;
    if (name === "SliderIcon") {
      return (nodes[0].props as { children?: ReactNode }).children ?? fallback;
    }
  }
  return children;
}
