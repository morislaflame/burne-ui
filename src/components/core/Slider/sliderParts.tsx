import { forwardRef } from "react";

import "@/components/core/utils/glossPanel.css";
import { Field } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";
import { renderSliderSimpleLayout, SliderScaleFieldHeader, SliderScaleFieldValue } from "./sliderScaleField";

import { SliderTrackProvider, useSliderClassNames, useSliderFieldContext } from "./sliderContext";
import {
  SliderTrackDefaultBody,
} from "./sliderTrackParts";
import type {
  SliderErrorProps,
  SliderHeaderProps,
  SliderHintProps,
  SliderTrackProps,
  SliderValueProps,
} from "./sliderTypes";
import { useSliderTrackState } from "./useSliderTrackState";

import { cn } from "@/utils/cn";

export {
  SliderCompoundThumb,
  SliderFill,
  SliderIcon,
  SliderRail,
} from "./sliderTrackParts";

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
  const slotClassNames = useSliderClassNames();

  return renderSliderSimpleLayout({
    label,
    labelClassName: slotClassNames.label,
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

export function SliderLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useSliderClassNames();

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

SliderLabel.displayName = "SliderLabel";

export function SliderHeader({ children, className, ...rest }: SliderHeaderProps) {
  const { orientation } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <SliderScaleFieldHeader
      orientation={orientation}
      className={cn(slotClassNames.header, className)}
      {...rest}
    >
      {children}
    </SliderScaleFieldHeader>
  );
}

SliderHeader.displayName = "Slider.Header";

export function SliderValue({ children, className, ...rest }: SliderValueProps) {
  const { display } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();

  return (
    <SliderScaleFieldValue
      fallback={display?.valueLabel}
      className={cn(slotClassNames.value, className)}
      {...rest}
    >
      {children}
    </SliderScaleFieldValue>
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
    <Field.Hint
      id={idProp ?? ctx.hintId}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </Field.Hint>
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
    <Field.Error
      id={idProp ?? ctx.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </Field.Error>
  );
}

SliderError.displayName = "Slider.Error";

export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  props,
  ref,
) {
  const state = useSliderTrackState(props, ref);

  return (
    <div
      {...state.trackRest}
      ref={state.setTrackRef}
      role="presentation"
      className={state.trackHitClass}
      style={state.trackCrossStyle}
      onPointerDown={state.handleTrackPointerDown}
    >
      <SliderTrackProvider value={state.trackContextValue}>
        {state.hasCompoundParts ? (
          state.compoundBody
        ) : (
          <SliderTrackDefaultBody range={state.range} icon={state.icon} />
        )}
      </SliderTrackProvider>
    </div>
  );
});

SliderTrack.displayName = "SliderTrack";
