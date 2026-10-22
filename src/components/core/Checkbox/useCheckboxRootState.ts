import { useSkinVariant } from "@/skins/skinContext";
import { useOptionalCheckboxGroupContext } from "@/components/composite/CheckboxGroup/checkboxGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { useCallback, useId, useMemo, useRef, type ChangeEvent, type ReactNode } from "react";
 
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { resolveFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useFieldInvalid } from "@/components/core/Field/fieldContext";
import { checkboxErrorId, checkboxHintId, checkboxInputId, checkboxLabelId } from "./checkboxA11y";
import { compoundUsesInlineMotion } from "./checkboxAPI";
import { CHECKBOX_SIZE_LAYOUT } from "./checkboxStyles";
import type { CheckboxFieldContextValue, UseCheckboxRootStateProps } from "./checkboxTypes";
 
export function useCheckboxRootState(
  {
    size = "base",
    labelPosition = "end",
    variant: variantProp,
    icon,
    disabled,
    checked,
    defaultChecked,
    indeterminate = false,
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
    inputRef,
    "aria-label": ariaLabelProp,
    label,
    hint,
    error,
    invalid,
  }: UseCheckboxRootStateProps,
  children: ReactNode | undefined,
  className?: string,
) {
  const variant = useSkinVariant(variantProp);
  const group = useOptionalCheckboxGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inSingleGroup =
    group?.selection === "single" && group != null && optionValueStr != null;
  const inMultipleGroup =
    group?.selection === "multiple" && group != null && optionValueStr != null;
 
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
  const groupChecked = inSingleGroup
    ? group.selectedValue === optionValueStr
    : inMultipleGroup
      ? group.selectedValues.includes(optionValueStr)
      : undefined;
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
      inSingleGroup || inMultipleGroup || isExplicitlyControlled || formBound
        ? undefined
        : defaultChecked,
    ),
  });
 
  const isDisabled = Boolean(disabled ?? group?.disabled ?? formBinding.disabled);
  const { isCompound, hasCompoundLabel, hasCompoundHint, hasCompoundError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasCompoundLabel: compound && hasCompoundChild(children, "Label"),
      hasCompoundHint: compound ? hasCompoundChild(children, "CheckboxHint") : false,
      hasCompoundError: compound ? hasCompoundChild(children, "CheckboxError") : false,
    };
  }, [children]);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = CHECKBOX_SIZE_LAYOUT[size];
  const hasHint = hint != null;
  const hasError = error != null;
  const inheritedInvalid = useFieldInvalid();
  const isInvalid = resolveFieldInvalid({
    invalid,
    error: (isCompound ? hasCompoundError : hasError) ? true : undefined,
    formInvalid: formBound && formBinding["aria-invalid"] === true,
    inheritedInvalid,
  });
  const isDanger = isInvalid;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);
 
  const textColRef = useRef<HTMLElement>(null);
 
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (formBinding.readOnly || readOnly || group?.readOnly) {
        e.preventDefault();
        return;
      }
      const next = e.target.checked;
      if (!isControlled && !inSingleGroup && !inMultipleGroup && !formBound) setMergedChecked(next);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inSingleGroup) {
        group.selectSingleValue(optionValueStr, next);
        return;
      }
      if (inMultipleGroup) {
        group.toggleMultipleValue(optionValueStr, next);
        return;
      }
      if (formBound) formBinding.onChange(e);
    },
    [
      formBound,
      formBinding,
      group,
      readOnly,
      inMultipleGroup,
      inSingleGroup,
      isControlled,
      onChange,
      optionValueStr,
      setMergedChecked,
    ],
  );
 
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (formBound) formBinding.onBlur(e);
    },
    [formBound, formBinding, onBlur],
  );
 
  const inputRequired = required;
 
  const contextValue: CheckboxFieldContextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      labelId,
      size,
      labelPosition,
      variant,
      mergedChecked,
      indeterminate,
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
      isDanger,
      icon,
      onChange: handleChange,
      inputProps: {
        name: formBinding.name ?? name,
        value,
        defaultChecked:
          !isControlled && !formBound && !inSingleGroup && !inMultipleGroup ? defaultChecked : undefined,
        required: inputRequired,
        form,
        autoFocus,
        tabIndex,
        readOnly: formBinding.readOnly ?? readOnly,
        onBlur: handleBlur,
        onFocus,
        inputRef: mergeRefs(formBound ? formBinding.ref : undefined, inputRef),
        ariaInvalid: isInvalid || undefined,
      },
    }),
    [
      ariaLabelProp,
      icon,
      defaultChecked,
      form,
      formBinding,
      formBound,
      inputRef,
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
      isDanger,
      isInvalid,
      inMultipleGroup,
      inSingleGroup,
      inputId,
      isCompound,
      isControlled,
      isDisabled,
      labelId,
      indeterminate,
      mergedChecked,
      name,
      onFocus,
      inputRequired,
      readOnly,
      labelPosition,
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
    isDanger,
  };
}
 