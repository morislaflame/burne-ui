import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import {
  clampSliderValue,
  defaultSliderFormatValue,
  normalizeSliderMarks,
  partitionSliderTrackChildren,
  readSliderTrackMetrics,
  resolveSliderFallbackThumbPx,
  resolveSliderThumbIcon,
  sliderAdjacentMark,
  sliderFillSpanForValues,
  sliderFillStyleFromSpan,
  sliderPointerToValue,
  sliderStepDelta,
  sliderThumbCenterPercent,
  snapSliderToMarks,
  snapSliderToStep,
} from "./sliderAPI";
import { resolveSliderThumbA11y } from "./sliderA11y";
import { applySliderFillStyle, useSliderFillCleanup } from "./sliderAnimations";
import { useOptionalSliderFieldContext, useSliderClassNames } from "./sliderContext";
import { sliderFillClass, sliderRailClass, sliderTrackCrossStyle, sliderTrackHitAreaClass } from "./sliderStyles";
import type { SliderThumbKind, SliderTrackContextValue, SliderTrackProps } from "./sliderTypes";

export function useSliderTrackState(props: SliderTrackProps, ref: React.Ref<HTMLDivElement>) {
  const {
    orientation: orientationProp,
    size = "base",
    thickness,
    min = 0,
    max = 100,
    step = 1,
    marks: marksProp,
    formatValue = defaultSliderFormatValue,
    icon,
    gloss = false,
    thumbClassName,
    disabled = false,
    className,
    style: styleProp,
    classNames: trackClassNames,
    ariaLabel: ariaLabelProp,
    range = false,
    children,
    onPointerDown: onPointerDownProp,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...trackRest
  } = props;

  const fieldCtx = useOptionalSliderFieldContext();
  const rootClassNames = useSliderClassNames();
  const slotClassNames = useMemo(
    () => ({ ...rootClassNames, ...trackClassNames }),
    [rootClassNames, trackClassNames],
  );

  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const labelId = fieldCtx?.labelId;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const explicitLabel = ariaLabelProp;

  const resolveThumbA11y = useCallback(
    (kind: SliderThumbKind) =>
      resolveSliderThumbA11y({
        kind,
        explicitLabel,
        labelConnected,
        labelId,
        hintConnected: fieldCtx?.hintConnected ?? false,
        hintId: fieldCtx?.hintId ?? "",
        errorConnected: fieldCtx?.errorConnected ?? false,
        errorId: fieldCtx?.errorId ?? "",
      }),
    [explicitLabel, fieldCtx?.errorConnected, fieldCtx?.errorId, fieldCtx?.hintConnected, fieldCtx?.hintId, labelConnected, labelId],
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [trackSpanPx, setTrackSpanPx] = useState(0);
  const fallbackThumbPx = useMemo(
    () => resolveSliderFallbackThumbPx(thickness, size),
    [thickness, size],
  );
  const [thumbSpanPx, setThumbSpanPx] = useState(fallbackThumbPx);
  const draggingRef = useRef<"start" | "end" | "single" | null>(null);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | "single" | null>(null);

  const marks = useMemo(
    () => normalizeSliderMarks(marksProp, min, max),
    [marksProp, min, max],
  );

  const snap = useCallback(
    (raw: number) => {
      const clamped = clampSliderValue(raw, min, max);
      if (marks?.length) return snapSliderToMarks(clamped, marks);
      return snapSliderToStep(clamped, min, max, step);
    },
    [marks, min, max, step],
  );

  const [singleValue, setSingleValue] = useControllableState({
    value: !range ? (props as Extract<SliderTrackProps, { range?: false }>).value : undefined,
    defaultValue:
      (!range ? (props as Extract<SliderTrackProps, { range?: false }>).defaultValue : undefined) ??
      min,
  });

  const [rangeValue, setRangeValue] = useControllableState<[number, number]>({
    value: range ? (props as Extract<SliderTrackProps, { range: true }>).value : undefined,
    defaultValue:
      (range ? (props as Extract<SliderTrackProps, { range: true }>).defaultValue : undefined) ??
      ([min, max] as [number, number]),
  });

  const onSingleChange = !range
    ? (props as Extract<SliderTrackProps, { range?: false }>).onValueChange
    : undefined;
  const onRangeChange = range
    ? (props as Extract<SliderTrackProps, { range: true }>).onValueChange
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
      const { trackSpanPx: spanPx, thumbSpanPx: thumbPx } = readSliderTrackMetrics(
        rect,
        orientation,
      );
      setTrackSpanPx((prev) => (prev === spanPx ? prev : spanPx));
      if (thumbPx > 0) {
        setThumbSpanPx((prev) => (prev === thumbPx ? prev : thumbPx));
      }

      const span = sliderFillSpanForValues(
        spanPx,
        thumbPx > 0 ? thumbPx : fallbackThumbPx,
        min,
        max,
        range,
        nextSingle,
        nextRange,
      );
      applySliderFillStyle(fill, sliderFillStyleFromSpan(span, orientation), orientation);
    },
    [fallbackThumbPx, max, min, orientation, range, rangeValue, singleValue],
  );

  useLayoutEffect(() => {
    syncFill();
  }, [syncFill]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => syncFill());
    ro.observe(track);
    return () => ro.disconnect();
  }, [orientation, syncFill]);

  useSliderFillCleanup(fillRef);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number, thumb: "start" | "end" | "single") => {
      const track = trackRef.current;
      if (!track || disabled) return;
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
      fallbackThumbPx,
      max,
      min,
      orientation,
      range,
      rangeValue,
      singleValue,
      snap,
      syncFill,
    ],
  );

  const pickRangeThumb = useCallback(
    (clientX: number, clientY: number): "start" | "end" => {
      const track = trackRef.current;
      if (!track) return "start";
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
      onPointerDownProp?.(e);
      if (e.defaultPrevented) return;
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      const thumb = range ? pickRangeThumb(e.clientX, e.clientY) : "single";
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      updateFromPointer(e.clientX, e.clientY, thumb);
    },
    [disabled, onPointerDownProp, pickRangeThumb, range, updateFromPointer],
  );

  const onThumbPointerDown = useCallback(
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

  const onThumbKeyDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const action = sliderStepDelta(marks, step, e.key, orientation);
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
        const next = sliderAdjacentMark(current, marks, action === "mark-next" ? 1 : -1);
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

  const thumbPercent = useCallback(
    (kind: SliderThumbKind) => {
      const value =
        kind === "start"
          ? rangeValue[0]
          : kind === "end"
            ? rangeValue[1]
            : singleValue;
      return sliderThumbCenterPercent(value, min, max, trackSpanPx, thumbSpanPx);
    },
    [max, min, rangeValue, singleValue, thumbSpanPx, trackSpanPx],
  );

  const resolveThumbIcon = useCallback(
    (childrenOverride?: ReactNode) => resolveSliderThumbIcon(childrenOverride, icon),
    [icon],
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

  const fillClassResolved = sliderFillClass({
    isHorizontal,
    gloss,
    slotClass: slotClassNames.fill,
  });

  const railClass = sliderRailClass({
    size,
    disabled,
    gloss,
    slotClass: slotClassNames.rail,
  });

  const markItems = useMemo(
    () =>
      (marks ?? []).map((value) => ({
        value,
        percent: sliderThumbCenterPercent(value, min, max, trackSpanPx, thumbSpanPx),
      })),
    [marks, max, min, thumbSpanPx, trackSpanPx],
  );

  const setTrackRef = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const trackContextValue = useMemo<SliderTrackContextValue>(
    () => ({
      fillRef,
      fillClassResolved,
      railClass,
      markSlotClass: slotClassNames.mark,
      markItems,
      size,
      orientation,
      disabled,
      icon,
      range,
      gloss,
      thumbClassName,
      activeThumb,
      singleValue,
      rangeValue,
      min,
      max,
      formatValue,
      thumbPercent,
      resolveThumbIcon,
      resolveThumbA11y,
      onThumbPointerDown,
      onThumbKeyDown,
    }),
    [
      activeThumb,
      disabled,
      fillClassResolved,
      formatValue,
      gloss,
      icon,
      markItems,
      max,
      min,
      onThumbKeyDown,
      onThumbPointerDown,
      orientation,
      railClass,
      range,
      rangeValue,
      resolveThumbA11y,
      resolveThumbIcon,
      singleValue,
      size,
      slotClassNames.mark,
      thumbClassName,
      thumbPercent,
    ],
  );

  const { body: compoundBody, hasCompoundParts } = useMemo(
    () => partitionSliderTrackChildren(children),
    [children],
  );

  const trackCrossStyle = useMemo(
    () => ({ ...sliderTrackCrossStyle({ isHorizontal, thickness }), ...styleProp }),
    [isHorizontal, styleProp, thickness],
  );

  const trackHitClass = sliderTrackHitAreaClass({
    isHorizontal,
    size,
    thickness,
    gloss,
    slotClass: slotClassNames.track,
    className,
  });

  return {
    setTrackRef,
    trackHitClass,
    trackCrossStyle,
    trackRest,
    handleTrackPointerDown,
    trackContextValue,
    compoundBody,
    hasCompoundParts,
    range,
    icon,
  };
}
