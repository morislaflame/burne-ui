import { forwardRef } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import {
  ScaleFieldHeader,
  ScaleFieldValue,
} from "@/components/core/utils/scaleFieldParts";
import { renderScaleSimpleLayout } from "@/components/core/utils/scaleFieldLayout";

import { mergeSliderSlotClass, resolveSliderThumbIcon } from "./sliderAPI";
import {
  SliderTrackProvider,
  useSliderClassNames,
  useSliderFieldContext,
  useSliderTrackContext,
} from "./sliderContext";
import type {
  SliderCompoundThumbProps,
  SliderErrorProps,
  SliderFillProps,
  SliderHeaderProps,
  SliderHintProps,
  SliderIconProps,
  SliderRailProps,
  SliderTrackProps,
  SliderValueProps,
} from "./sliderTypes";
import { useSliderTrackState } from "./useSliderTrackState";

export function SliderSimpleBody({
  label,
  showValue,
  valueText,
  hint,
  error,
  hintId,
  errorId,
  trackProps,
}: {
  label?: React.ReactNode;
  showValue?: boolean;
  valueText?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  hintId?: string;
  errorId?: string;
  trackProps: SliderTrackProps;
}) {
  return renderScaleSimpleLayout({
    label,
    showValue,
    valueText,
    hint,
    hintId,
    error,
    errorId,
    Header: SliderHeader,
    Value: SliderValue,
    track: <SliderTrack {...trackProps} />,
  });
}

export function SliderHeader({ children, className, ...rest }: SliderHeaderProps) {
  const { orientation } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <ScaleFieldHeader
      orientation={orientation}
      className={mergeSliderSlotClass(slotClassNames.header, className)}
      {...rest}
    >
      {children}
    </ScaleFieldHeader>
  );
}

SliderHeader.displayName = "Slider.Header";

export function SliderValue({ children, className, ...rest }: SliderValueProps) {
  const { display } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <ScaleFieldValue
      fallback={display?.valueLabel}
      className={mergeSliderSlotClass(slotClassNames.value, className)}
      {...rest}
    >
      {children}
    </ScaleFieldValue>
  );
}

SliderValue.displayName = "Slider.Value";

export function SliderHint({
  children,
  className,
  id: idProp,
  ...rest
}: SliderHintProps) {
  const ctx = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <FieldHint
      id={idProp ?? ctx.hintId}
      className={mergeSliderSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

SliderHint.displayName = "Slider.Hint";

export function SliderError({
  children,
  className,
  id: idProp,
  ...rest
}: SliderErrorProps) {
  const ctx = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <FieldError
      id={idProp ?? ctx.errorId}
      className={mergeSliderSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

SliderError.displayName = "Slider.Error";

export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  props,
  ref,
) {
  const state = useSliderTrackState(props, ref);

  const defaultBody = (
    <>
      <SliderRail />
      {state.range ? (
        <>
          <SliderCompoundThumb thumb="start">
            {state.icon != null ? <SliderIcon>{state.icon}</SliderIcon> : null}
          </SliderCompoundThumb>
          <SliderCompoundThumb thumb="end">
            {state.icon != null ? <SliderIcon>{state.icon}</SliderIcon> : null}
          </SliderCompoundThumb>
        </>
      ) : (
        <SliderCompoundThumb thumb="single">
          {state.icon != null ? <SliderIcon>{state.icon}</SliderIcon> : null}
        </SliderCompoundThumb>
      )}
    </>
  );

  return (
    <div
      ref={state.setTrackRef}
      role="presentation"
      className={state.trackHitClass}
      style={state.trackCrossStyle}
      onPointerDown={state.handleTrackPointerDown}
    >
      <SliderTrackProvider value={state.trackContextValue}>
        {state.hasCompoundParts ? state.compoundBody : defaultBody}
      </SliderTrackProvider>
    </div>
  );
});

SliderTrack.displayName = "SliderTrack";

export function SliderFill({ className, ...rest }: SliderFillProps) {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();

  return (
    <span
      ref={ctx.fillRef}
      className={mergeSliderSlotClass(ctx.fillClassResolved, slotClassNames.fill, className)}
      {...rest}
    />
  );
}

SliderFill.displayName = "SliderFill";

export function SliderRail({ className, children, ...rest }: SliderRailProps) {
  const ctx = useSliderTrackContext();
  const slotClassNames = useSliderClassNames();

  return (
    <div
      className={mergeSliderSlotClass(ctx.railClass, slotClassNames.rail, className)}
      aria-hidden
      {...rest}
    >
      {children ?? (
        <>
          <SliderFill />
          {ctx.markNodes}
        </>
      )}
    </div>
  );
}

SliderRail.displayName = "SliderRail";

export function SliderCompoundThumb({ thumb = "single", children }: SliderCompoundThumbProps) {
  const ctx = useSliderTrackContext();
  const icon = resolveSliderThumbIcon(children, ctx.icon);
  return ctx.renderThumb(thumb, icon);
}

SliderCompoundThumb.displayName = "SliderThumb";

export function SliderIcon({ children }: SliderIconProps) {
  return children;
}

SliderIcon.displayName = "SliderIcon";
