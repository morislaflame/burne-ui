import { animate, remove } from "animejs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type SliderOrientation = "horizontal" | "vertical";
export type SliderSize = "small" | "base" | "medium" | "large";
/** Толщина дорожки / диаметр кружка: число (px) или CSS-длина. */
export type SliderThickness = number | string;

const THUMB_SIZE: Record<SliderSize, string> = {
  small: "size-3.5 min-size-3.5",
  base: "size-4.5 min-size-4.5",
  medium: "size-6 min-size-6",
  large: "size-7 min-size-7",
};

/** Толщина дорожки = диаметру кружка, чтобы thumb полностью «сидел» в линии. */
const RAIL_HEIGHT: Record<SliderSize, string> = {
  small: "h-3.5",
  base: "h-4.5",
  medium: "h-6",
  large: "h-7",
};

const RAIL_WIDTH: Record<SliderSize, string> = {
  small: "w-3.5",
  base: "w-4.5",
  medium: "w-6",
  large: "w-7",
};

/** Fallback, если трек ещё не измерен; в runtime берём cross-axis из `getBoundingClientRect`. */
const THUMB_PX: Record<SliderSize, number> = {
  small: 14,
  base: 18,
  medium: 24,
  large: 28,
};

function readTrackMetrics(
  rect: DOMRect,
  orientation: SliderOrientation,
): { trackSpanPx: number; thumbSpanPx: number } {
  const trackSpanPx =
    orientation === "horizontal" ? rect.width : rect.height;
  const thumbSpanPx =
    orientation === "horizontal" ? rect.height : rect.width;
  return { trackSpanPx, thumbSpanPx };
}

/** CSS-значение толщины: число → px, строка — как есть (`"1rem"`, `"12px"`). */
export function sliderThicknessToCss(thickness: number | string): string {
  return typeof thickness === "number" ? `${thickness}px` : thickness;
}

/** Fallback для геометрии до первого измерения DOM. */
function resolveFallbackThumbPx(
  thickness: number | string | undefined,
  size: SliderSize,
): number {
  if (thickness == null) return THUMB_PX[size];
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
  return THUMB_PX[size];
}

type SliderCommonProps = {
  orientation?: SliderOrientation;
  size?: SliderSize;
  /**
   * Толщина дорожки и диаметр кружка. Перекрывает cross-axis из `size`.
   * Число — px; строка — любая CSS-длина (`"0.75rem"`, `"12px"`).
   */
  thickness?: number | string;
  min?: number;
  max?: number;
  /** Шаг смещения (игнорируется, если задан `marks`). */
  step?: number;
  /** Дискретные значения: ползунок «прилипает» только к этим точкам; на треке — метки. */
  marks?: number[];
  /** Подпись над слайдером (как у `Input`). */
  label?: string;
  /** Текущее значение справа от подписи. */
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export type SliderSingleProps = SliderCommonProps & {
  range?: false;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

export type SliderRangeProps = SliderCommonProps & {
  range: true;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
};

export type SliderProps = SliderSingleProps | SliderRangeProps;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function valueToPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function valueToRatio(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return (value - min) / (max - min);
}

/** Центр кружка в % ширины/высоты трека с учётом inset, чтобы на min/max не вылезал за край. */
function thumbCenterPercent(
  value: number,
  min: number,
  max: number,
  trackPx: number,
  thumbPx: number,
) {
  if (trackPx <= 0) return valueToPercent(value, min, max);
  if (trackPx <= thumbPx) return 50;
  const half = thumbPx / 2;
  const travel = trackPx - thumbPx;
  const centerPx = half + valueToRatio(value, min, max) * travel;
  return (centerPx / trackPx) * 100;
}

function thumbCenterPx(
  value: number,
  min: number,
  max: number,
  trackPx: number,
  thumbPx: number,
) {
  if (trackPx <= thumbPx) return trackPx / 2;
  const half = thumbPx / 2;
  return half + valueToRatio(value, min, max) * (trackPx - thumbPx);
}

type FillSpan = { start: number; end: number };

/** Край заливки доходит до дальнего края кружка (не только до центра). */
function fillSpanForValues(
  trackPx: number,
  thumbPx: number,
  min: number,
  max: number,
  range: boolean,
  singleValue: number,
  rangeValue: [number, number],
): FillSpan {
  if (trackPx <= 0) {
    return { start: 0, end: valueToPercent(singleValue, min, max) };
  }

  const half = thumbPx / 2;

  if (range) {
    const loPx = thumbCenterPx(rangeValue[0], min, max, trackPx, thumbPx);
    const hiPx = thumbCenterPx(rangeValue[1], min, max, trackPx, thumbPx);
    return {
      start: (Math.max(0, loPx - half) / trackPx) * 100,
      end: (Math.min(trackPx, hiPx + half) / trackPx) * 100,
    };
  }

  const centerPx = thumbCenterPx(singleValue, min, max, trackPx, thumbPx);
  return { start: 0, end: (Math.min(trackPx, centerPx + half) / trackPx) * 100 };
}

function fillStyleFromSpan(
  span: FillSpan,
  orientation: SliderOrientation,
): { left?: string; width?: string; bottom?: string; height?: string } {
  const size = span.end - span.start;
  if (orientation === "horizontal") {
    return { left: `${span.start}%`, width: `${size}%` };
  }
  return { bottom: `${span.start}%`, height: `${size}%` };
}

function snapToStep(value: number, min: number, max: number, step: number) {
  if (step <= 0) return clamp(value, min, max);
  const steps = Math.round((value - min) / step);
  return clamp(min + steps * step, min, max);
}

function snapToMarks(value: number, marks: number[]) {
  if (marks.length === 0) return value;
  let nearest = marks[0]!;
  let best = Math.abs(value - nearest);
  for (const m of marks) {
    const d = Math.abs(value - m);
    if (d < best) {
      best = d;
      nearest = m;
    }
  }
  return nearest;
}

function normalizeMarks(marks: number[] | undefined, min: number, max: number) {
  if (!marks?.length) return undefined;
  return [...new Set(marks.map((m) => clamp(m, min, max)))].sort((a, b) => a - b);
}

function pointerToValue(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  orientation: SliderOrientation,
  min: number,
  max: number,
  thumbPx: number,
) {
  const span = orientation === "horizontal" ? rect.width : rect.height;
  const half = thumbPx / 2;
  const travel = span - thumbPx;

  if (travel <= 0) return min;

  const ratio =
    orientation === "horizontal"
      ? clamp((clientX - rect.left - half) / travel, 0, 1)
      : clamp(1 - (clientY - rect.top - half) / travel, 0, 1);

  return min + ratio * (max - min);
}

function adjacentMark(
  value: number,
  marks: number[],
  direction: 1 | -1,
): number {
  const idx = marks.findIndex((m) => m === value);
  if (idx >= 0) {
    const next = marks[idx + direction];
    if (next !== undefined) return next;
    return value;
  }
  if (direction > 0) {
    return marks.find((m) => m > value) ?? marks[marks.length - 1]!;
  }
  return [...marks].reverse().find((m) => m < value) ?? marks[0]!;
}

function stepDelta(
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

function defaultFormatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

type SliderThumbProps = {
  size: SliderSize;
  /** Явная толщина кружка; иначе пресет из `size`. */
  crossSizeStyle?: CSSProperties;
  percent: number;
  orientation: SliderOrientation;
  disabled?: boolean;
  active: boolean;
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText?: string;
  ariaLabel?: string;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

function SliderThumb({
  size,
  crossSizeStyle,
  percent,
  orientation,
  disabled,
  active,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  ariaValueText,
  ariaLabel,
  onPointerDown,
  onKeyDown,
}: SliderThumbProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const squeezeRef = useRef<HTMLButtonElement>(null);
  const firstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useEffect(() => {
    return () => {
      const nodes = [fillRef.current, trackRef.current, squeezeRef.current];
      for (const el of nodes) {
        if (el) remove(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (reduceMotion) {
      remove(fill);
      fill.style.transform = `scale(${active ? 1 : 0})`;
      fill.style.opacity = active ? "1" : "0";
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      remove(fill);
      fill.style.transform = `scale(${active ? 1 : 0})`;
      fill.style.opacity = active ? "1" : "0";
      return;
    }

    remove(fill);
    void animate(fill, {
      scale: active ? [0, 1] : [1, 0],
      opacity: active ? [0, 1] : [1, 0],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [active, reduceMotion]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    remove(track);
    track.style.opacity = disabled ? "0.48" : "1";
  }, [disabled]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown(e);
      if (e.defaultPrevented || disabled) return;
      if (reduceMotion) return;
      const el = squeezeRef.current;
      if (!el) return;
      void animateInteractivePressSqueeze(el);
    },
    [disabled, onPointerDown, reduceMotion],
  );

  const positionStyle: CSSProperties =
    orientation === "horizontal"
      ? { left: `${percent}%`, ...crossSizeStyle }
      : { bottom: `${percent}%`, ...crossSizeStyle };

  const positionClass =
    orientation === "horizontal"
      ? "top-1/2 -translate-x-1/2 -translate-y-1/2"
      : "left-1/2 -translate-x-1/2 translate-y-1/2";

  return (
    <button
      ref={squeezeRef}
      type="button"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueText}
      aria-orientation={orientation}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "absolute z-[2] box-border flex shrink-0 origin-center items-center justify-center",
        "m-0 appearance-none border-0 bg-transparent p-0 leading-none",
        crossSizeStyle == null && THUMB_SIZE[size],
        positionClass,
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
      )}
      style={positionStyle}
      onPointerDown={handlePointerDown}
      onKeyDown={onKeyDown}
    >
      <span
        ref={trackRef}
        className={cn(
          "relative box-border block h-full w-full rounded-full border border-accent bg-surface",
        )}
      >
        <span
          ref={fillRef}
          aria-hidden
          className="pointer-events-none absolute inset-[1px] z-[0] origin-center rounded-full bg-accent"
          style={{ transform: "scale(0)", opacity: 0 }}
        />
      </span>
    </button>
  );
}

function useMergedSingle(
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

function useMergedRange(
  value: [number, number] | undefined,
  defaultValue: [number, number] | undefined,
  min: number,
  max: number,
): [[number, number], (next: [number, number]) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<[number, number]>(
    defaultValue ?? [min, max],
  );
  const merged = isControlled ? value! : internal;
  const setMerged = useCallback(
    (next: [number, number]) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [merged, setMerged, isControlled];
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  props,
  ref,
) {
  const {
    orientation = "horizontal",
    size = "base",
    thickness,
    min = 0,
    max = 100,
    step = 1,
    marks: marksProp,
    label,
    showValue = false,
    formatValue = defaultFormatValue,
    disabled = false,
    className,
    id: idProp,
    range = false,
  } = props;

  const autoId = useId();
  const id = idProp ?? `slider-${autoId}`;
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [trackSpanPx, setTrackSpanPx] = useState(0);
  const fallbackThumbPx = useMemo(
    () => resolveFallbackThumbPx(thickness, size),
    [thickness, size],
  );
  const [thumbSpanPx, setThumbSpanPx] = useState(fallbackThumbPx);
  const draggingRef = useRef<"start" | "end" | "single" | null>(null);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | "single" | null>(
    null,
  );

  const crossSizeCss = thickness != null ? sliderThicknessToCss(thickness) : undefined;
  const crossSizeStyle = useMemo((): CSSProperties | undefined => {
    if (crossSizeCss == null) return undefined;
    return { width: crossSizeCss, height: crossSizeCss, minWidth: crossSizeCss, minHeight: crossSizeCss };
  }, [crossSizeCss]);

  const trackCrossStyle = useMemo((): CSSProperties | undefined => {
    if (crossSizeCss == null) return undefined;
    return orientation === "horizontal"
      ? { height: crossSizeCss }
      : { width: crossSizeCss };
  }, [crossSizeCss, orientation]);

  useEffect(() => {
    setThumbSpanPx(fallbackThumbPx);
  }, [fallbackThumbPx]);

  const marks = useMemo(
    () => normalizeMarks(marksProp, min, max),
    [marksProp, min, max],
  );

  const snap = useCallback(
    (raw: number) => {
      const clamped = clamp(raw, min, max);
      if (marks?.length) return snapToMarks(clamped, marks);
      return snapToStep(clamped, min, max, step);
    },
    [marks, min, max, step],
  );

  const [singleValue, setSingleValue] = useMergedSingle(
    !range ? (props as SliderSingleProps).value : undefined,
    !range ? (props as SliderSingleProps).defaultValue : undefined,
    min,
  );

  const [rangeValue, setRangeValue] = useMergedRange(
    range ? (props as SliderRangeProps).value : undefined,
    range ? (props as SliderRangeProps).defaultValue : undefined,
    min,
    max,
  );

  const onSingleChange = !range
    ? (props as SliderSingleProps).onValueChange
    : undefined;
  const onRangeChange = range
    ? (props as SliderRangeProps).onValueChange
    : undefined;

  const emitSingle = useCallback(
    (next: number) => {
      const snapped = snap(next);
      if (snapped === singleValue) return;
      setSingleValue(snapped);
      onSingleChange?.(snapped);
    },
    [onSingleChange, setSingleValue, singleValue, snap],
  );

  const emitRange = useCallback(
    (next: [number, number]) => {
      let [a, b] = next.map(snap) as [number, number];
      if (a > b) [a, b] = [b, a];
      const [lo, hi] = rangeValue;
      if (a === lo && b === hi) return;
      setRangeValue([a, b]);
      onRangeChange?.([a, b]);
    },
    [onRangeChange, rangeValue, setRangeValue, snap],
  );

  const syncFill = useCallback(
    (nextSingle = singleValue, nextRange = rangeValue) => {
      const track = trackRef.current;
      const fill = fillRef.current;
      if (!track || !fill) return;

      const rect = track.getBoundingClientRect();
      const { trackSpanPx: spanPx, thumbSpanPx: thumbPx } = readTrackMetrics(
        rect,
        orientation,
      );
      setTrackSpanPx((prev) => (prev === spanPx ? prev : spanPx));
      if (thumbPx > 0) {
        setThumbSpanPx((prev) => (prev === thumbPx ? prev : thumbPx));
      }

      const span = fillSpanForValues(
        spanPx,
        thumbPx > 0 ? thumbPx : fallbackThumbPx,
        min,
        max,
        range,
        nextSingle,
        nextRange,
      );
      const style = fillStyleFromSpan(span, orientation);

      remove(fill);
      fill.style.left = style.left ?? "";
      fill.style.width = style.width ?? "";
      fill.style.bottom = style.bottom ?? "";
      fill.style.height = style.height ?? "";
      if (orientation === "horizontal") {
        fill.style.bottom = "";
        fill.style.height = "";
      } else {
        fill.style.left = "";
        fill.style.width = "";
      }
    },
    [fallbackThumbPx, max, min, orientation, range, rangeValue, singleValue],
  );

  useLayoutEffect(() => {
    syncFill();
  }, [syncFill]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ro = new ResizeObserver(() => {
      syncFill();
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [orientation, syncFill]);

  useEffect(() => {
    return () => {
      if (fillRef.current) remove(fillRef.current);
    };
  }, []);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number, thumb: "start" | "end" | "single") => {
      const track = trackRef.current;
      if (!track || disabled) return;
      const rect = track.getBoundingClientRect();
      const { thumbSpanPx: thumbPx } = readTrackMetrics(rect, orientation);
      const raw = pointerToValue(
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
          flushSync(() => emitRange([nextLo, hi]));
          syncFill(singleValue, [nextLo, hi]);
        } else if (thumb === "end") {
          const nextHi = snap(Math.max(raw, lo));
          flushSync(() => emitRange([lo, nextHi]));
          syncFill(singleValue, [lo, nextHi]);
        }
      } else {
        const next = snap(raw);
        flushSync(() => emitSingle(raw));
        syncFill(next, rangeValue);
      }
    },
    [
      disabled,
      emitRange,
      emitSingle,
      max,
      min,
      orientation,
      range,
      rangeValue,
      singleValue,
      snap,
      syncFill,
      fallbackThumbPx,
    ],
  );

  const pickRangeThumb = useCallback(
    (clientX: number, clientY: number): "start" | "end" => {
      const track = trackRef.current;
      if (!track) return "start";
      const rect = track.getBoundingClientRect();
      const { thumbSpanPx: thumbPx } = readTrackMetrics(rect, orientation);
      const raw = pointerToValue(
        clientX,
        clientY,
        rect,
        orientation,
        min,
        max,
        thumbPx > 0 ? thumbPx : fallbackThumbPx,
      );
      const [lo, hi] = rangeValue;
      return Math.abs(raw - lo) <= Math.abs(raw - hi) ? "start" : "end";
    },
    [fallbackThumbPx, max, min, orientation, rangeValue],
  );

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      const thumb = draggingRef.current;
      if (!thumb) return;
      updateFromPointer(e.clientX, e.clientY, thumb);
    };
    const onUp = () => {
      draggingRef.current = null;
      setActiveThumb(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromPointer]);

  const handleTrackPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      const thumb = range ? pickRangeThumb(e.clientX, e.clientY) : "single";
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      updateFromPointer(e.clientX, e.clientY, thumb);
    },
    [disabled, pickRangeThumb, range, updateFromPointer],
  );

  const handleThumbPointerDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled],
  );

  const nudge = useCallback(
    (thumb: "start" | "end" | "single", delta: number) => {
      if (range) {
        const [lo, hi] = rangeValue;
        if (thumb === "start") emitRange([lo + delta, hi]);
        else emitRange([lo, hi + delta]);
      } else {
        emitSingle(singleValue + delta);
      }
    },
    [emitRange, emitSingle, range, rangeValue, singleValue],
  );

  const handleThumbKeyDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const action = stepDelta(marks, step, e.key, orientation);
      if (action === 0) return;

      e.preventDefault();

      const current =
        thumb === "start"
          ? rangeValue[0]
          : thumb === "end"
            ? rangeValue[1]
            : singleValue;

      if (action === "home") {
        if (range) {
          if (thumb === "start") emitRange([min, rangeValue[1]]);
          else emitRange([rangeValue[0], min]);
        } else {
          emitSingle(min);
        }
        return;
      }

      if (action === "end") {
        if (range) {
          if (thumb === "start") emitRange([max, rangeValue[1]]);
          else emitRange([rangeValue[0], max]);
        } else {
          emitSingle(max);
        }
        return;
      }

      if (action === "mark-next" || action === "mark-prev") {
        if (!marks?.length) return;
        const next = adjacentMark(current, marks, action === "mark-next" ? 1 : -1);
        if (range) {
          if (thumb === "start") emitRange([next, rangeValue[1]]);
          else emitRange([rangeValue[0], next]);
        } else {
          emitSingle(next);
        }
        return;
      }

      if (typeof action === "number" && action !== 0) {
        nudge(thumb, action);
      }
    },
    [
      disabled,
      emitRange,
      emitSingle,
      marks,
      max,
      min,
      nudge,
      orientation,
      range,
      rangeValue,
      singleValue,
      step,
    ],
  );

  const valueLabel = useMemo((): ReactNode => {
    if (!showValue) return null;
    if (range) {
      const [lo, hi] = rangeValue;
      return `${formatValue(lo)} — ${formatValue(hi)}`;
    }
    return formatValue(singleValue);
  }, [formatValue, range, rangeValue, showValue, singleValue]);

  const isHorizontal = orientation === "horizontal";

  const railClass = cn(
    "pointer-events-none absolute inset-0 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
    disabled && "opacity-48",
  );

  const fillClassResolved = cn(
    "absolute rounded-full bg-accent",
    isHorizontal ? "inset-y-0" : "inset-x-0",
  );

  const markNodes = marks?.map((mark) => {
    const p = thumbCenterPercent(mark, min, max, trackSpanPx, thumbSpanPx);
    const style =
      orientation === "horizontal"
        ? { left: `${p}%`, top: "50%", transform: "translate(-50%, -50%)" }
        : { bottom: `${p}%`, left: "50%", top: "auto", transform: "translate(-50%, 50%)" };
    return (
      <span
        key={mark}
        aria-hidden
        className="pointer-events-none absolute z-[1] size-1 rounded-full bg-border"
        style={style}
      />
    );
  });

  const trackHitAreaClass = cn(
    "relative touch-none select-none leading-none",
    isHorizontal ? "w-full" : "h-48",
    thickness == null && (isHorizontal ? RAIL_HEIGHT[size] : RAIL_WIDTH[size]),
  );

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        "flex flex-col gap-small text-left",
        isHorizontal ? "w-full" : "w-auto items-center",
        className,
      )}
    >
      {label || showValue ? (
        <div
          className={cn(
            "flex items-baseline justify-between gap-xsmall",
            isHorizontal ? "w-full" : "min-w-[8rem]",
          )}
        >
          {label ? (
            <Text as="span" variant="base" className="font-medium leading-snug">
              {label}
            </Text>
          ) : (
            <span />
          )}
          {showValue && valueLabel != null ? (
            <Text as="span" variant="base" className="tabular-nums text-muted">
              {valueLabel}
            </Text>
          ) : null}
        </div>
      ) : null}

      <div
        ref={trackRef}
        role="presentation"
        className={trackHitAreaClass}
        style={trackCrossStyle}
        onPointerDown={handleTrackPointerDown}
      >
        <div className={railClass} aria-hidden>
          <span ref={fillRef} className={fillClassResolved} />
          {markNodes}
        </div>

        {range ? (
          <>
            <SliderThumb
              size={size}
              crossSizeStyle={crossSizeStyle}
              percent={thumbCenterPercent(
                rangeValue[0],
                min,
                max,
                trackSpanPx,
                thumbSpanPx,
              )}
              orientation={orientation}
              disabled={disabled}
              active={activeThumb === "start"}
              ariaValueNow={rangeValue[0]}
              ariaValueMin={min}
              ariaValueMax={rangeValue[1]}
              ariaValueText={formatValue(rangeValue[0])}
              ariaLabel={label ? `${label}, минимум` : "Минимум диапазона"}
              onPointerDown={handleThumbPointerDown("start")}
              onKeyDown={handleThumbKeyDown("start")}
            />
            <SliderThumb
              size={size}
              crossSizeStyle={crossSizeStyle}
              percent={thumbCenterPercent(
                rangeValue[1],
                min,
                max,
                trackSpanPx,
                thumbSpanPx,
              )}
              orientation={orientation}
              disabled={disabled}
              active={activeThumb === "end"}
              ariaValueNow={rangeValue[1]}
              ariaValueMin={rangeValue[0]}
              ariaValueMax={max}
              ariaValueText={formatValue(rangeValue[1])}
              ariaLabel={label ? `${label}, максимум` : "Максимум диапазона"}
              onPointerDown={handleThumbPointerDown("end")}
              onKeyDown={handleThumbKeyDown("end")}
            />
          </>
        ) : (
          <SliderThumb
            size={size}
            crossSizeStyle={crossSizeStyle}
            percent={thumbCenterPercent(
              singleValue,
              min,
              max,
              trackSpanPx,
              thumbSpanPx,
            )}
            orientation={orientation}
            disabled={disabled}
            active={activeThumb === "single"}
            ariaValueNow={singleValue}
            ariaValueMin={min}
            ariaValueMax={max}
            ariaValueText={formatValue(singleValue)}
            ariaLabel={label}
            onPointerDown={handleThumbPointerDown("single")}
            onKeyDown={handleThumbKeyDown("single")}
          />
        )}
      </div>
    </div>
  );
});

Slider.displayName = "Slider";
