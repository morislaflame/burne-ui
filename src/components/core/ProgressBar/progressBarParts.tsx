import { forwardRef, useMemo } from "react";

import { Field } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import {
  progressScaleFromPercent,
  resolveProgressBarMotionDefaults,
  useProgressBarChromeSlot,
  useProgressBarFillMotion,
  useProgressBarTrackSlotMotion,
} from "./progressBarAnimations";
import {
  ProgressBarMotionProvider,
  useOptionalProgressBarMotionScope,
  useProgressBarClassNames,
  useProgressBarFieldContext,
} from "./progressBarContext";
import { progressBarDeterminateFillStyle, progressBarFillClass, progressBarHeaderClass, progressBarIndeterminateFillClass, progressBarTrackClass, progressBarValueClass } from "./progressBarStyles";
import type {
  ProgressBarErrorProps,
  ProgressBarHeaderProps,
  ProgressBarHintProps,
  ProgressBarLabelProps,
  ProgressBarSimpleBodyProps,
  ProgressBarTrackProps,
  ProgressBarValueProps,
} from "./progressBarTypes";
import { useProgressBarTrackState } from "./useProgressBarTrackState";

import { cn } from "@/utils/cn";

export function ProgressBarSimpleBody({
  label,
  showValue,
  valueText,
  hint,
  error,
  trackProps,
}: ProgressBarSimpleBodyProps) {
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <ProgressBarHeader>
          {label != null ? (
            <ProgressBarLabel>{label}</ProgressBarLabel>
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

export const ProgressBarLabel = forwardRef<HTMLElement, ProgressBarLabelProps>(
  function ProgressBarLabel(
    {
      className,
      classNames,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useProgressBarClassNames();
    const part = useProgressBarChromeSlot("label", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Label
        ref={part.setRef}
        className={className}
        classNames={{
          ...classNames,
          root: cn(slotClassNames.label, classNames?.root),
        }}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);

ProgressBarLabel.displayName = "ProgressBarLabel";

export function ProgressBarHeader({
  children,
  className,
  motion,
  ...rest
}: ProgressBarHeaderProps) {
  const { orientation } = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();
  const part = useMotionPart<HTMLDivElement>({
    scope: useOptionalProgressBarMotionScope(),
    slot: "header",
    motion,
    pointerPhases: false,
  });

  return (
    <div
      ref={part.setRef}
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
  motion,
  ...rest
}: ProgressBarValueProps) {
  const { display } = useProgressBarFieldContext();
  const slotClassNames = useProgressBarClassNames();
  const text = children ?? display?.statusText;
  const part = useMotionPart<HTMLSpanElement>({
    scope: useOptionalProgressBarMotionScope(),
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

export const ProgressBarHint = forwardRef<HTMLElement, ProgressBarHintProps>(
  function ProgressBarHint(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const ctx = useProgressBarFieldContext();
    const slotClassNames = useProgressBarClassNames();
    const part = useProgressBarChromeSlot("hint", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Field.Hint
        ref={part.setRef}
        id={idProp ?? ctx.hintId}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children}
      </Field.Hint>
    );
  },
);

ProgressBarHint.displayName = "ProgressBar.Hint";

export const ProgressBarError = forwardRef<HTMLElement, ProgressBarErrorProps>(
  function ProgressBarError(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const ctx = useProgressBarFieldContext();
    const slotClassNames = useProgressBarClassNames();
    const part = useProgressBarChromeSlot("error", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Field.Error
        ref={part.setRef}
        id={idProp ?? ctx.errorId}
        className={cn(slotClassNames.error, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children}
      </Field.Error>
    );
  },
);

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
      motion,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const parent = useOptionalProgressBarMotionScope();
    const merged = mergeMotionSlotMaps(
      parent?.getRootMotion(),
      motion ? { track: motion } : undefined,
    );
    const state = useProgressBarTrackState({
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
    const defaults = useMemo(
      () => resolveProgressBarMotionDefaults({ indeterminate: state.indeterminate }),
      [state.indeterminate],
    );
    const percent = state.percent;
    const isHorizontal = state.isHorizontal;
    const isIndeterminate = state.indeterminate;
    const params = useMemo(
      () => ({
        getProgressScale: () => progressScaleFromPercent(percent),
        isHorizontal,
        indeterminate: isIndeterminate,
      }),
      [isHorizontal, isIndeterminate, percent],
    );

    return (
      <ProgressBarMotionProvider motion={merged} defaults={defaults} params={params}>
        <ProgressBarTrackHost
          ref={ref}
          className={className}
          state={state}
          {...rest}
        />
      </ProgressBarMotionProvider>
    );
  },
);

ProgressBarTrack.displayName = "ProgressBar.Track";

const ProgressBarTrackHost = forwardRef<
  HTMLDivElement,
  Omit<
    ProgressBarTrackProps,
    | "motion"
    | "value"
    | "indeterminate"
    | "min"
    | "max"
    | "size"
    | "thickness"
    | "color"
    | "formatValue"
    | "orientation"
  > & {
    state: ReturnType<typeof useProgressBarTrackState>;
  }
>(function ProgressBarTrackHost({ className, state, ...rest }, ref) {
  const slotClassNames = useProgressBarClassNames();
  const {
    size: resolvedSize,
    thickness,
    color,
    indeterminate: isIndeterminate,
    isHorizontal,
    aria,
    trackCrossStyle,
    fillColorStyle,
    percent,
  } = state;
  const scope = useOptionalProgressBarMotionScope();
  const trackPart = useMotionPart<HTMLDivElement>({
    scope,
    slot: "track",
    forwardedRef: ref,
    pointerPhases: false,
  });
  const fillPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "fill",
    pointerPhases: false,
  });
  const { reduceMotion } = useProgressBarFillMotion({
    scope,
    percent,
    isHorizontal,
    indeterminate: isIndeterminate,
    fillRef: fillPart.targetRef,
  });
  useProgressBarTrackSlotMotion(
    scope,
    isIndeterminate ? "indeterminate" : String(percent),
  );

  return (
    <div
      ref={trackPart.setRef}
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
          ref={fillPart.setRef}
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
          ref={fillPart.setRef}
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
});
