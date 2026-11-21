import { useLayoutEffect, useMemo } from "react";
 
import { clampNumber } from "@/components/core/utils/clampNumber";
 
import { defaultMeterFormatValue, meterValueToPercent, resolveMeterBounds } from "./meterAPI";
import { meterLabelId, resolveMeterDescribedBy, resolveMeterTrackAria } from "./meterA11y";
import { useOptionalMeterFieldContext } from "./meterContext";
import { meterFillColorStyle, meterTrackCrossStyle } from "./meterStyles";
import type { UseMeterTrackStateProps } from "./meterTypes";
 
export function useMeterTrackState({
  value,
  min = 0,
  max = 100,
  size = "base",
  thickness,
  color,
  status: statusProp,
  formatValue = defaultMeterFormatValue,
  orientation: orientationProp,
  "aria-describedby": ariaDescribedByProp,
}: UseMeterTrackStateProps) {
  const fieldCtx = useOptionalMeterFieldContext();
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const status = statusProp ?? fieldCtx?.status;
  const meterId = fieldCtx?.meterId;
  const labelId = meterId != null ? meterLabelId(meterId) : undefined;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const hintConnected = fieldCtx?.hintConnected ?? false;
  const errorConnected = fieldCtx?.errorConnected ?? false;
 
  const { safeMin, safeMax } = useMemo(
    () => resolveMeterBounds(min, max),
    [max, min],
  );
  const clampedValue = useMemo(
    () =>
      value === Number.POSITIVE_INFINITY
        ? safeMax
        : clampNumber(value, safeMin, safeMax),
    [safeMax, safeMin, value],
  );
  const percent = useMemo(
    () => meterValueToPercent(clampedValue, safeMin, safeMax),
    [clampedValue, safeMax, safeMin],
  );
 
  const isHorizontal = orientation === "horizontal";
  const statusText = useMemo(
    () => formatValue(clampedValue),
    [clampedValue, formatValue],
  );
 
  const ariaDescribedBy = resolveMeterDescribedBy({
    ariaDescribedByProp,
    hintConnected,
    hintId: fieldCtx?.hintId,
    errorConnected,
    errorId: fieldCtx?.errorId,
  });
 
  const aria = resolveMeterTrackAria({
    clampedValue,
    min: safeMin,
    max: safeMax,
    statusText,
    labelConnected,
    labelId,
    ariaDescribedBy,
  });
 
  const trackCrossStyle = useMemo(
    () => meterTrackCrossStyle({ isHorizontal, thickness }),
    [isHorizontal, thickness],
  );
 
  const fillColorStyle = useMemo(() => meterFillColorStyle(color), [color]);
 
  const setDisplay = fieldCtx?.setDisplay;
 
  useLayoutEffect(() => {
    setDisplay?.({ clampedValue, statusText, min: safeMin, max: safeMax });
  }, [clampedValue, safeMax, safeMin, setDisplay, statusText]);
 
  return {
    size,
    thickness,
    color,
    status,
    isHorizontal,
    percent,
    aria,
    trackCrossStyle,
    fillColorStyle,
  };
}
 