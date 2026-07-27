import { useCallback, useId, useMemo, useState } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { meterDisplayEqual } from "./meterAPI";
import { meterLabelId } from "./meterA11y";
import type {
  MeterDisplayState,
  MeterFieldContextValue,
  UseMeterRootStateProps,
} from "./meterTypes";

export function useMeterRootState({
  children,
  id: idProp,
  orientation = "horizontal",
  label,
  showValue,
  valueText,
  hint,
  error,
  value,
  min,
  max,
  size,
  thickness,
  color,
  formatValue,
}: UseMeterRootStateProps) {
  const autoId = useId();
  const meterId = idProp ?? `meter-${autoId}`;
  const hintId = fieldHintId(meterId);
  const errorId = fieldErrorId(meterId);
  const labelId = meterLabelId(meterId);

  const [display, setDisplayState] = useState<MeterDisplayState | null>(null);
  const setDisplay = useCallback((next: MeterDisplayState | null) => {
    setDisplayState((prev) => (meterDisplayEqual(prev, next) ? prev : next));
  }, []);

  const { isCompound, hasLabel, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel: label != null || (compound && hasCompoundChild(children, "Label")),
      hasHint: hint != null || (compound && hasCompoundChild(children, "Meter.Hint")),
      hasError: error != null || (compound && hasCompoundChild(children, "Meter.Error")),
    };
  }, [children, error, hint, label]);

  const fieldCtx = useMemo<MeterFieldContextValue>(
    () => ({
      meterId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      labelConnected: hasLabel,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hasLabel, hintId, meterId, orientation, setDisplay],
  );

  const fieldLabelCtx = useMemo(() => ({ labelId }), [labelId]);

  const trackProps = {
    value,
    min,
    max,
    size,
    thickness,
    color,
    formatValue,
    orientation,
  };

  return {
    meterId,
    isCompound,
    fieldCtx,
    fieldLabelCtx,
    trackProps,
    label,
    showValue,
    valueText,
    hint,
    error,
  };
}
