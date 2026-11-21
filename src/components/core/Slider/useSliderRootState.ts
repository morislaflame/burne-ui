import { useCallback, useId, useMemo, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
 
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
  disabled: disabledProp,
  readOnly: readOnlyProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  variant,
}: UseSliderRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value,
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const formBound = formBinding.bound;
  const resolvedReadOnly = Boolean(readOnlyProp ?? formBinding.readOnly);
  const resolvedDisabled = Boolean(disabledProp ?? formBinding.disabled);
  const boundValue =
    formBound && formBinding.value !== "" && formBinding.value != null
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
 
  const { isCompound, hasLabel, hasCompoundHint, hasCompoundError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel:
        label != null ||
        (compound && hasCompoundChild(children, "SliderLabel", "Slider.Label", "Label")),
      hasCompoundHint:
        compound && hasCompoundChild(children, "Slider.Hint", "SliderHint"),
      hasCompoundError:
        compound && hasCompoundChild(children, "Slider.Error", "SliderError"),
    };
  }, [children, label]);
 
  const resolvedError =
    error ?? (!hasCompoundError && formBound ? formBinding.error : undefined);
  const hasHint = hint != null || hasCompoundHint;
  const hasError = resolvedError != null || hasCompoundError;
 
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: hasError,
    formInvalid: Boolean(formBound && formBinding.error),
  });
 
  const handleRootValueChange = useCallback(
    (next: number | [number, number]) => {
      if (resolvedReadOnly || resolvedDisabled) return;
      onValueChange?.(next as never);
      if (formBound) formBinding.setValue(next);
    },
    [formBinding, formBound, onValueChange, resolvedDisabled, resolvedReadOnly],
  );
 
  const handleRootValueCommit = useCallback(
    (next: number | [number, number]) => {
      if (resolvedReadOnly || resolvedDisabled) return;
      onValueCommit?.(next as never);
    },
    [onValueCommit, resolvedDisabled, resolvedReadOnly],
  );
 
  const trackProps = useMemo(
    () =>
      ({
        range,
        value: boundValue ?? value,
        defaultValue,
        onValueChange: handleRootValueChange as UseSliderRootStateProps["onValueChange"],
        onValueCommit: handleRootValueCommit as UseSliderRootStateProps["onValueCommit"],
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
      }) as SliderTrackProps,
    [
      ariaLabel,
      ariaLabelledBy,
      boundValue,
      defaultValue,
      formatValue,
      handleRootValueChange,
      handleRootValueCommit,
      icon,
      marks,
      max,
      min,
      orientation,
      range,
      resolvedDisabled,
      resolvedReadOnly,
      size,
      step,
      thickness,
      value,
      variant,
    ],
  );
 
  const registerControlRef = formBound ? formBinding.ref : undefined;
  const onControlBlur = formBound ? formBinding.onBlur : undefined;
 
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
      trackProps,
      registerControlRef,
      onControlBlur,
    }),
    [
      display,
      errorId,
      hasError,
      hasHint,
      hasLabel,
      hintId,
      isInvalid,
      labelId,
      onControlBlur,
      orientation,
      registerControlRef,
      setDisplay,
      sliderId,
      trackProps,
    ],
  );
 
  const fieldLabelCtx = useMemo(
    () => ({ labelId, required: false as const }),
    [labelId],
  );
 
  return {
    sliderId,
    isCompound,
    fieldCtx,
    fieldLabelCtx,
    trackProps,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    name: formBinding.name ?? name,
    label,
    showValue,
    valueText,
    hint,
    error: resolvedError,
    hasHint,
    hasError,
    hintId,
    errorId,
  };
}
 