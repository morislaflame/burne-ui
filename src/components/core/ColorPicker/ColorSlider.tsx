import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, type KeyboardEvent, type PointerEvent } from "react";

import { Text } from "@/components/core/Text";
import { readSliderTrackMetrics, resolveSliderFallbackThumbPx, sliderPointerToValue, sliderThumbCenterPercent } from "@/components/core/Slider/sliderAPI";
import { SliderThumbButton } from "@/components/core/Slider/sliderThumbParts";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { cn } from "@/utils/cn";

import {
  mergeMotionSlotMaps,
  resolveColorSliderMotionDefaults,
  useColorSliderRootMotion,
  useColorSliderTrackMotion,
} from "./colorSliderAnimations";
import {
  ColorSliderMotionProvider,
  useOptionalColorSliderMotionScope,
} from "./colorSliderContext";

import { CHANNEL_A11Y_LABEL, COLOR_SLIDER_LABEL_ROW_CLASS, COLOR_SLIDER_LABEL_TEXT_CLASS, COLOR_SLIDER_ROOT_CLASS, COLOR_SLIDER_VALUE_TEXT_CLASS, colorSliderBackgroundStyle, colorSliderTrackClass } from "./colorSliderStyles";
import type {
  ColorChannel,
  ColorSliderProps,
  ColorSliderTrackProps,
} from "./colorSliderTypes";
import { clampN } from "./colorUtils";

export type {
  ColorChannel,
  ColorSliderOrientation,
  ColorSliderProps,
  ColorSliderSize,
  ColorSliderTrackProps,
  ColorSliderMotion,
  ColorSliderPartMotion,
} from "./colorSliderTypes";

const CHANNEL_RANGE: Record<ColorChannel, { min: number; max: number; step: number }> = {
  hue:        { min: 0,   max: 360, step: 1   },
  saturation: { min: 0,   max: 100, step: 1   },
  value:      { min: 0,   max: 100, step: 1   },
  alpha:      { min: 0,   max: 100, step: 1   },
  red:        { min: 0,   max: 255, step: 1   },
  green:      { min: 0,   max: 255, step: 1   },
  blue:       { min: 0,   max: 255, step: 1   },
};

const CHANNEL_DEFAULT: Record<ColorChannel, number> = {
  hue: 0, saturation: 100, value: 100, alpha: 100, red: 255, green: 0, blue: 0,
};

export const ColorSliderTrack = forwardRef<HTMLDivElement, ColorSliderTrackProps>(
  function ColorSliderTrack({ motion, ...rest }, ref) {
    const parent = useOptionalColorSliderMotionScope();
    const mergedMotion = mergeMotionSlotMaps(
      parent?.getRootMotion(),
      motion ? { track: motion } : undefined,
    );
    const motionDefaults = useMemo(() => resolveColorSliderMotionDefaults(), []);

    return (
      <ColorSliderMotionProvider motion={mergedMotion} defaults={motionDefaults}>
        <ColorSliderTrackSurface forwardedRef={ref} itemMotion={motion} {...rest} />
      </ColorSliderMotionProvider>
    );
  },
);

const ColorSliderTrackSurface = forwardRef<
  HTMLDivElement,
  ColorSliderTrackProps & {
    forwardedRef: ForwardedRef<HTMLDivElement>;
    itemMotion?: ColorSliderTrackProps["motion"];
  }
>(function ColorSliderTrackSurface(
  {
    channel,
    color = { h: 0, s: 100, v: 100, a: 100 },
    value: valueProp,
    defaultValue,
    onValueChange,
    size = "base",
    orientation = "horizontal",
    disabled = false,
    className = "",
    forwardedRef,
    itemMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  _ref,
) {
    const { min, max, step } = CHANNEL_RANGE[channel];
    const [value, setValueInternal] = useControllableState({
      value: valueProp,
      defaultValue: defaultValue ?? CHANNEL_DEFAULT[channel],
    });
    const dragging = useRef(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    const [trackSpanPx, setTrackSpanPx] = useState(0);
    const fallbackThumbPx = useMemo(
      () => resolveSliderFallbackThumbPx(undefined, size),
      [size],
    );
    const [thumbSpanPx, setThumbSpanPx] = useState(fallbackThumbPx);

    useLayoutEffect(() => {
      const el = trackRef.current;
      if (!el) return;

      const measure = () => {
        const rect = el.getBoundingClientRect();
        const { trackSpanPx: spanPx, thumbSpanPx: thumbPx } = readSliderTrackMetrics(
          rect,
          orientation,
        );
        setTrackSpanPx(spanPx);
        if (thumbPx > 0) {
          setThumbSpanPx((prev) => (prev === thumbPx ? prev : thumbPx));
        }
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [orientation]);

    const emit = useCallback(
      (raw: number) => {
        const next = clampN(Math.round(raw / step) * step, min, max);
        setValueInternal(next);
        onValueChange?.(next);
      },
      [min, max, step, setValueInternal, onValueChange],
    );

    const effectiveThumbPx = thumbSpanPx > 0 ? thumbSpanPx : fallbackThumbPx;

    const updateFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const el = trackRef.current;
        if (!el || disabled) return;
        const rect = el.getBoundingClientRect();
        emit(
          sliderPointerToValue(
            clientX,
            clientY,
            rect,
            orientation,
            min,
            max,
            effectiveThumbPx,
          ),
        );
      },
      [disabled, effectiveThumbPx, emit, max, min, orientation],
    );

    useEffect(() => {
      const onMove = (e: globalThis.PointerEvent) => {
        if (!dragging.current) return;
        updateFromPointer(e.clientX, e.clientY);
      };
      const onUp = () => {
        dragging.current = false;
        setActive(false);
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

    const handleTrackDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        dragging.current = true;
        setActive(true);
        updateFromPointer(e.clientX, e.clientY);
      },
      [disabled, updateFromPointer],
    );

    const part = useColorSliderTrackMotion({
      motion: itemMotion,
      forwardedRef,
      valueIdentity: value,
      onPointerOver,
      onPointerOut,
      onPointerDown: (e) => {
        onPointerDown?.(e);
        handleTrackDown(e);
      },
      onPointerUp,
    });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        trackRef.current = node;
        part.setRef(node);
      },
      [part.setRef],
    );

    const handleThumbDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled || e.button !== 0) return;
        e.stopPropagation();
        dragging.current = true;
        setActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      },
      [disabled],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        let delta = 0;
        if (orientation === "horizontal") {
          if (e.key === "ArrowRight") delta = step;
          else if (e.key === "ArrowLeft") delta = -step;
          else if (e.key === "PageUp")   delta = step * 10;
          else if (e.key === "PageDown") delta = -step * 10;
          else if (e.key === "Home")     { emit(min); return; }
          else if (e.key === "End")      { emit(max); return; }
        } else {
          if (e.key === "ArrowUp")   delta = step;
          else if (e.key === "ArrowDown") delta = -step;
          else if (e.key === "Home")      { emit(min); return; }
          else if (e.key === "End")       { emit(max); return; }
        }
        if (delta !== 0) { e.preventDefault(); emit(value + delta); }
      },
      [disabled, orientation, step, min, max, value, emit],
    );

    const thumbPercent = sliderThumbCenterPercent(
      value,
      min,
      max,
      trackSpanPx,
      effectiveThumbPx,
    );

    return (
      <div
        ref={setRefs}
        role="presentation"
        className={colorSliderTrackClass({ size, orientation, disabled, className })}
        style={colorSliderBackgroundStyle(channel, color, orientation)}
        {...part.pointerHandlers}
        {...rest}
      >
        <SliderThumbButton
          size={size}
          percent={thumbPercent}
          orientation={orientation}
          disabled={disabled}
          active={active}
          ariaLabel={CHANNEL_A11Y_LABEL[channel]}
          ariaValueNow={value}
          ariaValueMin={min}
          ariaValueMax={max}
          onPointerDown={handleThumbDown}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  },
);

ColorSliderTrack.displayName = "ColorSliderTrack";

export const ColorSliderRoot = forwardRef<HTMLDivElement, ColorSliderProps>(
  function ColorSliderRoot(
    {
      channel,
      color,
      label,
      size = "base",
      orientation = "horizontal",
      className = "",
      children,
      motion,
      ...rest
    },
    ref,
  ) {
    const motionDefaults = useMemo(() => resolveColorSliderMotionDefaults(), []);

    return (
      <ColorSliderMotionProvider motion={motion} defaults={motionDefaults}>
        <ColorSliderRootSurface
          forwardedRef={ref}
          channel={channel}
          color={color}
          label={label}
          size={size}
          orientation={orientation}
          className={className}
          rest={rest}
        >
          {children}
        </ColorSliderRootSurface>
      </ColorSliderMotionProvider>
    );
  },
);

function ColorSliderRootSurface({
  forwardedRef,
  channel,
  color,
  label,
  size,
  orientation,
  className,
  children,
  rest,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  channel: ColorSliderProps["channel"];
  color: ColorSliderProps["color"];
  label: ColorSliderProps["label"];
  size: NonNullable<ColorSliderProps["size"]>;
  orientation: NonNullable<ColorSliderProps["orientation"]>;
  className: string;
  children: ColorSliderProps["children"];
  rest: Omit<
    ColorSliderProps,
    "channel" | "color" | "label" | "size" | "orientation" | "className" | "children" | "motion"
  >;
}) {
  const part = useColorSliderRootMotion({ forwardedRef });

  if (!children) {
    return (
      <div ref={part.setRef} className={cn(COLOR_SLIDER_ROOT_CLASS, className)} {...part.pointerHandlers}>
        {label ? (
          <div className={COLOR_SLIDER_LABEL_ROW_CLASS}>
            <Text as="span" variant="small" className={COLOR_SLIDER_LABEL_TEXT_CLASS}>{label}</Text>
            <Text as="span" variant="small" className={COLOR_SLIDER_VALUE_TEXT_CLASS}>
              {rest.value ?? rest.defaultValue ?? CHANNEL_DEFAULT[channel]}
            </Text>
          </div>
        ) : null}
        <ColorSliderTrack channel={channel} color={color} size={size} orientation={orientation} {...rest} />
      </div>
    );
  }
  return (
    <div ref={part.setRef} className={cn(COLOR_SLIDER_ROOT_CLASS, className)} {...part.pointerHandlers}>
      {children}
    </div>
  );
}

ColorSliderRoot.displayName = "ColorSliderRoot";
