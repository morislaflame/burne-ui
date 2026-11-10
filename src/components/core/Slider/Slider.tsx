import { forwardRef, useMemo, useRef, type ForwardedRef } from "react";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { dataVariantProps } from "@/components/core/utils/dataContract";
import { FieldHiddenValues, readOnlyData, useFieldControlFocus } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
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
 
export const SliderRoot = forwardRef(function SliderRoot({
  children,
  className,
  classNames,
  id,
  name,
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
  onValueCommit,
  min,
  max,
  step,
  marks,
  size,
  thickness,
  formatValue,
  icon,
  disabled,
  readOnly,
  autoFocus,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  variant,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...divRest
}: SliderProps, ref: ForwardedRef<HTMLDivElement>) {
  const state = useSliderRootState({
    children,
    id,
    name,
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
    onValueCommit,
    min,
    max,
    step,
    marks,
    size,
    thickness,
    formatValue,
    icon,
    disabled,
    readOnly,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    variant,
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
 
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
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
              ref={mergeRefs(ref, focusRef)}
              {...dataVariantProps({ size: size ?? "base", variant: resolvedVariant })}
              data-orientation={state.fieldCtx.orientation}
              data-readonly={readOnlyData(state.readOnly)}
            >
              {body}
              <FieldHiddenValues
                name={state.name}
                value={
                  state.fieldCtx.display == null
                    ? ""
                    : state.fieldCtx.display.range
                      ? state.fieldCtx.display.rangeValue
                      : state.fieldCtx.display.singleValue
                }
              />
            </Field>
          </FieldLabelContext.Provider>
        </SliderMotionProvider>
      </SliderClassNamesProvider>
    </SliderFieldProvider>
  );
});
 
SliderRoot.displayName = "Slider";
 