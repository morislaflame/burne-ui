import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  SelectionThumb,
  SelectionThumbIcon,
} from "@/components/core/SelectionThumb";
import { cn } from "@/utils/cn";

import {
  selectionIndicatorFallbackPx,
} from "@/components/core/SelectionIndicator";
import { useOptionalSliderFieldContext } from "./sliderFieldContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { partitionSliderTrackChildren } from "./partitionSliderTrackChildren";
import { SliderCompoundThumb, SliderIcon } from "./sliderCompound";
import { SliderRail } from "./sliderRail";
import { SliderTrackProvider, type SliderThumbKind } from "./sliderTrackContext";
import { sliderThicknessToCss } from "./sliderThickness";

export type SliderOrientation = "horizontal" | "vertical";
export type SliderSize = "small" | "base" | "mid" | "large";
/** Толщина дорожки / диаметр кружка: число (px) или CSS-длина. */
export type SliderThickness = number | string;

/** Fallback, если трек ещё не измерен; в runtime берём cross-axis из `getBoundingClientRect`. */
const THUMB_PX: Record<SliderSize, number> = {
  small: selectionIndicatorFallbackPx("small"),
  base: selectionIndicatorFallbackPx("base"),
  mid: selectionIndicatorFallbackPx("mid"),
  large: selectionIndicatorFallbackPx("large"),
};

/** Толщина дорожки = диаметру кружка (только cross-axis). */
const RAIL_HEIGHT: Record<SliderSize, string> = {
  small: "h-[var(--selection-indicator-small)] min-h-[var(--selection-indicator-small)]",
  base: "h-[var(--selection-indicator-base)] min-h-[var(--selection-indicator-base)]",
  mid: "h-[var(--selection-indicator-mid)] min-h-[var(--selection-indicator-mid)]",
  large: "h-[var(--selection-indicator-large)] min-h-[var(--selection-indicator-large)]",
};

const RAIL_WIDTH: Record<SliderSize, string> = {
  small: "w-[var(--selection-indicator-small)] min-w-[var(--selection-indicator-small)]",
  base: "w-[var(--selection-indicator-base)] min-w-[var(--selection-indicator-base)]",
  mid: "w-[var(--selection-indicator-mid)] min-w-[var(--selection-indicator-mid)]",
  large: "w-[var(--selection-indicator-large)] min-w-[var(--selection-indicator-large)]",
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
  formatValue?: (value: number) => string;
  /** Иконка внутри кружка: primary в покое, primary-foreground при захвате. */
  icon?: ReactNode;
  /** Gloss-вариант: стеклянный кружок. */
  gloss?: boolean;
  disabled?: boolean;
  className?: string;
  /** Явная подпись ползунков (`aria-label`); перекрывает связь с `<Slider.Label>` через `aria-labelledby`. */
  ariaLabel?: string;
  children?: ReactNode;
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

export type SliderTrackProps = SliderSingleProps | SliderRangeProps;

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
  return [...new Set(marks.map((m) => clamp(m, min, max)))].toSorted((a: number, b: number) => a - b);
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

type SliderThumbButtonProps = {
  size: SliderSize;
  icon?: ReactNode;
  gloss?: boolean;
  percent: number;
  orientation: SliderOrientation;
  disabled?: boolean;
  active: boolean;
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

function SliderThumbButton({
  size,
  icon,
  gloss = false,
  percent,
  orientation,
  disabled,
  active,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  ariaValueText,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  onPointerDown,
  onKeyDown,
}: SliderThumbButtonProps) {
  const shellRef = useRef<HTMLSpanElement>(null);
  const squeezeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useEffect(() => {
    const shell = shellRef.current;
    const squeeze = squeezeRef.current;
    return () => {
      for (const el of [shell, squeeze]) {
        if (el) killMotion(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    killMotion(shell);
    shell.style.opacity = disabled ? "0.48" : "1";
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
      ? { left: `${percent}%` }
      : { top: `${100 - percent}%` };

  const positionClass =
    orientation === "horizontal"
      ? "top-0 h-full w-auto -translate-x-1/2 aspect-square"
      : "left-0 w-full h-auto -translate-y-1/2 aspect-square";

  return (
    <button
      ref={squeezeRef}
      type="button"
      role="slider"
      {...(ariaLabelledBy != null
        ? { "aria-labelledby": ariaLabelledBy }
        : ariaLabel != null
          ? { "aria-label": ariaLabel }
          : {})}
      {...(ariaDescribedBy != null ? { "aria-describedby": ariaDescribedBy } : {})}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueText}
      aria-orientation={orientation}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "absolute z-[2] box-border flex shrink-0 origin-center items-center justify-center",
        "m-0 appearance-none border-0 bg-transparent p-0",
        positionClass,
        "focus-ring",
        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
      )}
      style={positionStyle}
      onPointerDown={handlePointerDown}
      onKeyDown={onKeyDown}
    >
      <SelectionThumb active={active} size={size} gloss={gloss} shellRef={shellRef}>
        {icon != null ? (
          <SelectionThumbIcon size={size} highlighted={active} gloss={gloss}>
            {icon}
          </SelectionThumbIcon>
        ) : null}
      </SelectionThumb>
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

export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  props,
  ref,
) {
  const {
    orientation: orientationProp,
    size = "base",
    thickness,
    min = 0,
    max = 100,
    step = 1,
    marks: marksProp,
    formatValue = defaultFormatValue,
    icon,
    gloss = false,
    disabled = false,
    className,
    ariaLabel: ariaLabelProp,
    range = false,
    children,
  } = props;

  const fieldCtx = useOptionalSliderFieldContext();
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const labelId = fieldCtx?.labelId;
  const ariaDescribedBy = joinFieldDescribedBy(
    fieldCtx?.hintConnected ? fieldCtx.hintId : undefined,
    fieldCtx?.errorConnected ? fieldCtx.errorId : undefined,
  );
  const explicitLabel = ariaLabelProp;

  const thumbA11y = useCallback(
    (kind: "single" | "start" | "end") => {
      if (explicitLabel) {
        if (kind === "start") {
          return {
            ariaLabel: `${explicitLabel}, минимум`,
            ariaLabelledBy: undefined as string | undefined,
            ariaDescribedBy,
          };
        }
        if (kind === "end") {
          return {
            ariaLabel: `${explicitLabel}, максимум`,
            ariaLabelledBy: undefined as string | undefined,
            ariaDescribedBy,
          };
        }
        return {
          ariaLabel: explicitLabel,
          ariaLabelledBy: undefined as string | undefined,
          ariaDescribedBy,
        };
      }
      if (kind === "start") {
        return {
          ariaLabel: "Минимум диапазона",
          ariaLabelledBy: undefined as string | undefined,
          ariaDescribedBy,
        };
      }
      if (kind === "end") {
        return {
          ariaLabel: "Максимум диапазона",
          ariaLabelledBy: undefined as string | undefined,
          ariaDescribedBy,
        };
      }
      if (labelId) {
        return {
          ariaLabel: undefined as string | undefined,
          ariaLabelledBy: labelId,
          ariaDescribedBy,
        };
      }
      return {
        ariaLabel: "Значение",
        ariaLabelledBy: undefined as string | undefined,
        ariaDescribedBy,
      };
    },
    [ariaDescribedBy, explicitLabel, labelId],
  );
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

  const trackCrossStyle = useMemo((): CSSProperties | undefined => {
    if (crossSizeCss == null) return undefined;
    return orientation === "horizontal"
      ? { height: crossSizeCss, minHeight: crossSizeCss }
      : { width: crossSizeCss, minWidth: crossSizeCss };
  }, [crossSizeCss, orientation]);

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

      killMotion(fill);
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
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
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
          emitRange([nextLo, hi]);
          syncFill(singleValue, [nextLo, hi]);
        } else if (thumb === "end") {
          const nextHi = snap(Math.max(raw, lo));
          emitRange([lo, nextHi]);
          syncFill(singleValue, [lo, nextHi]);
        }
      } else {
        const next = snap(raw);
        emitSingle(raw);
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

  const renderThumb = useCallback(
    (kind: SliderThumbKind, iconOverride?: ReactNode) => {
      const iconNode = iconOverride ?? icon;
      const percentFor = (value: number) =>
        thumbCenterPercent(value, min, max, trackSpanPx, thumbSpanPx);

      if (kind === "start") {
        return (
          <SliderThumbButton
            size={size}
            icon={iconNode}
            gloss={gloss}
            percent={percentFor(rangeValue[0])}
            orientation={orientation}
            disabled={disabled}
            active={activeThumb === "start"}
            ariaValueNow={rangeValue[0]}
            ariaValueMin={min}
            ariaValueMax={rangeValue[1]}
            ariaValueText={formatValue(rangeValue[0])}
            {...thumbA11y("start")}
            onPointerDown={handleThumbPointerDown("start")}
            onKeyDown={handleThumbKeyDown("start")}
          />
        );
      }

      if (kind === "end") {
        return (
          <SliderThumbButton
            size={size}
            icon={iconNode}
            gloss={gloss}
            percent={percentFor(rangeValue[1])}
            orientation={orientation}
            disabled={disabled}
            active={activeThumb === "end"}
            ariaValueNow={rangeValue[1]}
            ariaValueMin={rangeValue[0]}
            ariaValueMax={max}
            ariaValueText={formatValue(rangeValue[1])}
            {...thumbA11y("end")}
            onPointerDown={handleThumbPointerDown("end")}
            onKeyDown={handleThumbKeyDown("end")}
          />
        );
      }

      return (
        <SliderThumbButton
          size={size}
          icon={iconNode}
          gloss={gloss}
          percent={percentFor(singleValue)}
          orientation={orientation}
          disabled={disabled}
          active={activeThumb === "single"}
          ariaValueNow={singleValue}
          ariaValueMin={min}
          ariaValueMax={max}
          ariaValueText={formatValue(singleValue)}
          {...thumbA11y("single")}
          onPointerDown={handleThumbPointerDown("single")}
          onKeyDown={handleThumbKeyDown("single")}
        />
      );
    },
    [
      activeThumb,
      disabled,
      formatValue,
      gloss,
      handleThumbKeyDown,
      handleThumbPointerDown,
      icon,
      max,
      min,
      orientation,
      rangeValue,
      singleValue,
      size,
      thumbA11y,
      thumbSpanPx,
      trackSpanPx,
    ],
  );

  const valueLabel = useMemo((): string => {
    if (range) {
      const [lo, hi] = rangeValue;
      return `${formatValue(lo)} — ${formatValue(hi)}`;
    }
    return formatValue(singleValue);
  }, [formatValue, range, rangeValue, singleValue]);

  const setDisplay = fieldCtx?.setDisplay;

  useLayoutEffect(() => {
    setDisplay?.({
      valueLabel,
      min,
      max,
      range,
      singleValue,
      rangeValue,
      label: explicitLabel,
    });
  }, [explicitLabel, max, min, range, rangeValue, setDisplay, singleValue, valueLabel]);

  const isHorizontal = orientation === "horizontal";

  const railClass = cn(
    "pointer-events-none absolute inset-0 overflow-hidden rounded-full bg-primary-tint",
    disabled && "opacity-48",
  );

  const fillClassResolved = cn(
    "absolute rounded-full bg-primary",
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
        className="pointer-events-none absolute z-[1] size-1 rounded-full bg-primary/30"
        style={style}
      />
    );
  });

  const trackHitAreaClass = cn(
    "relative touch-none select-none",
    isHorizontal ? "w-full" : "h-48",
    thickness == null && (isHorizontal ? RAIL_HEIGHT[size] : RAIL_WIDTH[size]),
  );

  const setTrackRef = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const trackContextValue = useMemo(
    () => ({
      fillRef,
      fillClassResolved,
      railClass,
      markNodes,
      size,
      orientation,
      disabled,
      icon,
      range,
      renderThumb,
    }),
    [
      disabled,
      fillClassResolved,
      icon,
      markNodes,
      orientation,
      railClass,
      range,
      renderThumb,
      size,
    ],
  );

  const { body: compoundBody, hasCompoundParts } = partitionSliderTrackChildren(children);

  const defaultBody = (
    <>
      <SliderRail />
      {range ? (
        <>
          <SliderCompoundThumb thumb="start">
            {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
          </SliderCompoundThumb>
          <SliderCompoundThumb thumb="end">
            {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
          </SliderCompoundThumb>
        </>
      ) : (
        <SliderCompoundThumb thumb="single">
          {icon != null ? <SliderIcon>{icon}</SliderIcon> : null}
        </SliderCompoundThumb>
      )}
    </>
  );

  return (
    <div
      ref={setTrackRef}
      role="presentation"
      className={cn(trackHitAreaClass, className)}
      style={trackCrossStyle}
      onPointerDown={handleTrackPointerDown}
    >
      <SliderTrackProvider value={trackContextValue}>
        {hasCompoundParts ? compoundBody : defaultBody}
      </SliderTrackProvider>
    </div>
  );
});

SliderTrack.displayName = "SliderTrack";

export { SliderFill, type SliderFillProps } from "./sliderFill";
export { SliderRail, type SliderRailProps } from "./sliderRail";
export { SliderIcon, SliderCompoundThumb as SliderThumb } from "./sliderCompound";
export type {
  SliderIconProps,
  SliderCompoundThumbProps as SliderThumbProps,
} from "./sliderCompound";
export type { SliderThumbKind } from "./sliderTrackContext";
