import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

import type { ProgressBarTrackAriaProps } from "./progressBarTypes";

export const PROGRESS_BAR_INDETERMINATE_STATUS_TEXT = "Loading…";

export function progressBarLabelId(progressId: string): string {
  return `${progressId}-label`;
}

export function resolveProgressBarTrackAria({
  clampedValue,
  min,
  max,
  statusText,
  indeterminate,
  labelId,
  ariaDescribedBy,
}: ProgressBarTrackAriaProps): {
  "aria-valuenow"?: number;
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuetext": string;
  "aria-busy"?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
} {
  return {
    "aria-valuenow": indeterminate ? undefined : clampedValue,
    "aria-valuemin": indeterminate ? undefined : min,
    "aria-valuemax": indeterminate ? undefined : max,
    "aria-valuetext": statusText,
    "aria-busy": indeterminate || undefined,
    "aria-labelledby": labelId,
    "aria-describedby": ariaDescribedBy,
    "aria-label": labelId == null ? statusText : undefined,
  };
}

export function resolveProgressBarDescribedBy({
  ariaDescribedByProp,
  hintConnected,
  hintId,
  errorConnected,
  errorId,
}: {
  ariaDescribedByProp?: string;
  hintConnected: boolean;
  hintId?: string;
  errorConnected: boolean;
  errorId?: string;
}): string | undefined {
  return (
    ariaDescribedByProp ??
    joinFieldDescribedBy(
      hintConnected ? hintId : undefined,
      errorConnected ? errorId : undefined,
    )
  );
}

export { fieldErrorId, fieldHintId };
