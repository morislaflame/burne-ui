import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
 
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { focusElement } from "@/components/core/utils/focusElement";
import { isRtlElement } from "@/components/core/utils/readingDirection";
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
  const fieldCtx = useOptionalSliderFieldContext();
  const rootTrack = fieldCtx?.trackProps;

  const {
    orientation: orientationProp,
    size: sizeProp,
    thickness: thicknessProp,
    min: minProp,
    max: maxProp,
    step: stepProp,
    marks: marksProp,
    formatValue: formatValueProp,
    icon: iconProp,
    variant: variantProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    className,
    style: styleProp,
    classNames: trackClassNames,
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledByProp,
    range: rangeProp,
    children,
    onPointerDown: onPointerDownProp,
    value: valueProp,
    defaultValue: defaultValueProp,
    onValueChange: onValueChangeProp,
    onValueCommit: onValueCommitProp,
    motion: _motion,
    motionController: _motionController,
    motionState: _motionState,
    motionPayload: _motionPayload,
    playInitialState: _playInitialState,
    ...trackRest
  } = props;
 
  const size = sizeProp ?? rootTrack?.size ?? "base";
  const thickness = thicknessProp ?? rootTrack?.thickness;
  const min = minProp ?? rootTrack?.min ?? 0;
  const max = maxProp ?? rootTrack?.max ?? 100;
  const step = stepProp ?? rootTrack?.step ?? 1;
  const resolvedMarksProp = marksProp ?? rootTrack?.marks;
  const formatValue = formatValueProp ?? rootTrack?.formatValue ?? defaultSliderFormatValue;
  const icon = iconProp ?? rootTrack?.icon;
  const disabled = Boolean(disabledProp ?? rootTrack?.disabled);
  const readOnly = Boolean(readOnlyProp ?? rootTrack?.readOnly);
  const range = Boolean(rangeProp ?? rootTrack?.range);
  const mergedAriaLabel = ariaLabelProp ?? rootTrack?.["aria-label"];
  const mergedAriaLabelledBy = ariaLabelledByProp ?? rootTrack?.["aria-labelledby"];
 
  const mergedValueProps = useMemo(() => {
    const rootChange = rootTrack?.onValueChange as ((next: unknown) => void) | undefined;
    const ownChange = onValueChangeProp as ((next: unknown) => void) | undefined;
    const mergedChange =
      ownChange && rootChange && ownChange !== rootChange
        ? (next: unknown) => {
            ownChange(next);
            rootChange(next);
          }
        : (ownChange ?? rootChange);

    const rootCommit = rootTrack?.onValueCommit as ((next: unknown) => void) | undefined;
    const ownCommit = onValueCommitProp as ((next: unknown) => void) | undefined;
    const mergedCommit =
      ownCommit && rootCommit && ownCommit !== rootCommit
        ? (next: unknown) => {
            ownCommit(next);
            rootCommit(next);
          }
        : (ownCommit ?? rootCommit);

    return {
      range,
      value: valueProp !== undefined ? valueProp : rootTrack?.value,
      defaultValue: defaultValueProp !== undefined ? defaultValueProp : rootTrack?.defaultValue,
      onValueChange: mergedChange,
      onValueCommit: mergedCommit,
    } as SliderTrackProps;
  }, [defaultValueProp, onValueChangeProp, onValueCommitProp, range, rootTrack, valueProp]);
 
  const labels = useBurneLabels();
  const variant = useSkinVariant(variantProp ?? rootTrack?.variant);
  const rootClassNames = useSliderClassNames();
  const slotClassNames = useMemo(
    () => ({ ...rootClassNames, ...trackClassNames }),
    [rootClassNames, trackClassNames],
  );
 
  const orientation = orientationProp ?? rootTrack?.orientation ?? fieldCtx?.orientation ?? "horizontal";
  const labelId = fieldCtx?.labelId;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const { explicitLabel, labelledBy } = sliderExplicitNames(mergedAriaLabel, mergedAriaLabelledBy);
 
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
  const singleThumbRef = useRef<HTMLButtonElement | null>(null);
  const startThumbRef = useRef<HTMLButtonElement | null>(null);
  const endThumbRef = useRef<HTMLButtonElement | null>(null);
  const [trackSpanPx, setTrackSpanPx] = useState(0);
  const [isRtl, setIsRtl] = useState(false);
  const fallbackThumbPx = useMemo(
    () => resolveSliderFallbackThumbPx(thickness, size),
    [thickness, size],
  );
  const [thumbSpanPx, setThumbSpanPx] = useState(fallbackThumbPx);
  const draggingRef = useRef<"start" | "end" | "single" | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [activeThumb, setActiveThumb] = useState<"start" | "end" | "single" | null>(null);
 
  const registerControlRef = fieldCtx?.registerControlRef;
  const getThumbRef = useCallback(
    (kind: SliderThumbKind) => (node: HTMLButtonElement | null) => {
      if (kind === "start") {
        startThumbRef.current = node;
        if (range) registerControlRef?.(node);
      } else if (kind === "end") {
        endThumbRef.current = node;
      } else {
        singleThumbRef.current = node;
        if (!range) registerControlRef?.(node);
      }
    },
    [range, registerControlRef],
  );
 
  const thumbNodeFor = useCallback((kind: SliderThumbKind): HTMLButtonElement | null => {
    if (kind === "start") return startThumbRef.current;
    if (kind === "end") return endThumbRef.current;
    return singleThumbRef.current;
  }, []);
 
  const marks = useMemo(
    () => normalizeSliderMarks(resolvedMarksProp, min, max),
    [resolvedMarksProp, min, max],
  );
 
  const snap = useCallback(
    (raw: number) => {
      const clamped = clampSliderValue(raw, min, max);
      if (marks?.length) return snapSliderToMarks(clamped, marks);
      return snapSliderToStep(clamped, min, max, step);
    },
    [marks, min, max, step],
  );
 
  const binding = readSliderValueBinding(mergedValueProps, range, min, max);
  const singleDefaultSnapped = snap(binding.singleDefault);
  const rangeDefaultSnapped = useMemo<[number, number]>(() => {
    const a = snap(binding.rangeDefault[0]);
    const b = snap(binding.rangeDefault[1]);
    return a <= b ? [a, b] : [b, a];
  }, [binding.rangeDefault, snap]);
 
  const [singleValue, setSingleValue] = useControllableState({
    value: binding.singleValue,
    defaultValue: singleDefaultSnapped,
  });
 
  const [rangeValue, setRangeValue] = useControllableState<[number, number]>({
    value: binding.rangeValue,
    defaultValue: rangeDefaultSnapped,
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
      if (!track) return;
      const rtl = isRtlElement(track);
      setIsRtl((prev) => (prev === rtl ? prev : rtl));
      if (!fill) return;
 
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
 
  const isUncontrolled = range ? binding.rangeValue === undefined : binding.singleValue === undefined;
  useNativeFormReset(
    trackRef,
    () => {
      if (range) {
        setRangeValue(rangeDefaultSnapped);
        latestRef.current = rangeDefaultSnapped;
      } else {
        setSingleValue(singleDefaultSnapped);
        latestRef.current = singleDefaultSnapped;
      }
    },
    isUncontrolled,
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
      if (!track || disabled || readOnly) return;
      let resolvedThumb = thumb;
      if (range && rangeValue[0] === rangeValue[1]) {
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
          isRtlElement(track),
        );
        if (raw > rangeValue[1] && resolvedThumb === "start") {
          resolvedThumb = "end";
          draggingRef.current = "end";
          setActiveThumb("end");
          focusElement(thumbNodeFor("end"));
        } else if (raw < rangeValue[0] && resolvedThumb === "end") {
          resolvedThumb = "start";
          draggingRef.current = "start";
          setActiveThumb("start");
          focusElement(thumbNodeFor("start"));
        }
      }
      applySliderPointer({
        track,
        clientX,
        clientY,
        thumb: resolvedThumb,
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
      thumbNodeFor,
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
        isRtlElement(track),
      );
      const [lo, hi] = rangeValue;
      if (lo === hi) {
        if (raw > hi) return "end";
        if (raw < lo) return "start";
        return lo <= min ? "end" : "start";
      }
      return Math.abs(raw - lo) <= Math.abs(raw - hi) ? "start" : "end";
    },
    [fallbackThumbPx, max, min, orientation, rangeValue],
  );
 
  const updateFromPointerRef = useRef(updateFromPointer);
  const commitValueRef = useRef(commitValue);
  useLayoutEffect(() => {
    updateFromPointerRef.current = updateFromPointer;
    commitValueRef.current = commitValue;
  }, [commitValue, updateFromPointer]);
 
  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      const thumb = draggingRef.current;
      if (!thumb) return;
      if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
        return;
      }
      updateFromPointerRef.current(e.clientX, e.clientY, thumb);
    };
    const onUp = (e: globalThis.PointerEvent) => {
      if (!draggingRef.current) return;
      if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) {
        return;
      }
      activePointerIdRef.current = null;
      draggingRef.current = null;
      setActiveThumb(null);
      commitValueRef.current();
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
 
  const handleTrackPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerDownProp?.(e);
      if (e.defaultPrevented) return;
      if (disabled || readOnly || e.button !== 0) return;
      e.preventDefault();
      if (trackRef.current) {
        const rtl = isRtlElement(trackRef.current);
        setIsRtl((prev) => (prev === rtl ? prev : rtl));
      }
      const thumb = range ? pickRangeThumb(e.clientX, e.clientY) : "single";
      activePointerIdRef.current = e.pointerId;
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      focusElement(thumbNodeFor(thumb));
      updateFromPointer(e.clientX, e.clientY, thumb);
    },
    [disabled, onPointerDownProp, pickRangeThumb, range, readOnly, thumbNodeFor, updateFromPointer],
  );
 
  const onThumbPointerDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: PointerEvent<HTMLButtonElement>) => {
      if (disabled || readOnly || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (trackRef.current) {
        const rtl = isRtlElement(trackRef.current);
        setIsRtl((prev) => (prev === rtl ? prev : rtl));
      }
      activePointerIdRef.current = e.pointerId;
      draggingRef.current = thumb;
      setActiveThumb(thumb);
      focusElement(e.currentTarget);
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {
        // Synthetic pointer events in unit tests may lack an active browser pointerId.
      }
    },
    [disabled, readOnly],
  );
 
  const onThumbKeyDown = useCallback(
    (thumb: "start" | "end" | "single") => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      const rtl = isRtlElement(trackRef.current ?? e.currentTarget);
      const action = sliderStepDelta(marks, step, e.key, orientation, rtl);
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
      if (node) {
        const rtl = isRtlElement(node);
        setIsRtl((prev) => (prev === rtl ? prev : rtl));
      }
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
      readOnly,
      isRtl,
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
      getThumbRef,
      resolveThumbIcon,
      resolveThumbA11y,
      onThumbPointerDown,
      onThumbKeyDown,
    }),
    [
      activeThumb,
      disabled,
      readOnly,
      isRtl,
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
      getThumbRef,
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
 