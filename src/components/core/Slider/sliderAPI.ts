import { Children, isValidElement, type ReactNode } from "react";
 
import { selectionIndicatorFallbackPx } from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
import { formatLocaleNumber } from "@/components/core/utils/intlFormat";
import type {
  FillSpan,
  SliderDisplayState,
  SliderOrientation,
  SliderSize,
  SliderTrackProps,
} from "./sliderTypes";
 
export const SLIDER_THUMB_PX: Record<SliderSize, number> = {
  small: selectionIndicatorFallbackPx("small"),
  base: selectionIndicatorFallbackPx("base"),
  mid: selectionIndicatorFallbackPx("mid"),
  large: selectionIndicatorFallbackPx("large"),
};
 
export type SliderValueBinding = {
  singleValue: number | undefined;
  singleDefault: number;
  onSingleChange: ((value: number) => void) | undefined;
  rangeValue: [number, number] | undefined;
  rangeDefault: [number, number];
  onRangeChange: ((value: [number, number]) => void) | undefined;
  onCommit: ((value: number | [number, number]) => void) | undefined;
};

/** Splits the single/range union so the track hook does not branch on `range`. */
export function readSliderValueBinding(
  props: SliderTrackProps,
  range: boolean,
  min: number,
  max: number,
): SliderValueBinding {
  if (range) {
    const rangeProps = props as Extract<SliderTrackProps, { range: true }>;
    return {
      singleValue: undefined,
      singleDefault: min,
      onSingleChange: undefined,
      rangeValue: rangeProps.value,
      rangeDefault: rangeProps.defaultValue ?? ([min, max] as [number, number]),
      onRangeChange: rangeProps.onValueChange,
      onCommit: rangeProps.onValueCommit as SliderValueBinding["onCommit"],
    };
  }
  const singleProps = props as Extract<SliderTrackProps, { range?: false }>;
  return {
    singleValue: singleProps.value,
    singleDefault: singleProps.defaultValue ?? min,
    onSingleChange: singleProps.onValueChange,
    rangeValue: undefined,
    rangeDefault: [min, max],
    onRangeChange: undefined,
    onCommit: singleProps.onValueCommit as SliderValueBinding["onCommit"],
  };
}

export function sliderLiveValue(
  range: boolean,
  rangeValue: [number, number],
  singleValue: number,
): number | [number, number] {
  return range ? rangeValue : singleValue;
}

export function sliderValueIdentity(
  range: boolean,
  rangeValue: [number, number],
  singleValue: number,
): string {
  return range ? `${rangeValue[0]}:${rangeValue[1]}` : String(singleValue);
}

export function sliderExplicitNames(
  ariaLabel: unknown,
  ariaLabelledBy: unknown,
): { explicitLabel: string | undefined; labelledBy: string | undefined } {
  return {
    explicitLabel: typeof ariaLabel === "string" ? ariaLabel : undefined,
    labelledBy: typeof ariaLabelledBy === "string" ? ariaLabelledBy : undefined,
  };
}

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
  return [...new Set(marks.map((mark) => clampSliderValue(mark, min, max)))].sort(
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
  void orientation;
  // APG: both axes increase/decrease — horiz uses ←/→ (and ↑/↓ as aliases);
  // vertical uses ↑/↓ (and →/← as aliases).
  const increaseKeys = new Set(["ArrowRight", "ArrowUp", "PageUp"]);
  const decreaseKeys = new Set(["ArrowLeft", "ArrowDown", "PageDown"]);
 
  if (marks?.length) {
    if (key === "Home") return "home";
    if (key === "End") return "end";
    if (increaseKeys.has(key)) return "mark-next";
    if (decreaseKeys.has(key)) return "mark-prev";
    return 0;
  }
 
  const big = step > 0 ? step * 10 : 10;
  if (key === "Home") return "home";
  if (key === "End") return "end";
  if (key === "PageUp") return big;
  if (key === "PageDown") return -big;
  if (key === "ArrowRight" || key === "ArrowUp") return step;
  if (key === "ArrowLeft" || key === "ArrowDown") return -step;
  return 0;
}

export function commitSliderSingle(
  next: number,
  current: number,
  snap: (raw: number) => number,
  set: (value: number) => void,
  onChange: ((value: number) => void) | undefined,
  remember: (value: number) => void,
): void {
  const snapped = snap(next);
  remember(snapped);
  if (snapped === current) return;
  set(snapped);
  onChange?.(snapped);
}

export function commitSliderRange(
  next: [number, number],
  current: [number, number],
  snap: (raw: number) => number,
  set: (value: [number, number]) => void,
  onChange: ((value: [number, number]) => void) | undefined,
  remember: (value: [number, number]) => void,
): void {
  let [a, b] = next.map(snap) as [number, number];
  if (a > b) [a, b] = [b, a];
  remember([a, b]);
  const [lo, hi] = current;
  if (a === lo && b === hi) return;
  set([a, b]);
  onChange?.([a, b]);
}

export function applySliderPointer(args: {
  track: HTMLElement;
  clientX: number;
  clientY: number;
  thumb: "start" | "end" | "single";
  disabled: boolean;
  readOnly: boolean;
  range: boolean;
  rangeValue: [number, number];
  singleValue: number;
  min: number;
  max: number;
  orientation: SliderOrientation;
  fallbackThumbPx: number;
  snap: (raw: number) => number;
  emitRange: (next: [number, number]) => void;
  emitSingle: (next: number) => void;
  syncFill: (nextSingle?: number, nextRange?: [number, number]) => void;
}): void {
  const {
    track, clientX, clientY, thumb, disabled, readOnly, range, rangeValue, singleValue,
    min, max, orientation, fallbackThumbPx, snap, emitRange, emitSingle, syncFill,
  } = args;
  if (disabled || readOnly) return;
  const rect = track.getBoundingClientRect();
  const { thumbSpanPx: thumbPx } = readSliderTrackMetrics(rect, orientation);
  const raw = sliderPointerToValue(
    clientX,
    clientY,
    rect,
    orientation,
    min,
    max,
    thumbPx > 0 ? thumbPx : fallbackThumbPx,
  );
  if (range) {
    const [lo, hi] = rangeValue;
    if (thumb === "start") {
      const nextLo = snap(Math.min(raw, hi));
      emitRange([nextLo, hi]);
      syncFill(singleValue, [nextLo, hi]);
    } else if (thumb === "end") {
      const nextHi = snap(Math.max(raw, lo));
      emitRange([lo, nextHi]);
      syncFill(singleValue, [lo, nextHi]);
    }
    return;
  }
  const next = snap(raw);
  emitSingle(raw);
  syncFill(next, rangeValue);
}

export function applySliderThumbKey(args: {
  action: number | "home" | "end" | "mark-prev" | "mark-next";
  thumb: "start" | "end" | "single";
  range: boolean;
  rangeValue: [number, number];
  singleValue: number;
  min: number;
  max: number;
  marks: number[] | undefined;
  emitRange: (next: [number, number]) => void;
  emitSingle: (next: number) => void;
  commit: () => void;
}): void {
  const { action, thumb, range, rangeValue, singleValue, min, max, marks, emitRange, emitSingle, commit } = args;
  const current = thumb === "start" ? rangeValue[0] : thumb === "end" ? rangeValue[1] : singleValue;
  const emitEnd = (value: number, atStart: boolean) => {
    if (range) emitRange(atStart ? [value, rangeValue[1]] : [rangeValue[0], value]);
    else emitSingle(value);
    commit();
  };

  if (action === "home") {
    emitEnd(min, thumb === "start");
    return;
  }
  if (action === "end") {
    emitEnd(max, thumb === "start");
    return;
  }
  if (action === "mark-next" || action === "mark-prev") {
    if (!marks?.length) return;
    emitEnd(sliderAdjacentMark(current, marks, action === "mark-next" ? 1 : -1), thumb === "start");
    return;
  }
  if (typeof action === "number" && action !== 0) {
    if (range) {
      const [lo, hi] = rangeValue;
      if (thumb === "start") emitRange([lo + action, hi]);
      else emitRange([lo, hi + action]);
    } else {
      emitSingle(singleValue + action);
    }
    commit();
  }
}
 
export function defaultSliderFormatValue(value: number): string {
  return formatLocaleNumber(value);
}

/** Label for `Slider.Value` before a track publishes live drag state. */
export function sliderDisplayFromProps(props: {
  range?: boolean;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  formatValue?: (value: number) => string;
}): SliderDisplayState {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const formatValue = props.formatValue ?? defaultSliderFormatValue;
  const range = props.range === true;
  const rangeValue: [number, number] = range
    ? Array.isArray(props.value)
      ? props.value
      : Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [min, max]
    : [min, max];
  const singleValue = range
    ? min
    : typeof props.value === "number"
      ? props.value
      : typeof props.defaultValue === "number"
        ? props.defaultValue
        : min;
  const valueLabel = range
    ? `${formatValue(rangeValue[0])} — ${formatValue(rangeValue[1])}`
    : formatValue(singleValue);
  return { valueLabel, min, max, range, singleValue, rangeValue };
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
 
export function resolveSliderThumbIcon(children: ReactNode, fallback?: ReactNode): ReactNode {
  if (children == null) return fallback;
  const nodes = Children.toArray(children);
  if (nodes.length === 0) return fallback;
  if (nodes.length === 1 && isValidElement(nodes[0])) {
    const name = (nodes[0].type as { displayName?: string }).displayName;
    if (name === "SliderIcon") {
      const iconChildren = (nodes[0].props as { children?: ReactNode }).children;
      if (iconChildren == null && fallback == null) return null;
      return nodes[0];
    }
  }
  return children;
}
 