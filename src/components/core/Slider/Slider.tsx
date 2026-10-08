import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { useMemo } from "react";

import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";
 
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
  SliderLabelProps,
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
  SliderVariant,
  KitSliderVariant,
} from "./sliderTypes";

export { KIT_SLIDER_VARIANTS } from "./sliderTypes";
 
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
  invalid,
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
  variant,
  thumbClassName,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
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
    invalid,
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
    variant,
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
 
  const resolvedVariant = useSkinVariant(variant);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveSliderMotionDefaults({ disabled, variant });
  }, [disabled, skinRevision, variant]);
 
  return (
    <SliderFieldProvider value={state.fieldCtx}>
      <SliderClassNamesProvider classNames={classNames}>
        <SliderMotionProvider
          motion={motion}
          defaults={motionDefaults}
          controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
        >
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              id={state.sliderId}
              className={sliderRootClass({
                orientation: state.fieldCtx.orientation,
                slotClass: classNames?.root,
                className,
              })}
              {...divRest}
              {...dataVariantProps({ size: size ?? "base", variant: resolvedVariant })}
              data-orientation={state.fieldCtx.orientation}
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
 