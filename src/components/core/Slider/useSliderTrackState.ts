import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
 
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { useSkinVariant } from "@/skins/skinContext";
 
import {
  clampSliderValue,
  defaultSliderFormatValue,
  normalizeSliderMarks,
  partitionSliderTrackChildren,
  readSliderTrackMetrics,
  readSliderValueBinding,
  resolveSliderFallbackThumbPx,
  resolveSliderThumbIcon,
  sliderExplicitNames,
  sliderLiveValue,
  sliderValueIdentity,
  applySliderPointer,
  commitSliderRange,
  commitSliderSingle,
  applySliderThumbKey,
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
import type { SliderThumbKind, SliderTrackContextValue, SliderTrackProps, UseSliderTrackStateResult } from "./sliderTypes";
 
export function useSliderTrackState(props: SliderTrackProps, ref: React.Ref<HTMLDivElement>): UseSliderTrackStateResult {
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
    variant: variantProp,
    disabled = false,
    readOnly = false,
    className,
    style: styleProp,
    classNames: trackClassNames,
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledByProp,
    range = false,
    children,
    onPointerDown: onPointerDownProp,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    motion: _motion,
    motionController: _motionController,
    ...trackRest
  } = props;
 
  const labels = useBurneLabels();
  const variant = useSkinVariant(variantProp);
  const fieldCtx = useOptionalSliderFieldContext();
  const rootClassNames = useSliderClassNames();
  const slotClassNames = useMemo(
    () => ({ ...rootClassNames, ...trackClassNames }),
    [rootClassNames, trackClassNames],
  );
 
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const labelId = fieldCtx?.labelId;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const { explicitLabel, labelledBy } = sliderExplicitNames(ariaLabelProp, ariaLabelledByProp);
 
  const resolveThumbA11y = useCallback(
    (kind: SliderThumbKind) =>
      resolveSliderThumbA11y({
        kind,
        explicitLabel,
        labelledBy,
        labelConnected,
        labelId,
        hintConnected: fieldCtx?.hintConnected ?? false,
        hintId: fieldCtx?.hintId ?? "",
        errorConnected: fieldCtx?.errorConnected ?? false,
        errorId: fieldCtx?.errorId ?? "",
        labels,
      }),
    [explicitLabel, fieldCtx?.errorConnected, fieldCtx?.errorId, fieldCtx?.hintConnected, fieldCtx?.hintId, labelConnected, labelId, labelledBy, labels],
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
 
  const binding = readSliderValueBinding(props, range, min, max);
  const [singleValue, setSingleValue] = useControllableState({
    value: binding.singleValue,
    defaultValue: binding.singleDefault,
  });
 
  const [rangeValue, setRangeValue] = useControllableState<[number, number]>({
    value: binding.rangeValue,
    defaultValue: binding.rangeDefault,
  });
 
  const onSingleChange = binding.onSingleChange;
  const onRangeChange = binding.onRangeChange;
  const onCommit = binding.onCommit;
  const latestRef = useRef<number | [number, number]>(singleValue);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- commit reads the value after the latest emit
  latestRef.current = sliderLiveValue(range, rangeValue, singleValue);
  const commitValue = useCallback(() => {
    onCommit?.(latestRef.current);
  }, [onCommit]);
 
  const emitSingle = useCallback(
    (next: number) => {
      commitSliderSingle(next, singleValue, snap, setSingleValue, onSingleChange, (snapped) => {
        latestRef.current = snapped;
      });
    },
    [onSingleChange, setSingleValue, singleValue, snap],
  );
 
  const emitRange = useCallback(
    (next: [number, number]) => {
      commitSliderRange(next, rangeValue, snap, setRangeValue, onRangeChange, (pair) => {
        latestRef.current = pair;
      });
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
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => syncFill());
    ro.observe(track);
    return () => ro.disconnect();
  }, [orientation, syncFill]);
 
  useSliderFillCleanup(fillRef);
 
  const updateFromPointer = useCallback(
    (clientX: number, clientY: number, thumb: "start" | "end" | "single") => {
      const track = trackRef.current;
      if (!track) return;
      applySliderPointer({
        track,
        clientX,
        clientY,
        thumb,
        disabled,
        readOnly,
        range,
        rangeValue,
        singleValue,
        min,
        max,
        orientation,
        fallbackThumbPx,
        snap,
        emitRange,
        emitSingle,
        syncFill,
      });
    },
    [
      disabled,
      emitRange,
      emitSingle,
      fallbackThumbPx,
      readOnly,
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
      if (draggingRef.current) commitValue();
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
  }, [commitValue, updateFromPointer]);
 
  const handleTrackPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerDownProp?.(e);
      if (e.defaultPrevented) return;
      if (disabled || readOnly || e.button !== 0) return;
      e.preventDefault();
      const thumb = range ? pickRangeThumb(e.clientX, e.clientY) : "single";
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      updateFromPointer(e.clientX, e.clientY, thumb);
    },
    [disabled, onPointerDownProp, pickRangeThumb, range, readOnly, updateFromPointer],
  );
 
  const onThumbPointerDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled || readOnly || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [disabled, readOnly],
  );
 
  const onThumbKeyDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      const action = sliderStepDelta(marks, step, e.key, orientation);
      if (action === 0) return;
 
      e.preventDefault();
      applySliderThumbKey({
        action,
        thumb,
        range,
        rangeValue,
        singleValue,
        min,
        max,
        marks,
        emitRange,
        emitSingle,
        commit: commitValue,
      });
    },
    [
      commitValue,
      disabled,
      readOnly,
      emitRange,
      emitSingle,
      marks,
      max,
      min,
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
    variant,
    slotClass: slotClassNames.fill,
  });
 
  const railClass = sliderRailClass({
    size,
    disabled,
    variant,
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
      variant,
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
      variant,
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
    variant,
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
    valueIdentity: sliderValueIdentity(range, rangeValue, singleValue),
    disabled,
  };
}
 