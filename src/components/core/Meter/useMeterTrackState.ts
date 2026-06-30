import { useLayoutEffect, useMemo } from "react";

import {
  clampMeterValue,
  defaultMeterFormatValue,
  meterValueToPercent,
} from "./meterAPI";
import {
  meterLabelId,
  resolveMeterDescribedBy,
  resolveMeterTrackAria,
} from "./meterA11y";
import { useOptionalMeterFieldContext } from "./meterContext";
import {
  meterFillColorStyle,
  meterFillInitialStyle,
  meterFillTargetStyle,
  meterTrackCrossStyle,
} from "./meterStyles";
import type { UseMeterTrackStateProps } from "./meterTypes";

export function useMeterTrackState({
  value,
  min = 0,
  max = 100,
  size = "base",
  thickness,
  color,
  formatValue = defaultMeterFormatValue,
  orientation: orientationProp,
  "aria-describedby": ariaDescribedByProp,
}: UseMeterTrackStateProps) {
  const fieldCtx = useOptionalMeterFieldContext();
  const orientation = orientationProp ?? fieldCtx?.orientation ?? "horizontal";
  const meterId = fieldCtx?.meterId;
  const labelId = meterId != null ? meterLabelId(meterId) : undefined;
  const labelConnected = fieldCtx?.labelConnected ?? false;
  const hintConnected = fieldCtx?.hintConnected ?? false;
  const errorConnected = fieldCtx?.errorConnected ?? false;

  const clampedValue = useMemo(
    () => clampMeterValue(value, min, max),
    [max, min, value],
  );
  const percent = useMemo(
    () => meterValueToPercent(clampedValue, min, max),
    [clampedValue, max, min],
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
    min,
    max,
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

  const fillTargetStyle = useMemo(
    () => meterFillTargetStyle({ isHorizontal, percent }),
    [isHorizontal, percent],
  );

  const fillInitialStyle = useMemo(
    () =>
      meterFillInitialStyle({
        isHorizontal,
        percent,
        fillColorStyle,
      }),
    [fillColorStyle, isHorizontal, percent],
  );

  const setDisplay = fieldCtx?.setDisplay;

  useLayoutEffect(() => {
    setDisplay?.({ clampedValue, statusText, min, max });
  }, [clampedValue, max, min, setDisplay, statusText]);

  return {
    size,
    thickness,
    color,
    isHorizontal,
    percent,
    aria,
    trackCrossStyle,
    fillColorStyle,
    fillTargetStyle,
    fillInitialStyle,
  };
}
