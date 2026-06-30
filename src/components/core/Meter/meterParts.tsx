import { forwardRef } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";

import { mergeMeterSlotClass } from "./meterAPI";
import { useMeterFillAnimation } from "./meterAnimations";
import {
  useMeterClassNames,
  useMeterFieldContext,
} from "./meterContext";
import {
  meterFillClass,
  meterHeaderClass,
  meterTrackClass,
  meterValueClass,
} from "./meterStyles";
import type {
  MeterErrorProps,
  MeterHeaderProps,
  MeterHintProps,
  MeterSimpleBodyProps,
  MeterTrackProps,
  MeterValueProps,
} from "./meterTypes";
import { useMeterTrackState } from "./useMeterTrackState";

export function MeterSimpleBody({
  label,
  showValue,
  valueText,
  hint,
  error,
  trackProps,
}: MeterSimpleBodyProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <MeterHeader>
          {label != null ? <Label>{label}</Label> : null}
          {valueText != null ? (
            <MeterValue>{valueText}</MeterValue>
          ) : showValue ? (
            <MeterValue />
          ) : null}
        </MeterHeader>
      ) : null}
      {trackProps.value != null ? (
        <MeterTrack {...trackProps} value={trackProps.value} />
      ) : null}
      {hint != null ? <MeterHint>{hint}</MeterHint> : null}
      {error != null ? <MeterError>{error}</MeterError> : null}
    </>
  );
}

export function MeterHeader({ children, className, ...rest }: MeterHeaderProps) {
  const { orientation } = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();

  return (
    <div
      className={meterHeaderClass({
        orientation,
        slotClass: slotClassNames.header,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

MeterHeader.displayName = "Meter.Header";

export function MeterValue({ children, className, ...rest }: MeterValueProps) {
  const { display } = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();
  const text = children ?? display?.statusText;

  if (text == null) return null;

  return (
    <Text
      as="span"
      variant="base"
      className={meterValueClass({
        slotClass: slotClassNames.value,
        className,
      })}
      {...rest}
    >
      {text}
    </Text>
  );
}

MeterValue.displayName = "Meter.Value";

export function MeterHint({
  children,
  className,
  id: idProp,
  ...rest
}: MeterHintProps) {
  const ctx = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();

  return (
    <FieldHint
      id={idProp ?? ctx.hintId}
      className={mergeMeterSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

MeterHint.displayName = "Meter.Hint";

export function MeterError({
  children,
  className,
  id: idProp,
  ...rest
}: MeterErrorProps) {
  const ctx = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();

  return (
    <FieldError
      id={idProp ?? ctx.errorId}
      className={mergeMeterSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

MeterError.displayName = "Meter.Error";

export const MeterTrack = forwardRef<HTMLDivElement, MeterTrackProps>(
  function MeterTrack(
    {
      value,
      min,
      max,
      size,
      thickness,
      color,
      formatValue,
      orientation,
      className,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useMeterClassNames();
    const {
      size: resolvedSize,
      isHorizontal,
      aria,
      trackCrossStyle,
      fillTargetStyle,
      fillInitialStyle,
    } = useMeterTrackState({
      value,
      min,
      max,
      size,
      thickness,
      color,
      formatValue,
      orientation,
      "aria-describedby": ariaDescribedByProp,
    });

    const { fillRef } = useMeterFillAnimation({
      fillTargetStyle,
      isHorizontal,
    });

    return (
      <div
        ref={ref}
        role="meter"
        aria-valuenow={aria["aria-valuenow"]}
        aria-valuemin={aria["aria-valuemin"]}
        aria-valuemax={aria["aria-valuemax"]}
        aria-valuetext={aria["aria-valuetext"]}
        aria-labelledby={aria["aria-labelledby"]}
        aria-describedby={aria["aria-describedby"]}
        aria-label={aria["aria-label"]}
        className={meterTrackClass({
          isHorizontal,
          size: resolvedSize ?? "base",
          thickness,
          slotClass: slotClassNames.track,
          className,
        })}
        style={trackCrossStyle}
        {...rest}
      >
        <span
          ref={fillRef}
          aria-hidden
          className={meterFillClass({
            isHorizontal,
            hasCustomColor: Boolean(color),
            slotClass: slotClassNames.fill,
          })}
          style={fillInitialStyle}
        />
      </div>
    );
  },
);

MeterTrack.displayName = "Meter.Track";
