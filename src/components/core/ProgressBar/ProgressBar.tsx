import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
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
import { motionInteractive } from "@/components/core/utils/motionConfig";
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
const PROGRESS_INDETERMINATE_EASE = "expo.inOut" as const;

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
  /** Цвет заливки: CSS-цвет или `linear-gradient(...)`. По умолчанию primary. */
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
        killMotion(fill);
        fill.style.transform = "";
        fill.style.width =
          fillTargetStyle.width != null ? String(fillTargetStyle.width) : "";
        fill.style.height =
          fillTargetStyle.height != null ? String(fillTargetStyle.height) : "";
        return;
      }

      killMotion(fill);
      fill.style.transform = "";
      void gsap.to(fill, {
        ...(isHorizontal
          ? { width: fillTargetStyle.width }
          : { height: fillTargetStyle.height }),
        ...motionInteractive(),
        overwrite: "auto",
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
      const track = fill?.parentElement;
      if (!fill || !track) return;

      killMotion(fill);

      if (reduceMotion) {
        gsap.set(fill, { clearProps: "transform" });
        return;
      }

      const runIndeterminateMotion = () => {
        const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;
        const fillSize = isHorizontal ? fill.offsetWidth : fill.offsetHeight;
        if (trackSize <= 0 || fillSize <= 0) return;

        killMotion(fill);

        void gsap.fromTo(
          fill,
          isHorizontal ? { x: -fillSize } : { y: fillSize },
          {
            ...(isHorizontal ? { x: trackSize } : { y: -trackSize }),
            duration: PROGRESS_INDETERMINATE_MS / 1000,
            ease: PROGRESS_INDETERMINATE_EASE,
            repeat: -1,
            overwrite: "auto",
          },
        );
      };

      runIndeterminateMotion();

      if (typeof ResizeObserver === "undefined") return;

      const ro = new ResizeObserver(() => runIndeterminateMotion());
      ro.observe(track);
      ro.observe(fill);

      return () => ro.disconnect();
    }, [indeterminate, isHorizontal, reduceMotion]);

    useEffect(() => {
      const fill = fillRef.current;
      return () => {
        if (fill) killMotion(fill);
      };
    }, []);

    const trackHitAreaClass = cn(
      "relative overflow-hidden rounded-full bg-primary-tint",
      isHorizontal ? "w-full" : "h-48",
      thickness == null && (isHorizontal ? RAIL_HEIGHT[size] : RAIL_WIDTH[size]),
    );

    const indeterminateFillClass = cn(
      "absolute rounded-full will-change-transform",
      isHorizontal ? "inset-y-0 left-0 w-1/4" : "inset-x-0 bottom-0 h-1/4",
      !color && "bg-primary",
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
                !color && "bg-primary",
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
