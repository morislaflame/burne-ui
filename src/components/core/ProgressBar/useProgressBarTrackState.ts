import { useLayoutEffect, useMemo } from "react";
 
import { clampNumber } from "@/components/core/utils/clampNumber";
 
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { defaultProgressBarFormatValue, progressBarValueToPercent } from "./progressBarAPI";
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
  status,
  formatValue = defaultProgressBarFormatValue,
  orientation: orientationProp,
  "aria-describedby": ariaDescribedByProp,
}: UseProgressBarTrackStateProps) {
  const fieldCtx = useOptionalProgressBarFieldContext();
  const loadingStatus = useBurneLabel("loadingStatus");
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const progressId = fieldCtx?.progressId;
  const labelId = progressId != null ? progressBarLabelId(progressId) : undefined;
  const hintConnected = fieldCtx?.hintConnected ?? false;
  const errorConnected = fieldCtx?.errorConnected ?? false;
 
  const clampedValue = useMemo(
    () => clampNumber(value, min, max),
    [max, min, value],
  );
  const percent = useMemo(
    () => progressBarValueToPercent(clampedValue, min, max),
    [clampedValue, max, min],
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
    min,
    max,
    statusText,
    indeterminate,
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
      min,
      max,
      indeterminate,
    });
  }, [clampedValue, indeterminate, max, min, setDisplay, statusText]);
 
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
 