import { animate, remove } from "animejs";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

import { sliderThicknessToCss } from "@/components/core/Slider/sliderThickness";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

import { useOptionalProgressBarFieldContext } from "./progressBarFieldContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

export type ProgressBarSize = "small" | "base" | "mid" | "large";
export type ProgressBarOrientation = "horizontal" | "vertical";

const RAIL_HEIGHT: Record<ProgressBarSize, string> = {
  small: "h-small",
  base: "h-base",
  mid: "h-plus",
  large: "h-mid",
};

const RAIL_WIDTH: Record<ProgressBarSize, string> = {
  small: "w-small",
  base: "w-base",
  mid: "w-plus",
  large: "w-mid",
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function valueToPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function defaultFormatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const PROGRESS_INDETERMINATE_MS = 1500;
const PROGRESS_INDETERMINATE_EASE = "inOutExpo" as const;

export type ProgressBarTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Текущий прогресс. Не используется при `indeterminate`. */
  value?: number;
  /** Неопределённый прогресс (анимация без конкретного значения). */
  indeterminate?: boolean;
  min?: number;
  max?: number;
  size?: ProgressBarSize;
  /**
   * Толщина линии. Перекрывает cross-axis из `size`.
   * Число — px; строка — любая CSS-длина (`"0.75rem"`, `"12px"`).
   */
  thickness?: number | string;
  /** Цвет заливки: CSS-цвет или `linear-gradient(...)`. По умолчанию accent. */
  color?: string;
  formatValue?: (value: number) => string;
  orientation?: ProgressBarOrientation;
  className?: string;
};

export const ProgressBarTrack = forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  function ProgressBarTrack(
    {
      value = 0,
      indeterminate = false,
      min = 0,
      max = 100,
      size = "base",
      thickness,
      color,
      formatValue = defaultFormatValue,
      orientation: orientationProp,
      className,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalProgressBarFieldContext();
    const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
    const progressId = fieldCtx?.progressId;
    const labelId = progressId != null ? `${progressId}-label` : undefined;
    const hintConnected = fieldCtx?.hintConnected ?? false;
    const errorConnected = fieldCtx?.errorConnected ?? false;
    const hintId = fieldCtx?.hintId;
    const errorId = fieldCtx?.errorId;
    const ariaDescribedBy =
      ariaDescribedByProp ??
      joinFieldDescribedBy(
        hintConnected ? hintId : undefined,
        errorConnected ? errorId : undefined,
      );
    const fillRef = useRef<HTMLSpanElement>(null);
    const firstLayoutRef = useRef(true);
    const reduceMotion = prefersReducedInteractiveHoverLift();

    const clampedValue = useMemo(
      () => clamp(value, min, max),
      [max, min, value],
    );
    const percent = useMemo(
      () => valueToPercent(clampedValue, min, max),
      [clampedValue, max, min],
    );

    const isHorizontal = orientation === "horizontal";
    const thicknessCss = thickness != null ? sliderThicknessToCss(thickness) : undefined;

    const trackCrossStyle = useMemo((): CSSProperties | undefined => {
      if (thicknessCss == null) return undefined;
      return isHorizontal ? { height: thicknessCss } : { width: thicknessCss };
    }, [isHorizontal, thicknessCss]);

    const fillColorStyle = useMemo((): CSSProperties | undefined => {
      if (!color) return undefined;
      return { background: color };
    }, [color]);

    const fillTargetStyle = useMemo((): CSSProperties => {
      if (isHorizontal) {
        return { width: `${percent}%`, height: "100%" };
      }
      return { width: "100%", height: `${percent}%` };
    }, [isHorizontal, percent]);

    const statusText = useMemo(() => {
      if (indeterminate) return "Загрузка…";
      return formatValue(clampedValue);
    }, [clampedValue, formatValue, indeterminate]);

    const setDisplay = fieldCtx?.setDisplay;

    useLayoutEffect(() => {
      setDisplay?.({
        clampedValue,
        statusText,
        min,
        max,
        indeterminate,
      });
    }, [clampedValue, indeterminate, max, min, setDisplay, statusText]);

    useLayoutEffect(() => {
      if (indeterminate) return;
      const fill = fillRef.current;
      if (!fill) return;

      if (reduceMotion || firstLayoutRef.current) {
        firstLayoutRef.current = false;
        remove(fill);
        fill.style.transform = "";
        fill.style.width =
          fillTargetStyle.width != null ? String(fillTargetStyle.width) : "";
        fill.style.height =
          fillTargetStyle.height != null ? String(fillTargetStyle.height) : "";
        return;
      }

      remove(fill);
      fill.style.transform = "";
      void animate(fill, {
        ...(isHorizontal
          ? { width: fillTargetStyle.width }
          : { height: fillTargetStyle.height }),
        duration: MOTION_INTERACTIVE_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
    }, [
      fillTargetStyle.height,
      fillTargetStyle.width,
      indeterminate,
      isHorizontal,
      reduceMotion,
    ]);

    useLayoutEffect(() => {
      if (!indeterminate) return;
      const fill = fillRef.current;
      if (!fill) return;

      remove(fill);

      if (reduceMotion) {
        fill.style.transform = "";
        return;
      }

      fill.style.transform = isHorizontal ? "translateX(-100%)" : "translateY(100%)";

      void animate(fill, {
        ...(isHorizontal
          ? { translateX: ["-100%", "400%"] }
          : { translateY: ["100%", "-400%"] }),
        duration: PROGRESS_INDETERMINATE_MS,
        ease: PROGRESS_INDETERMINATE_EASE,
        loop: true,
      });
    }, [indeterminate, isHorizontal, reduceMotion]);

    useEffect(() => {
      const fill = fillRef.current;
      return () => {
        if (fill) remove(fill);
      };
    }, []);

    const trackHitAreaClass = cn(
      "relative overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
      isHorizontal ? "w-full" : "h-48",
      thickness == null && (isHorizontal ? RAIL_HEIGHT[size] : RAIL_WIDTH[size]),
    );

    const indeterminateFillClass = cn(
      "absolute rounded-full will-change-transform",
      isHorizontal ? "inset-y-0 left-0 w-1/4" : "inset-x-0 bottom-0 h-1/4",
      !color && "bg-accent",
      reduceMotion &&
        (isHorizontal ? "left-1/4 w-1/2" : "bottom-1/4 h-1/2"),
    );

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={indeterminate ? undefined : min}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuetext={statusText}
        aria-busy={indeterminate || undefined}
        aria-labelledby={labelId}
        aria-describedby={ariaDescribedBy}
        aria-label={labelId == null ? statusText : undefined}
        className={cn(trackHitAreaClass, className)}
        style={trackCrossStyle}
        {...rest}
      >
          {indeterminate ? (
            <span
              ref={fillRef}
              aria-hidden
              className={indeterminateFillClass}
              style={fillColorStyle}
            />
          ) : (
            <span
              ref={fillRef}
              aria-hidden
              className={cn(
                "absolute rounded-full",
                isHorizontal ? "inset-y-0 left-0" : "inset-x-0 bottom-0",
                !color && "bg-accent",
              )}
              style={{
                width: isHorizontal ? `${percent}%` : "100%",
                height: isHorizontal ? "100%" : `${percent}%`,
                ...fillColorStyle,
              }}
            />
          )}
      </div>
    );
  },
);

ProgressBarTrack.displayName = "ProgressBar.Track";
