import { forwardRef } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";
import { Text } from "@/components/core/Text";

import { mergeProgressBarSlotClass } from "./progressBarAPI";
import { useProgressBarFillAnimation } from "./progressBarAnimations";
import {
  useProgressBarClassNames,
  useProgressBarFieldContext,
} from "./progressBarContext";
import {
  progressBarDeterminateFillStyle,
  progressBarFillClass,
  progressBarHeaderClass,
  progressBarIndeterminateFillClass,
  progressBarTrackClass,
  progressBarValueClass,
} from "./progressBarStyles";
import type {
  ProgressBarErrorProps,
  ProgressBarHeaderProps,
  ProgressBarHintProps,
  ProgressBarSimpleBodyProps,
  ProgressBarTrackProps,
  ProgressBarValueProps,
} from "./progressBarTypes";
import { useProgressBarTrackState } from "./useProgressBarTrackState";

export function ProgressBarSimpleBody({
  label,
  showValue,
  valueText,
  hint,
  error,
  trackProps,
}: ProgressBarSimpleBodyProps) {
  const slotClassNames = useProgressBarClassNames();
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <ProgressBarHeader>
          {label != null ? (
            <Label classNames={{ root: slotClassNames.label }}>{label}</Label>
          ) : null}
          {valueText != null ? (
            <ProgressBarValue>{valueText}</ProgressBarValue>
          ) : showValue ? (
            <ProgressBarValue />
          ) : null}
        </ProgressBarHeader>
      ) : null}
      <ProgressBarTrack {...trackProps} />
      {hint != null ? <ProgressBarHint>{hint}</ProgressBarHint> : null}
      {error != null ? <ProgressBarError>{error}</ProgressBarError> : null}
    </>
  );
}

export function ProgressBarLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useProgressBarClassNames();

  return (
    <Label
      className={className}
      classNames={{
        ...classNames,
        root: mergeProgressBarSlotClass(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

ProgressBarLabel.displayName = "ProgressBarLabel";

export function ProgressBarHeader({
  children,
  className,
  ...rest
}: ProgressBarHeaderProps) {
  const { orientation } = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();

  return (
    <div
      className={progressBarHeaderClass({
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

ProgressBarHeader.displayName = "ProgressBar.Header";

export function ProgressBarValue({
  children,
  className,
  ...rest
}: ProgressBarValueProps) {
  const { display } = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();
  const text = children ?? display?.statusText;

  if (text == null) return null;

  return (
    <Text
      as="span"
      variant="base"
      className={progressBarValueClass({
        slotClass: slotClassNames.value,
        className,
      })}
      {...rest}
    >
      {text}
    </Text>
  );
}

ProgressBarValue.displayName = "ProgressBar.Value";

export function ProgressBarHint({
  children,
  className,
  id: idProp,
  ...rest
}: ProgressBarHintProps) {
  const ctx = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();

  return (
    <FieldHint
      id={idProp ?? ctx.hintId}
      className={mergeProgressBarSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

ProgressBarHint.displayName = "ProgressBar.Hint";

export function ProgressBarError({
  children,
  className,
  id: idProp,
  ...rest
}: ProgressBarErrorProps) {
  const ctx = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();

  return (
    <FieldError
      id={idProp ?? ctx.errorId}
      className={mergeProgressBarSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

ProgressBarError.displayName = "ProgressBar.Error";

export const ProgressBarTrack = forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  function ProgressBarTrack(
    {
      value,
      indeterminate,
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
    const slotClassNames = useProgressBarClassNames();
    const {
      size: resolvedSize,
      indeterminate: isIndeterminate,
      isHorizontal,
      aria,
      trackCrossStyle,
      fillColorStyle,
      fillTargetStyle,
    } = useProgressBarTrackState({
      value,
      indeterminate,
      min,
      max,
      size,
      thickness,
      color,
      formatValue,
      orientation,
      "aria-describedby": ariaDescribedByProp,
    });

    const { fillRef, reduceMotion } = useProgressBarFillAnimation({
      indeterminate: isIndeterminate,
      fillTargetStyle,
      isHorizontal,
    });

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={aria["aria-valuenow"]}
        aria-valuemin={aria["aria-valuemin"]}
        aria-valuemax={aria["aria-valuemax"]}
        aria-valuetext={aria["aria-valuetext"]}
        aria-busy={aria["aria-busy"]}
        aria-labelledby={aria["aria-labelledby"]}
        aria-describedby={aria["aria-describedby"]}
        aria-label={aria["aria-label"]}
        className={progressBarTrackClass({
          isHorizontal,
          size: resolvedSize ?? "base",
          thickness,
          slotClass: slotClassNames.track,
          className,
        })}
        style={trackCrossStyle}
        {...rest}
      >
        {isIndeterminate ? (
          <span
            ref={fillRef}
            aria-hidden
            className={progressBarIndeterminateFillClass({
              isHorizontal,
              hasCustomColor: Boolean(color),
              reduceMotion,
              slotClass: slotClassNames.indeterminateFill,
            })}
            style={fillColorStyle}
          />
        ) : (
          <span
            ref={fillRef}
            aria-hidden
            className={progressBarFillClass({
              isHorizontal,
              hasCustomColor: Boolean(color),
              slotClass: slotClassNames.fill,
            })}
            style={progressBarDeterminateFillStyle({
              isHorizontal,
              fillColorStyle,
            })}
          />
        )}
      </div>
    );
  },
);

ProgressBarTrack.displayName = "ProgressBar.Track";
