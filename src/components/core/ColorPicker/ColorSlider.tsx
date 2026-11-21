import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, type KeyboardEvent, type PointerEvent } from "react";
 
import { Text } from "@/components/core/Text";
import { readSliderTrackMetrics, resolveSliderFallbackThumbPx, sliderPointerToValue, sliderThumbCenterPercent, snapSliderToStep } from "@/components/core/Slider/sliderAPI";
import { SliderThumbButton } from "@/components/core/Slider/sliderThumbParts";
import { focusElement } from "@/components/core/utils/focusElement";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
import { cn } from "@/utils/cn";
 
import { mergeMotionRootSiblings } from "@/components/core/utils/slotMotion";
import {
  mergeMotionSlotMaps,
  resolveColorSliderMotionDefaults,
  useColorSliderRootMotion,
  useColorSliderTrackMotion,
} from "./colorSliderAnimations";
import {
  ColorSliderClassNamesProvider,
  ColorSliderMotionProvider,
  useColorSliderClassNames,
  useOptionalColorSliderMotionScope,
} from "./colorSliderContext";
 
import { CHANNEL_A11Y_LABEL, COLOR_SLIDER_LABEL_ROW_CLASS, COLOR_SLIDER_LABEL_TEXT_CLASS, COLOR_SLIDER_ROOT_CLASS, COLOR_SLIDER_VALUE_TEXT_CLASS, colorSliderBackgroundStyle, colorSliderTrackClass } from "./colorSliderStyles";
import type {
  ColorChannel,
  ColorSliderProps,
  ColorSliderTrackProps,
} from "./colorSliderTypes";
 
export type {
  ColorChannel,
  ColorSliderOrientation,
  ColorSliderProps,
  ColorSliderSize,
  ColorSliderTrackProps,
  ColorSliderClassNames,
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
  function ColorSliderTrack({ motion, motionController, motionState, motionPayload, playInitialState, ...rest }, ref) {
    const parent = useOptionalColorSliderMotionScope();
    const mergedSlots = mergeMotionSlotMaps(
      parent?.getRootMotion(),
      motion ? { track: motion } : undefined,
    );
    const siblings = mergeMotionRootSiblings({
      events: parent?.getEvents(),
      states: parent?.getStates(),
    });
    const mergedMotion = { ...mergedSlots, ...siblings };
    const motionDefaults = useMemo(() => resolveColorSliderMotionDefaults(), []);
 
    return (
      <ColorSliderMotionProvider motion={mergedMotion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
    readOnly = false,
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
    const blocked = disabled || readOnly;
    const slotClassNames = useColorSliderClassNames();
    const [currentValue, setValueInternal] = useControllableState({
      value: valueProp,
      defaultValue: snapSliderToStep(defaultValue ?? CHANNEL_DEFAULT[channel], min, max, step),
    });
    const dragging = useRef(false);
    const activePointerIdRef = useRef<number | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLButtonElement>(null);
    const [active, setActive] = useState(false);
    const [isRtl, setIsRtl] = useState(false);
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
        const rtl = isRtlElement(el);
        setIsRtl((prev) => (prev === rtl ? prev : rtl));
        const rect = el.getBoundingClientRect();
        const { trackSpanPx: spanPx, thumbSpanPx: thumbPx } = readSliderTrackMetrics(
          rect,
          orientation,
        );
        setTrackSpanPx((prev) => (prev === spanPx ? prev : spanPx));
        if (thumbPx > 0) {
          setThumbSpanPx((prev) => (prev === thumbPx ? prev : thumbPx));
        }
      };
 
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, [orientation]);
 
    const emit = useCallback(
      (raw: number) => {
        if (blocked) return;
        const next = snapSliderToStep(raw, min, max, step);
        setValueInternal(next);
        onValueChange?.(next);
      },
      [blocked, min, max, step, setValueInternal, onValueChange],
    );
 
    const effectiveThumbPx = thumbSpanPx > 0 ? thumbSpanPx : fallbackThumbPx;
 
    const updateFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const el = trackRef.current;
        if (!el || blocked) return;
        const rtl = isRtlElement(el);
        setIsRtl((prev) => (prev === rtl ? prev : rtl));
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
            rtl,
          ),
        );
      },
      [blocked, effectiveThumbPx, emit, max, min, orientation],
    );
 
    const updateFromPointerRef = useRef(updateFromPointer);
    useLayoutEffect(() => {
      updateFromPointerRef.current = updateFromPointer;
    }, [updateFromPointer]);
 
    useEffect(() => {
      const onMove = (e: globalThis.PointerEvent) => {
        if (!dragging.current) return;
        if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
          return;
        }
        updateFromPointerRef.current(e.clientX, e.clientY);
      };
      const onUp = (e: globalThis.PointerEvent) => {
        if (!dragging.current) return;
        if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
          return;
        }
        activePointerIdRef.current = null;
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
    }, []);
 
    const handleTrackDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (blocked || e.button !== 0) return;
        e.preventDefault();
        activePointerIdRef.current = e.pointerId;
        dragging.current = true;
        setActive(true);
        focusElement(thumbRef.current);
        updateFromPointer(e.clientX, e.clientY);
      },
      [blocked, updateFromPointer],
    );
 
    const part = useColorSliderTrackMotion({
      motion: itemMotion,
      forwardedRef,
      valueIdentity: currentValue,
      onPointerOver,
      onPointerOut,
      onPointerDown: (e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented) handleTrackDown(e);
      },
      onPointerUp,
    });
 
    const { setRef: setTrackPartRef } = part;
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        trackRef.current = node;
        if (node) {
          const rtl = isRtlElement(node);
          setIsRtl((prev) => (prev === rtl ? prev : rtl));
        }
        setTrackPartRef(node);
      },
      [setTrackPartRef],
    );
 
    const handleThumbDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (blocked || e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (trackRef.current) {
          const rtl = isRtlElement(trackRef.current);
          setIsRtl((prev) => (prev === rtl ? prev : rtl));
        }
        activePointerIdRef.current = e.pointerId;
        dragging.current = true;
        setActive(true);
        focusElement(e.currentTarget);
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
          // Synthetic pointer events in unit tests may lack an active browser pointerId.
        }
      },
      [blocked],
    );
 
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (blocked) return;
        const rtl = isRtlElement(trackRef.current ?? e.currentTarget);
        const horizInc = rtl ? "ArrowLeft" : "ArrowRight";
        const horizDec = rtl ? "ArrowRight" : "ArrowLeft";
        let delta = 0;
        if (e.key === "Home") {
          e.preventDefault();
          emit(min);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          emit(max);
          return;
        }
        if (e.key === "PageUp") {
          delta = step * 10;
        } else if (e.key === "PageDown") {
          delta = -step * 10;
        } else if (orientation === "horizontal") {
          if (e.key === horizInc || e.key === "ArrowUp") delta = step;
          else if (e.key === horizDec || e.key === "ArrowDown") delta = -step;
        } else {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") delta = step;
          else if (e.key === "ArrowDown" || e.key === "ArrowLeft") delta = -step;
        }
        if (delta !== 0) {
          e.preventDefault();
          emit(currentValue + delta);
        }
      },
      [blocked, orientation, step, min, max, currentValue, emit],
    );
 
    const thumbPercent = sliderThumbCenterPercent(
      currentValue,
      min,
      max,
      trackSpanPx,
      effectiveThumbPx,
    );
 
    return (
      <div
        ref={setRefs}
        role="presentation"
        className={colorSliderTrackClass({
          size,
          orientation,
          disabled,
          slotClass: slotClassNames.track,
          className,
        })}
        style={colorSliderBackgroundStyle(channel, color, orientation, isRtl)}
        {...rest}
        {...part.pointerHandlers}
        {...dataVariantProps({ size })}
        data-orientation={orientation}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        <SliderThumbButton
          ref={thumbRef}
          size={size}
          percent={thumbPercent}
          orientation={orientation}
          disabled={disabled}
          readOnly={readOnly}
          isRtl={isRtl}
          active={active}
          aria-label={CHANNEL_A11Y_LABEL[channel]}
          ariaValueNow={currentValue}
          ariaValueMin={min}
          ariaValueMax={max}
          className={slotClassNames.thumb}
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
      classNames,
      children,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const motionDefaults = useMemo(() => resolveColorSliderMotionDefaults(), []);
 
    return (
      <ColorSliderMotionProvider
        motion={motion}
        defaults={motionDefaults}
        controller={children ? motionController : undefined}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <ColorSliderClassNamesProvider classNames={classNames}>
        <ColorSliderRootSurface
          forwardedRef={ref}
          channel={channel}
          color={color}
          label={label}
          size={size}
          orientation={orientation}
          className={className}
          rest={rest}
          trackController={children ? undefined : motionController}
          trackMotionState={children ? undefined : motionState}
          trackMotionPayload={children ? undefined : motionPayload}
          trackPlayInitialState={children ? undefined : playInitialState}
        >
          {children}
        </ColorSliderRootSurface>
        </ColorSliderClassNamesProvider>
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
  trackController,
  trackMotionState,
  trackMotionPayload,
  trackPlayInitialState,
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
    | "channel"
    | "color"
    | "label"
    | "size"
    | "orientation"
    | "className"
    | "classNames"
    | "children"
    | "motion"
    | "motionController"
    | "motionState"
    | "motionPayload"
    | "playInitialState"
  >;
  trackController: ColorSliderProps["motionController"];
  trackMotionState: ColorSliderProps["motionState"];
  trackMotionPayload: ColorSliderProps["motionPayload"];
  trackPlayInitialState: ColorSliderProps["playInitialState"];
}) {
  const part = useColorSliderRootMotion({ forwardedRef });
  const slotClassNames = useColorSliderClassNames();
  const { min, max, step } = CHANNEL_RANGE[channel];
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled,
    readOnly,
    ...trackRest
  } = rest;
  const [currentValue, setCurrentValue] = useControllableState({
    value: valueProp,
    defaultValue: snapSliderToStep(defaultValue ?? CHANNEL_DEFAULT[channel], min, max, step),
  });
  const handleSimpleValueChange = useCallback(
    (next: number) => {
      setCurrentValue(next);
      onValueChange?.(next);
    },
    [onValueChange, setCurrentValue],
  );

  if (!children) {
    return (
      <div
        ref={part.setRef}
        className={cn(COLOR_SLIDER_ROOT_CLASS, slotClassNames.root, className)}
        {...part.pointerHandlers}
        {...dataVariantProps({ size })}
        data-orientation={orientation}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        {label ? (
          <div className={COLOR_SLIDER_LABEL_ROW_CLASS}>
            <Text as="span" textStyle="small" className={cn(COLOR_SLIDER_LABEL_TEXT_CLASS, slotClassNames.label)}>{label}</Text>
            <Text as="span" textStyle="small" className={cn(COLOR_SLIDER_VALUE_TEXT_CLASS, slotClassNames.value)}>
              {currentValue}
            </Text>
          </div>
        ) : null}
        <ColorSliderTrack
          channel={channel}
          color={color}
          size={size}
          orientation={orientation}
          value={currentValue}
          onValueChange={handleSimpleValueChange}
          disabled={disabled}
          readOnly={readOnly}
          motionController={trackController}
          motionState={trackMotionState}
          motionPayload={trackMotionPayload}
          playInitialState={trackPlayInitialState}
          {...trackRest}
        />
      </div>
    );
  }
  return (
    <div
      ref={part.setRef}
      className={cn(COLOR_SLIDER_ROOT_CLASS, slotClassNames.root, className)}
      {...part.pointerHandlers}
      {...dataVariantProps({ size })}
      data-orientation={orientation}
      data-disabled={dataFlag(disabled)}
      data-readonly={dataFlag(readOnly)}
    >
      {children}
    </div>
  );
}
 
ColorSliderRoot.displayName = "ColorSliderRoot";
 