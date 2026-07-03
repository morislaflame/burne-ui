import { FieldError, FieldHint } from "@/components/core/Field";
import { Label } from "@/components/core/Label";

import type { ScaleSimpleLayoutProps } from "./scaleFieldParts";

/** Simple mode layout for Meter / ProgressBar / Slider. */
export function renderScaleSimpleLayout({
  label,
  labelClassName,
  showValue,
  valueText,
  hint,
  hintId,
  error,
  errorId,
  Header,
  Value,
  track,
}: ScaleSimpleLayoutProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <Header>
          {label != null ? (
            <Label classNames={labelClassName ? { root: labelClassName } : undefined}>
              {label}
            </Label>
          ) : null}
          {valueText != null ? (
            <Value>{valueText}</Value>
          ) : showValue ? (
            <Value />
          ) : null}
        </Header>
      ) : null}
      {track}
      {hint != null ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error != null ? <FieldError id={errorId}>{error}</FieldError> : null}
    </>
  );
}
