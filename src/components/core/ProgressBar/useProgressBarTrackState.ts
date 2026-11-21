import { useLayoutEffect, useMemo } from "react";
 
import { clampNumber } from "@/components/core/utils/clampNumber";
 
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import {
  defaultProgressBarFormatValue,
  progressBarValueToPercent,
  resolveProgressBarBounds,
} from "./progressBarAPI";
import { progressBarLabelId, resolveProgressBarDescribedBy, resolveProgressBarTrackAria } from "./progressBarA11y";
import { useOptionalProgressBarFieldContext } from "./progressBarContext";
import { progressBarFillColorStyle, progressBarTrackCrossStyle } from "./progressBarStyles";
import type { UseProgressBarTrackStateProps } from "./progressBarTypes";
 
export function useProgressBarTrackState({
  value = 0,
  indeterminate = false,
  min = 0,
  max = 100,
  size = "base",
  thickness,
  color,
  status: statusProp,
  formatValue = defaultProgressBarFormatValue,
  orientation: orientationProp,
  "aria-describedby": ariaDescribedByProp,
}: UseProgressBarTrackStateProps) {
  const fieldCtx = useOptionalProgressBarFieldContext();
  const loadingStatus = useBurneLabel("loadingStatus");
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const status = statusProp ?? fieldCtx?.status;
  const progressId = fieldCtx?.progressId;
  const labelId = progressId != null ? progressBarLabelId(progressId) : undefined;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const hintConnected = fieldCtx?.hintConnected ?? false;
  const errorConnected = fieldCtx?.errorConnected ?? false;
 
  const { safeMin, safeMax } = useMemo(
    () => resolveProgressBarBounds(min, max),
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
    () => progressBarValueToPercent(clampedValue, safeMin, safeMax),
    [clampedValue, safeMax, safeMin],
  );
 
  const isHorizontal = orientation === "horizontal";
  const statusText = useMemo(() => {
    if (indeterminate) return loadingStatus;
    return formatValue(clampedValue);
  }, [clampedValue, formatValue, indeterminate, loadingStatus]);
 
  const ariaDescribedBy = resolveProgressBarDescribedBy({
    ariaDescribedByProp,
    hintConnected,
    hintId: fieldCtx?.hintId,
    errorConnected,
    errorId: fieldCtx?.errorId,
  });
 
  const aria = resolveProgressBarTrackAria({
    clampedValue,
    min: safeMin,
    max: safeMax,
    statusText,
    indeterminate,
    labelConnected,
    labelId,
    ariaDescribedBy,
  });
 
  const trackCrossStyle = useMemo(
    () => progressBarTrackCrossStyle({ isHorizontal, thickness }),
    [isHorizontal, thickness],
  );
 
  const fillColorStyle = useMemo(() => progressBarFillColorStyle(color), [color]);
 
  const setDisplay = fieldCtx?.setDisplay;
 
  useLayoutEffect(() => {
    setDisplay?.({
      clampedValue,
      statusText,
      min: safeMin,
      max: safeMax,
      indeterminate,
    });
  }, [clampedValue, indeterminate, safeMax, safeMin, setDisplay, statusText]);
 
  return {
    size,
    thickness,
    color,
    status,
    indeterminate,
    isHorizontal,
    percent,
    aria,
    trackCrossStyle,
    fillColorStyle,
  };
}
 