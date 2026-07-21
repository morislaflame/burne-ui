import { useOptionalCheckboxGroupContext } from "@/components/composite/CheckboxGroup/checkboxGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { useCallback, useId, useMemo, useRef, type ChangeEvent, type ReactNode } from "react";

import { checkboxErrorId, checkboxHintId, checkboxInputId, checkboxLabelId } from "./checkboxA11y";
import { compoundUsesInlineMotion } from "./checkboxAPI";
import { CHECKBOX_SIZE_LAYOUT } from "./checkboxStyles";
import type { CheckboxFieldContextValue, UseCheckboxRootStateProps } from "./checkboxTypes";

export function useCheckboxRootState(
  {
    size = "base",
    variant = "default",
    status = "default",
    icon,
    disabled,
    checked,
    defaultChecked,
    onChange,
    id: idProp,
    name,
    value,
    required,
    form,
    autoFocus,
    tabIndex,
    readOnly,
    onBlur,
    onFocus,
    "aria-label": ariaLabelProp,
    label,
    hint,
    error,
  }: UseCheckboxRootStateProps,
  children: ReactNode | undefined,
  className?: string,
) {
  const group = useOptionalCheckboxGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inSingleGroup =
    group?.selection === "single" && group != null && optionValueStr != null;

  const formBinding = useFormControlProps({
    name,
    value: checked,
    onChange: onChange as ((event: unknown) => void) | undefined,
    onBlur: onBlur as ((event: unknown) => void) | undefined,
    disabled,
    readOnly,
    type: "checkbox",
  });
  const formBound = formBinding.bound && group == null;

  const autoId = useId();
  const inputId = checkboxInputId(idProp, autoId);
  const hintId = checkboxHintId(inputId);
  const errorId = checkboxErrorId(inputId);
  const labelId = checkboxLabelId(inputId);

  const isExplicitlyControlled = checked !== undefined;
  const groupChecked = inSingleGroup ? group.selectedValue === optionValueStr : undefined;
  const formChecked = formBound ? Boolean(formBinding.checked) : undefined;
  const resolvedChecked = isExplicitlyControlled
    ? checked
    : formChecked !== undefined
      ? formChecked
      : groupChecked !== undefined
        ? groupChecked
        : undefined;

  const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
    value: resolvedChecked,
    defaultValue: Boolean(
      inSingleGroup || isExplicitlyControlled || formBound ? undefined : defaultChecked,
    ),
  });

  const isDisabled = Boolean(disabled ?? group?.disabled ?? formBinding.disabled);
  const isCompound = hasCompoundChildren(children);
  const hasCompoundLabel = isCompound && hasCompoundChild(children, "Label");
  const hasCompoundHint = isCompound ? hasCompoundChild(children, "CheckboxHint") : false;
  const hasCompoundError = isCompound ? hasCompoundChild(children, "CheckboxError") : false;
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = CHECKBOX_SIZE_LAYOUT[size];
  const isDanger = status === "danger";
  const hasHint = hint != null;
  const hasError = error != null;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);

  const textColRef = useRef<HTMLElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled && !inSingleGroup && !formBound) setMergedChecked(next);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inSingleGroup) {
        group.selectSingleValue(optionValueStr, next);
        return;
      }
      if (formBound) formBinding.onChange(e);
    },
    [formBound, formBinding, group, inSingleGroup, isControlled, onChange, optionValueStr, setMergedChecked],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (formBound) formBinding.onBlur(e);
    },
    [formBound, formBinding, onBlur],
  );

  const inputRequired =
    required ??
    (inSingleGroup && group.required ? group.claimRequiredAnchor() : undefined);

  const contextValue: CheckboxFieldContextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      labelId,
      size,
      variant,
      mergedChecked,
      isDisabled,
      isControlled,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      labelConnected: hasCompoundLabel,
      accessibleName: ariaLabelProp,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      status,
      icon,
      onChange: handleChange,
      inputProps: {
        name: formBinding.name ?? name,
        value,
        defaultChecked: !isControlled && !formBound ? defaultChecked : undefined,
        required: inputRequired,
        form,
        autoFocus,
        tabIndex,
        readOnly: formBinding.readOnly ?? readOnly,
        onBlur: handleBlur,
        onFocus,
        inputRef: formBound ? formBinding.ref : undefined,
        ariaInvalid: formBound ? formBinding["aria-invalid"] : undefined,
      },
    }),
    [
      ariaLabelProp,
      icon,
      status,
      defaultChecked,
      form,
      formBinding,
      formBound,
      autoFocus,
      errorId,
      handleBlur,
      handleChange,
      hintId,
      hasCompoundError,
      hasCompoundHint,
      hasCompoundLabel,
      hasError,
      hasHint,
      inputId,
      isCompound,
      isControlled,
      isDisabled,
      labelId,
      mergedChecked,
      name,
      onFocus,
      inputRequired,
      readOnly,
      size,
      tabIndex,
      useInlineCompoundMotion,
      value,
      variant,
    ],
  );

  const fieldLabelContext = useMemo(
    () => ({
      controlId: inputId,
      labelId,
      required: Boolean(required),
    }),
    [inputId, labelId, required],
  );

  return {
    contextValue,
    fieldLabelContext,
    isCompound,
    isDisabled,
    mergedChecked,
    enableTextMotion,
    textColRef,
    secondaryLines,
    sz,
    hasHint,
    hasError,
    label,
    hint,
    error,
    hintId,
    errorId,
    status,
    isDanger,
  };
}
