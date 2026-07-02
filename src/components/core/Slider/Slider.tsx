import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import {
  SliderClassNamesProvider,
  SliderFieldProvider,
} from "./sliderContext";
import { SliderSimpleBody } from "./sliderParts";
import { sliderRootClass } from "./sliderStyles";
import type { SliderRootProps } from "./sliderTypes";
import { useSliderRootState } from "./useSliderRootState";

export type {
  SliderClassNames,
  SliderErrorProps,
  SliderHeaderProps,
  SliderHintProps,
  SliderOrientation,
  SliderRangeProps,
  SliderRootProps,
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
  ...divRest
}: SliderRootProps) {
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

  return (
    <SliderFieldProvider value={state.fieldCtx}>
      <SliderClassNamesProvider classNames={classNames}>
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <FieldRoot
            id={state.sliderId}
            className={sliderRootClass({
              orientation: state.fieldCtx.orientation,
              slotClass: classNames?.root,
              className,
            })}
            {...divRest}
          >
            {body}
          </FieldRoot>
        </FieldLabelContext.Provider>
      </SliderClassNamesProvider>
    </SliderFieldProvider>
  );
}

SliderRoot.displayName = "Slider";

export {
  useSliderFieldContext,
  useOptionalSliderFieldContext,
} from "./sliderContext";

export { sliderThicknessToCss } from "./sliderAPI";
