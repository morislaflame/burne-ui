import { useCallback, useId, useMemo, useState } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { progressBarDisplayEqual } from "./progressBarAPI";
import { progressBarLabelId } from "./progressBarA11y";
import type {
  ProgressBarDisplayState,
  ProgressBarFieldContextValue,
  UseProgressBarRootStateProps,
} from "./progressBarTypes";

export function useProgressBarRootState({
  children,
  id: idProp,
  orientation = "horizontal",
  label,
  showValue,
  valueText,
  hint,
  error,
  value,
  indeterminate,
  min,
  max,
  size,
  thickness,
  color,
  formatValue,
}: UseProgressBarRootStateProps) {
  const autoId = useId();
  const progressId = idProp ?? `progress-${autoId}`;
  const hintId = fieldHintId(progressId);
  const errorId = fieldErrorId(progressId);
  const labelId = progressBarLabelId(progressId);

  const [display, setDisplayState] = useState<ProgressBarDisplayState | null>(null);
  const setDisplay = useCallback((next: ProgressBarDisplayState | null) => {
    setDisplayState((prev) => (progressBarDisplayEqual(prev, next) ? prev : next));
  }, []);

  const isCompound = hasCompoundChildren(children);
  const hasHint =
    hint != null || (isCompound && hasCompoundChild(children, "ProgressBar.Hint"));
  const hasError =
    error != null || (isCompound && hasCompoundChild(children, "ProgressBar.Error"));

  const fieldCtx = useMemo<ProgressBarFieldContextValue>(
    () => ({
      progressId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hintId, orientation, progressId, setDisplay],
  );

  const fieldLabelCtx = useMemo(() => ({ labelId }), [labelId]);

  const trackProps = {
    value,
    indeterminate,
    min,
    max,
    size,
    thickness,
    color,
    formatValue,
    orientation,
  };

  return {
    progressId,
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
