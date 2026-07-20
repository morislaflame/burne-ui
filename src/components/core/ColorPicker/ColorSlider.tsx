import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { Text } from "@/components/core/Text";
import {
  readSliderTrackMetrics,
  resolveSliderFallbackThumbPx,
  sliderPointerToValue,
  sliderThumbCenterPercent,
} from "@/components/core/Slider/sliderAPI";
import { SliderThumbButton } from "@/components/core/Slider/sliderThumbParts";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { cn } from "@/utils/cn";

import {
  CHANNEL_A11Y_LABEL,
  COLOR_SLIDER_LABEL_ROW_CLASS,
  COLOR_SLIDER_LABEL_TEXT_CLASS,
  COLOR_SLIDER_ROOT_CLASS,
  COLOR_SLIDER_VALUE_TEXT_CLASS,
  colorSliderBackgroundStyle,
  colorSliderTrackClass,
} from "./colorSliderStyles";
import type {
  ColorChannel,
  ColorSliderRootProps,
  ColorSliderTrackProps,
} from "./colorSliderTypes";
import { clampN } from "./colorUtils";

export type {
  ColorChannel,
  ColorSliderOrientation,
  ColorSliderRootProps,
  ColorSliderSize,
  ColorSliderTrackProps,
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
  function ColorSliderTrack(
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
      ...rest
    },
    ref,
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

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

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
        onPointerDown={handleTrackDown}
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

export const ColorSliderRoot = forwardRef<HTMLDivElement, ColorSliderRootProps>(
  function ColorSliderRoot(
    { channel, color, label, size = "base", orientation = "horizontal", className = "", children, ...rest },
    ref,
  ) {
    if (!children) {
      return (
        <div ref={ref} className={cn(COLOR_SLIDER_ROOT_CLASS, className)}>
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
      <div ref={ref} className={cn(COLOR_SLIDER_ROOT_CLASS, className)}>
        {children}
      </div>
    );
  },
);

ColorSliderRoot.displayName = "ColorSliderRoot";
