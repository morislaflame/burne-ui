import { forwardRef, useMemo } from "react";

import { Field } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";

import {
  progressScaleFromPercent,
  resolveMeterMotionDefaults,
  useMeterChromeSlot,
  useMeterFillMotion,
  useMeterTrackSlotMotion,
} from "./meterAnimations";
import {
  MeterMotionProvider,
  useMeterClassNames,
  useMeterFieldContext,
  useOptionalMeterMotionScope,
} from "./meterContext";
import { meterDeterminateFillStyle, meterFillClass, meterHeaderClass, meterTrackClass, meterValueClass } from "./meterStyles";
import type {
  MeterErrorProps,
  MeterHeaderProps,
  MeterHintProps,
  MeterLabelProps,
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
  const showHeader = label != null || showValue || valueText != null;

  return (
    <>
      {showHeader ? (
        <MeterHeader>
          {label != null ? (
            <MeterLabel>{label}</MeterLabel>
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

export const MeterLabel = forwardRef<HTMLElement, MeterLabelProps>(
  function MeterLabel(
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
    const slotClassNames = useMeterClassNames();
    const part = useMeterChromeSlot("label", {
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

export const MeterHint = forwardRef<HTMLElement, MeterHintProps>(
  function MeterHint(
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
    const ctx = useMeterFieldContext();
    const slotClassNames = useMeterClassNames();
    const part = useMeterChromeSlot("hint", {
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

MeterHint.displayName = "Meter.Hint";

export const MeterError = forwardRef<HTMLElement, MeterErrorProps>(
  function MeterError(
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
    const ctx = useMeterFieldContext();
    const slotClassNames = useMeterClassNames();
    const part = useMeterChromeSlot("error", {
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
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const parent = useOptionalMeterMotionScope();
    const mergedSlots = mergeMotionSlotMaps(
      parent?.getRootMotion(),
      motion ? { track: motion } : undefined,
    );
    const siblings = mergeMotionRootSiblings({
      events: parent?.getEvents(),
      states: parent?.getStates(),
    });
    const merged = { ...mergedSlots, ...siblings };
    const state = useMeterTrackState({
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
    const defaults = useMemo(() => resolveMeterMotionDefaults(), []);
    const percent = state.percent;
    const isHorizontal = state.isHorizontal;
    const params = useMemo(
      () => ({
        getProgressScale: () => progressScaleFromPercent(percent),
        isHorizontal,
      }),
      [isHorizontal, percent],
    );

    return (
      <MeterMotionProvider
        motion={merged}
        defaults={defaults}
        params={params}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <MeterTrackHost
          ref={ref}
          className={className}
          state={state}
          {...rest}
        />
      </MeterMotionProvider>
    );
  },
);

MeterTrack.displayName = "Meter.Track";

const MeterTrackHost = forwardRef<
  HTMLDivElement,
  Omit<
    MeterTrackProps,
    | "motion"
    | "motionController"
    | "value"
    | "min"
    | "max"
    | "size"
    | "thickness"
    | "color"
    | "formatValue"
    | "orientation"
  > & {
    state: ReturnType<typeof useMeterTrackState>;
  }
>(function MeterTrackHost({ className, state, ...rest }, ref) {
  const slotClassNames = useMeterClassNames();
  const {
    size: resolvedSize,
    thickness,
    color,
    isHorizontal,
    aria,
    trackCrossStyle,
    fillColorStyle,
    percent,
  } = state;
  const scope = useOptionalMeterMotionScope();
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
  useMeterFillMotion({
    scope,
    percent,
    isHorizontal,
    fillRef: fillPart.targetRef,
  });
  useMeterTrackSlotMotion(scope, String(percent));

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
        ref={fillPart.setRef}
        aria-hidden
        className={meterFillClass({
          isHorizontal,
          hasCustomColor: Boolean(color),
          slotClass: slotClassNames.fill,
        })}
        style={meterDeterminateFillStyle({
          isHorizontal,
          fillColorStyle,
        })}
      />
    </div>
  );
});
