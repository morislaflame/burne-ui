import { Children, isValidElement, type ReactNode } from "react";
 
import { selectionIndicatorFallbackPx } from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
import { formatLocaleNumber } from "@/components/core/utils/intlFormat";
import { isRtlElement } from "@/components/core/utils/readingDirection";
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
  const safeLo = Number.isFinite(lo) ? lo : 0;
  const safeHi = Number.isFinite(hi) ? hi : safeLo;
  if (safeLo >= safeHi) return safeLo;
  if (!Number.isFinite(n)) return safeLo;
  return Math.min(safeHi, Math.max(safeLo, n));
}
 
export function sliderDecimalPlaces(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const text = String(n);
  const expMatch = /[eE]-(\d+)$/.exec(text);
  if (expMatch) {
    const basePart = text.split(/[eE]/)[0] ?? "";
    const dotIdx = basePart.indexOf(".");
    const fracLen = dotIdx >= 0 ? basePart.length - dotIdx - 1 : 0;
    return fracLen + Number(expMatch[1]);
  }
  const dotIdx = text.indexOf(".");
  return dotIdx >= 0 ? text.length - dotIdx - 1 : 0;
}
 
export function roundSliderFloat(n: number, decimals: number): number {
  if (!Number.isFinite(n) || decimals <= 0) return n;
  return Number(n.toFixed(Math.min(decimals, 20)));
}
 
export function sliderValueToPercent(value: number, min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0;
  return ((clampSliderValue(value, min, max) - min) / (max - min)) * 100;
}
 
export function sliderValueToRatio(value: number, min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0;
  return (clampSliderValue(value, min, max) - min) / (max - min);
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
): { insetInlineStart?: string; width?: string; bottom?: string; height?: string } {
  const size = Math.max(0, span.end - span.start);
  if (orientation === "horizontal") {
    return { insetInlineStart: `${span.start}%`, width: `${size}%` };
  }
  return { bottom: `${span.start}%`, height: `${size}%` };
}
 
export function snapSliderToStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    return Number.isFinite(min) ? min : 0;
  }
  if (!Number.isFinite(value)) return min;
  if (!Number.isFinite(step) || step <= 0) return clampSliderValue(value, min, max);
  const decimals = Math.max(
    sliderDecimalPlaces(step),
    sliderDecimalPlaces(min),
    sliderDecimalPlaces(max),
  );
  const steps = Math.round((value - min) / step);
  const raw = min + steps * step;
  const rounded = decimals > 0 ? roundSliderFloat(raw, decimals) : raw;
  return clampSliderValue(rounded, min, max);
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
  rtl = false,
): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return Number.isFinite(min) ? min : 0;
  }
  const span = orientation === "horizontal" ? rect.width : rect.height;
  const safeThumb = span > thumbPx && thumbPx > 0 ? thumbPx : 0;
  const half = safeThumb / 2;
  const travel = span - safeThumb;
 
  if (travel <= 0) return min;
 
  const ratio =
    orientation === "horizontal"
      ? clampSliderValue(
          rtl
            ? (rect.right - clientX - half) / travel
            : (clientX - rect.left - half) / travel,
          0,
          1,
        )
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
  rtl = false,
): number | "home" | "end" | "mark-prev" | "mark-next" {
  const flipHoriz = orientation === "horizontal" && rtl;
  const arrowInc = flipHoriz ? "ArrowLeft" : "ArrowRight";
  const arrowDec = flipHoriz ? "ArrowRight" : "ArrowLeft";
  const increaseKeys = new Set([arrowInc, "ArrowUp", "PageUp"]);
  const decreaseKeys = new Set([arrowDec, "ArrowDown", "PageDown"]);
 
  if (marks?.length) {
    if (key === "Home") return "home";
    if (key === "End") return "end";
    if (increaseKeys.has(key)) return "mark-next";
    if (decreaseKeys.has(key)) return "mark-prev";
    return 0;
  }
 
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const big = safeStep * 10;
  if (key === "Home") return "home";
  if (key === "End") return "end";
  if (key === "PageUp") return big;
  if (key === "PageDown") return -big;
  if (key === arrowInc || key === "ArrowUp") return safeStep;
  if (key === arrowDec || key === "ArrowDown") return -safeStep;
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
}): void {
  const {
    track, clientX, clientY, thumb, disabled, readOnly, range, rangeValue,
    min, max, orientation, fallbackThumbPx, snap, emitRange, emitSingle,
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
    isRtlElement(track),
  );
  if (range) {
    const [lo, hi] = rangeValue;
    if (thumb === "start") {
      const nextLo = snap(Math.min(raw, hi));
      emitRange([nextLo, hi]);
    } else if (thumb === "end") {
      const nextHi = snap(Math.max(raw, lo));
      emitRange([lo, nextHi]);
    }
    return;
  }
  emitSingle(raw);
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
  const [lo, hi] = rangeValue;
  const current = thumb === "start" ? lo : thumb === "end" ? hi : singleValue;
  const clampForThumb = (candidate: number) => {
    if (!range) return clampSliderValue(candidate, min, max);
    return thumb === "start"
      ? clampSliderValue(candidate, min, hi)
      : clampSliderValue(candidate, lo, max);
  };
  const emitClamped = (candidate: number) => {
    const bounded = clampForThumb(candidate);
    if (range) {
      emitRange(thumb === "start" ? [bounded, hi] : [lo, bounded]);
    } else {
      emitSingle(bounded);
    }
    commit();
  };

  if (action === "home") {
    emitClamped(range && thumb === "end" ? lo : min);
    return;
  }
  if (action === "end") {
    emitClamped(range && thumb === "start" ? hi : max);
    return;
  }
  if (action === "mark-next" || action === "mark-prev") {
    if (!marks?.length) return;
    emitClamped(sliderAdjacentMark(current, marks, action === "mark-next" ? 1 : -1));
    return;
  }
  if (typeof action === "number" && action !== 0) {
    emitClamped(current + action);
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
 