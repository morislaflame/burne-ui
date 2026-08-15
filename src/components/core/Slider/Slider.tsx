import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useMemo } from "react";

import { resolveSliderMotionDefaults } from "./sliderAnimations";
import { SliderClassNamesProvider, SliderFieldProvider, SliderMotionProvider } from "./sliderContext";
import { SliderSimpleBody } from "./sliderParts";
import { sliderRootClass } from "./sliderStyles";
import type { SliderProps } from "./sliderTypes";
import { useSliderRootState } from "./useSliderRootState";

export type {
  SliderClassNames,
  SliderErrorProps,
  SliderHeaderProps,
  SliderHintProps,
  SliderOrientation,
  SliderRangeProps,
  SliderProps,
  SliderSingleProps,
  SliderSize,
  SliderThickness,
  SliderTrackProps,
  SliderValueProps,
  SliderFillProps,
  SliderIconProps,
  SliderRailProps,
  SliderThumbProps,
  SliderThumbKind,
  SliderMotion,
  SliderPartMotion,
} from "./sliderTypes";

export {
  SliderTrack,
  SliderFill,
  SliderRail,
  SliderCompoundThumb as SliderThumb,
  SliderIcon,
  SliderHeader,
  SliderLabel,
  SliderValue,
  SliderHint,
  SliderError,
} from "./sliderParts";

export function SliderRoot({
  children,
  className,
  classNames,
  id,
  orientation,
  label,
  showValue,
  valueText,
  hint,
  error,
  range,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  marks,
  size,
  thickness,
  formatValue,
  icon,
  disabled,
  ariaLabel,
  gloss,
  thumbClassName,
  motion,
  ...divRest
}: SliderProps) {
  const state = useSliderRootState({
    children,
    id,
    orientation,
    label,
    showValue,
    valueText,
    hint,
    error,
    range,
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    marks,
    size,
    thickness,
    formatValue,
    icon,
    disabled,
    ariaLabel,
    gloss,
    thumbClassName,
  });

  const body = state.isCompound ? (
    children
  ) : (
    <SliderSimpleBody
      label={state.label}
      showValue={state.showValue}
      valueText={state.valueText}
      hint={state.hint}
      error={state.error}
      hintId={state.hasHint ? state.hintId : undefined}
      errorId={state.hasError ? state.errorId : undefined}
      trackProps={state.trackProps}
    />
  );

  const motionDefaults = useMemo(
    () => resolveSliderMotionDefaults({ disabled }),
    [disabled],
  );

  return (
    <SliderFieldProvider value={state.fieldCtx}>
      <SliderClassNamesProvider classNames={classNames}>
        <SliderMotionProvider motion={motion} defaults={motionDefaults}>
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              id={state.sliderId}
              className={sliderRootClass({
                orientation: state.fieldCtx.orientation,
                slotClass: classNames?.root,
                className,
              })}
              {...divRest}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </SliderMotionProvider>
      </SliderClassNamesProvider>
    </SliderFieldProvider>
  );
}

SliderRoot.displayName = "Slider";
