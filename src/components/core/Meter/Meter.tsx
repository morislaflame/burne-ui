import { animate, remove } from "animejs";
import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

import { sliderThicknessToCss } from "@/components/core/Slider/Slider";
import { Text } from "@/components/core/Text";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

export type MeterSize = "small" | "base" | "medium" | "large";
export type MeterOrientation = "horizontal" | "vertical";

const RAIL_HEIGHT: Record<MeterSize, string> = {
  small: "h-3.5",
  base: "h-4.5",
  medium: "h-6",
  large: "h-7",
};

const RAIL_WIDTH: Record<MeterSize, string> = {
  small: "w-3.5",
  base: "w-4.5",
  medium: "w-6",
  large: "w-7",
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

export type MeterProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Текущее значение шкалы. */
  value: number;
  min?: number;
  max?: number;
  size?: MeterSize;
  /**
   * Толщина линии. Перекрывает cross-axis из `size`.
   * Число — px; строка — любая CSS-длина (`"0.75rem"`, `"12px"`).
   */
  thickness?: number | string;
  /** Цвет заливки: CSS-цвет или `linear-gradient(...)`. По умолчанию accent. */
  color?: string;
  /** Подпись слева над шкалой. */
  label?: string;
  /** Показывать значение или `valueText` справа над шкалой. */
  showValue?: boolean;
  /** Произвольный текст состояния справа; перекрывает `formatValue`. */
  valueText?: string;
  formatValue?: (value: number) => string;
  orientation?: MeterOrientation;
  className?: string;
  id?: string;
};

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  {
    value,
    min = 0,
    max = 100,
    size = "base",
    thickness,
    color,
    label,
    showValue = false,
    valueText,
    formatValue = defaultFormatValue,
    orientation = "horizontal",
    className,
    id: idProp,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `meter-${autoId}`;
  const labelId = `${id}-label`;
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
    if (valueText != null) return valueText;
    return formatValue(clampedValue);
  }, [clampedValue, formatValue, valueText]);

  const showHeader = label != null || showValue || valueText != null;

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (reduceMotion || firstLayoutRef.current) {
      firstLayoutRef.current = false;
      remove(fill);
      fill.style.width =
        fillTargetStyle.width != null ? String(fillTargetStyle.width) : "";
      fill.style.height =
        fillTargetStyle.height != null ? String(fillTargetStyle.height) : "";
      return;
    }

    remove(fill);
    void animate(fill, {
      ...(isHorizontal
        ? { width: fillTargetStyle.width }
        : { height: fillTargetStyle.height }),
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [fillTargetStyle.height, fillTargetStyle.width, isHorizontal, reduceMotion]);

  useEffect(() => {
    return () => {
      if (fillRef.current) remove(fillRef.current);
    };
  }, []);

  const trackHitAreaClass = cn(
    "relative overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
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
      {...rest}
    >
      {showHeader ? (
        <div
          className={cn(
            "flex items-baseline justify-between gap-xsmall",
            isHorizontal ? "w-full" : "min-w-[8rem]",
          )}
        >
          {label != null ? (
            <Text
              as="span"
              id={labelId}
              variant="base"
              className="font-medium leading-snug"
            >
              {label}
            </Text>
          ) : (
            <span />
          )}
          {showValue || valueText != null ? (
            <Text as="span" variant="base" className="tabular-nums text-muted">
              {statusText}
            </Text>
          ) : null}
        </div>
      ) : null}

      <div
        role="meter"
        aria-valuenow={clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={statusText}
        aria-labelledby={label != null ? labelId : undefined}
        aria-label={label == null ? statusText : undefined}
        aria-orientation={orientation}
        className={trackHitAreaClass}
        style={trackCrossStyle}
      >
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
      </div>
    </div>
  );
});
