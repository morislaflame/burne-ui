import { forwardRef } from "react";

import { Field } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import { useMeterFillAnimation, useMeterTrackSlotMotion } from "./meterAnimations";
import {
  useMeterClassNames,
  useMeterFieldContext,
  useOptionalMeterMotionScope,
} from "./meterContext";
import { meterFillClass, meterHeaderClass, meterTrackClass, meterValueClass } from "./meterStyles";
import type {
  MeterErrorProps,
  MeterHeaderProps,
  MeterHintProps,
  MeterSimpleBodyProps,
  MeterTrackProps,
  MeterValueProps,
} from "./meterTypes";
import { useMeterTrackState } from "./useMeterTrackState";

import { cn } from "@/utils/cn";

export function MeterSimpleBody({
  label,
  showValue,
  valueText,
  hint,
  error,
  trackProps,
}: MeterSimpleBodyProps) {
  const slotClassNames = useMeterClassNames();
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <MeterHeader>
          {label != null ? (
            <Label classNames={{ root: slotClassNames.label }}>{label}</Label>
          ) : null}
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

export function MeterLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useMeterClassNames();

  return (
    <Label
      className={className}
      classNames={{
        ...classNames,
        root: cn(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

MeterLabel.displayName = "MeterLabel";

export function MeterHeader({ children, className, motion, ...rest }: MeterHeaderProps) {
  const { orientation } = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();
  const part = useMotionPart<HTMLDivElement>({
    scope: useOptionalMeterMotionScope(),
    slot: "header",
    motion,
    pointerPhases: false,
  });

  return (
    <div
      ref={part.setRef}
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

export function MeterValue({ children, className, motion, ...rest }: MeterValueProps) {
  const { display } = useMeterFieldContext();
  const slotClassNames = useMeterClassNames();
  const text = children ?? display?.statusText;
  const part = useMotionPart<HTMLSpanElement>({
    scope: useOptionalMeterMotionScope(),
    slot: "value",
    motion,
    pointerPhases: false,
  });

  if (text == null) return null;

  return (
    <Text
      as="span"
      variant="base"
      ref={part.setRef}
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
    <Field.Hint
      id={idProp ?? ctx.hintId}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </Field.Hint>
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
    <Field.Error
      id={idProp ?? ctx.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </Field.Error>
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
      motion,
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

    const scope = useOptionalMeterMotionScope();
    const trackPart = useMotionPart<HTMLDivElement>({
      scope,
      slot: "track",
      motion,
      forwardedRef: ref,
      pointerPhases: false,
    });
    const fillPart = useMotionPart<HTMLSpanElement>({
      scope,
      slot: "fill",
      pointerPhases: false,
    });
    const { fillRef } = useMeterFillAnimation({
      fillTargetStyle,
      isHorizontal,
    });
    useMeterTrackSlotMotion(scope, value);
    const setFillRef = (node: HTMLSpanElement | null) => {
      fillRef.current = node;
      fillPart.setRef(node);
    };

    return (
      <div
        ref={trackPart.setRef}
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
          ref={setFillRef}
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
