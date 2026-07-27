import { useCallback, useId, useMemo, useState } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { sliderDisplayEqual } from "./sliderAPI";
import { sliderLabelId } from "./sliderA11y";
import type {
  SliderDisplayState,
  SliderFieldContextValue,
  SliderTrackProps,
  UseSliderRootStateProps,
} from "./sliderTypes";

export function useSliderRootState({
  children,
  id: idProp,
  orientation = "horizontal",
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
}: UseSliderRootStateProps) {
  const autoId = useId();
  const sliderId = idProp ?? `slider-${autoId}`;
  const hintId = fieldHintId(sliderId);
  const errorId = fieldErrorId(sliderId);
  const labelId = sliderLabelId(sliderId);

  const [display, setDisplayState] = useState<SliderDisplayState | null>(null);
  const setDisplay = useCallback((next: SliderDisplayState | null) => {
    setDisplayState((prev) => (sliderDisplayEqual(prev, next) ? prev : next));
  }, []);

  const { isCompound, hasLabel, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel: label != null || (compound && hasCompoundChild(children, "Label")),
      hasHint: hint != null || (compound && hasCompoundChild(children, "Slider.Hint")),
      hasError: error != null || (compound && hasCompoundChild(children, "Slider.Error")),
    };
  }, [children, error, hint, label]);

  const fieldCtx = useMemo<SliderFieldContextValue>(
    () => ({
      sliderId,
      labelId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      labelConnected: hasLabel,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hasLabel, hintId, labelId, orientation, setDisplay, sliderId],
  );

  const fieldLabelCtx = useMemo(
    () => ({ labelId, required: false as const }),
    [labelId],
  );

  const trackProps = {
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
    orientation,
  } as SliderTrackProps;

  return {
    sliderId,
    isCompound,
    fieldCtx,
    fieldLabelCtx,
    trackProps,
    label,
    showValue,
    valueText,
    hint,
    error,
    hasHint,
    hasError,
    hintId,
    errorId,
  };
}
