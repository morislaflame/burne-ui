import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

import type { MeterTrackAriaProps } from "./meterTypes";

export function meterLabelId(meterId: string): string {
  return `${meterId}-label`;
}

export function resolveMeterTrackAria({
  clampedValue,
  min,
  max,
  statusText,
  labelConnected,
  labelId,
  ariaDescribedBy,
}: MeterTrackAriaProps): {
  "aria-valuenow": number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuetext": string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
} {
  return {
    "aria-valuenow": clampedValue,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuetext": statusText,
    "aria-labelledby": labelConnected ? labelId : undefined,
    "aria-describedby": ariaDescribedBy,
    "aria-label": labelConnected ? undefined : statusText,
  };
}

export function resolveMeterDescribedBy({
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
