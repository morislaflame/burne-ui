import { useCallback, useId, useMemo, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
 
import { resolveFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useFieldInvalid } from "@/components/core/Field/fieldContext";
import { sliderDisplayEqual, sliderDisplayFromProps } from "./sliderAPI";
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
  name,
  orientation = "horizontal",
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
  readOnly = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  variant,
}: UseSliderRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value,
    disabled,
    readOnly,
  });
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const resolvedDisabled = Boolean(formBinding.disabled);
  const boundValue =
    formBinding.bound && formBinding.value !== "" && formBinding.value != null
      ? (formBinding.value as number | [number, number])
      : undefined;
  const autoId = useId();
  const sliderId = idProp ?? `slider-${autoId}`;
  const hintId = fieldHintId(sliderId);
  const errorId = fieldErrorId(sliderId);
  const labelId = sliderLabelId(sliderId);
 
  const propDisplay = useMemo(
    () =>
      sliderDisplayFromProps({
        range: range === true,
        value: (boundValue ?? value) as number | [number, number] | undefined,
        defaultValue: defaultValue as number | [number, number] | undefined,
        min,
        max,
        formatValue,
      }),
    [boundValue, defaultValue, formatValue, max, min, range, value],
  );
  const [trackDisplay, setDisplayState] = useState<SliderDisplayState | null>(null);
  const display = trackDisplay ?? propDisplay;
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
 
  const inheritedInvalid = useFieldInvalid();
  const isInvalid = resolveFieldInvalid({
    invalid,
    error: hasError ? true : undefined,
    inheritedInvalid,
  });
  const fieldCtx = useMemo<SliderFieldContextValue>(
    () => ({
      sliderId,
      labelId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      isInvalid,
      labelConnected: hasLabel,
      orientation,
      display,
      setDisplay,
    }),
    [display, errorId, hasError, hasHint, hasLabel, hintId, isInvalid, labelId, orientation, setDisplay, sliderId],
  );
 
  const fieldLabelCtx = useMemo(
    () => ({ labelId, required: false as const }),
    [labelId],
  );
 
  const trackProps = {
    range,
    value: boundValue ?? value,
    defaultValue,
    onValueChange: ((next: number | [number, number]) => {
      if (resolvedReadOnly) return;
      onValueChange?.(next as never);
      if (formBinding.bound) formBinding.setValue(next);
    }) as UseSliderRootStateProps["onValueChange"],
    onValueCommit: ((next: number | [number, number]) => {
      if (resolvedReadOnly) return;
      onValueCommit?.(next as never);
    }) as UseSliderRootStateProps["onValueCommit"],
    min,
    max,
    step,
    marks,
    size,
    thickness,
    formatValue,
    icon,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    variant,
    orientation,
  } as SliderTrackProps;
 
  return {
    sliderId,
    isCompound,
    fieldCtx,
    fieldLabelCtx,
    trackProps,
    readOnly: resolvedReadOnly,
    name: formBinding.name ?? name,
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
 