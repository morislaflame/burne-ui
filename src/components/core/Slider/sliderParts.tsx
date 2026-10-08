import { useMotionPart } from "@/components/core/utils/slotMotion";
import { forwardRef } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { Field } from "@/components/core/Field";
import { Label } from "@/components/core/Label";
import { renderSliderSimpleLayout, SliderScaleFieldHeader, SliderScaleFieldValue } from "./sliderScaleField";
 
import { resolveSliderMotionDefaults, useSliderChromeSlot, useSliderTrackSlotMotion } from "./sliderAnimations";
import {
  SliderMotionProvider,
  SliderTrackProvider,
  useOptionalSliderMotionScope,
  useSliderClassNames,
  useSliderFieldContext,
} from "./sliderContext";
import {
  SliderTrackDefaultBody,
} from "./sliderTrackParts";
import type {
  SliderErrorProps,
  SliderHeaderProps,
  SliderHintProps,
  SliderLabelProps,
  SliderTrackProps,
  SliderValueProps,
} from "./sliderTypes";
import { SLIDER_LABEL_DANGER_CLASS } from "./sliderStyles";
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
  return renderSliderSimpleLayout({
    label,
    labelNode: label != null ? <SliderLabel>{label}</SliderLabel> : null,
    showValue,
    valueText,
    hintNode: hint != null ? <SliderHint>{hint}</SliderHint> : null,
    errorNode: error != null ? <SliderError>{error}</SliderError> : null,
    Header: SliderHeader,
    Value: SliderValue,
    track: <SliderTrack {...trackProps} />,
  });
}
 
export const SliderLabel = forwardRef<HTMLElement, SliderLabelProps>(
  function SliderLabel(
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
    const fieldCtx = useSliderFieldContext();
    const slotClassNames = useSliderClassNames();
    const part = useSliderChromeSlot("label", {
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
        className={cn(fieldCtx.isInvalid && SLIDER_LABEL_DANGER_CLASS, className)}
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
 
SliderLabel.displayName = "SliderLabel";
 
export function SliderHeader({ children, className, ...rest }: SliderHeaderProps) {
  const { orientation } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalSliderMotionScope(),
    slot: "header",
    pointerPhases: true,
  });
 
  return (
    <SliderScaleFieldHeader
      ref={setRef}
      orientation={orientation}
      className={cn(slotClassNames.header, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </SliderScaleFieldHeader>
  );
}
 
SliderHeader.displayName = "Slider.Header";
 
export function SliderValue({ children, className, ...rest }: SliderValueProps) {
  const { display } = useSliderFieldContext();
  const slotClassNames = useSliderClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLElement>({
    scope: useOptionalSliderMotionScope(),
    slot: "value",
    pointerPhases: true,
  });
 
  return (
    <SliderScaleFieldValue
      ref={setRef}
      fallback={display?.valueLabel}
      className={cn(slotClassNames.value, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </SliderScaleFieldValue>
  );
}
 
SliderValue.displayName = "Slider.Value";
 
export const SliderHint = forwardRef<HTMLElement, SliderHintProps>(
  function SliderHint(
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
    const ctx = useSliderFieldContext();
    const slotClassNames = useSliderClassNames();
    const part = useSliderChromeSlot("hint", {
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
 
SliderHint.displayName = "Slider.Hint";
 
export const SliderError = forwardRef<HTMLElement, SliderErrorProps>(
  function SliderError(
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
    const ctx = useSliderFieldContext();
    const slotClassNames = useSliderClassNames();
    const part = useSliderChromeSlot("error", {
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
 
SliderError.displayName = "Slider.Error";
 
export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  { motion, motionController, motionState, motionPayload, playInitialState, ...props },
  ref,
) {
  const parent = useOptionalSliderMotionScope();
  const variant = useSkinVariant(props.variant);
  const host = <SliderTrackHost {...props} motion={motion} forwardedRef={ref} />;
  if (parent) return host;
  return (
    <SliderMotionProvider
      motion={motion}
      defaults={resolveSliderMotionDefaults({
        disabled: props.disabled,
        variant,
      })}
      controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
    >
      {host}
    </SliderMotionProvider>
  );
});
 
SliderTrack.displayName = "SliderTrack";
 
function SliderTrackHost({
  forwardedRef,
  ...props
}: SliderTrackProps & { forwardedRef?: React.Ref<HTMLDivElement> }) {
  const state = useSliderTrackState(props, forwardedRef ?? null);
  const scope = useOptionalSliderMotionScope();
  useSliderTrackSlotMotion(scope, state.valueIdentity, state.disabled);
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "track",
    forwardedRef: state.setTrackRef,
    pointerPhases: true,
    onPointerDown: state.handleTrackPointerDown,
  });
 
  return (
    <div
      {...state.trackRest}
      ref={setRef}
      role="presentation"
      className={state.trackHitClass}
      style={state.trackCrossStyle}
      {...pointerHandlers}
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
}
 