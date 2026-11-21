import { useSkinVariant } from "@/skins/skinContext";
import { useOptionalCheckboxGroupContext } from "@/components/composite/CheckboxGroup/checkboxGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormControlProps } from "@/components/composite/Form/useFormControlProps";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { useCallback, useId, useMemo, useRef, type ChangeEvent, type ReactNode } from "react";
 
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { checkboxErrorId, checkboxHintId, checkboxInputId, checkboxLabelId } from "./checkboxA11y";
import { compoundHasLabel, compoundUsesInlineMotion } from "./checkboxAPI";
import { CHECKBOX_SIZE_LAYOUT } from "./checkboxStyles";
import type { CheckboxFieldContextValue, UseCheckboxRootStateProps } from "./checkboxTypes";
 
export function useCheckboxRootState(
  {
    size = "base",
    labelPosition = "end",
    variant: variantProp,
    icon,
    disabled: disabledProp,
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
    readOnly: readOnlyProp,
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
    disabled: disabledProp,
    readOnly: readOnlyProp,
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
 
  const isStandaloneUncontrolled =
    !isExplicitlyControlled && !inSingleGroup && !inMultipleGroup && !formBound;
  const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
    value: resolvedChecked,
    defaultValue: Boolean(isStandaloneUncontrolled ? defaultChecked : undefined),
  });
 
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  useNativeFormReset(
    inputElementRef,
    () => {
      setMergedChecked(Boolean(defaultChecked));
      if (inputElementRef.current) {
        inputElementRef.current.indeterminate = Boolean(indeterminate);
      }
    },
    isStandaloneUncontrolled,
  );
 
  const isDisabled = Boolean(disabledProp ?? group?.disabled ?? formBinding.disabled);
  const isReadOnly = Boolean(readOnlyProp ?? group?.readOnly ?? formBinding.readOnly);
  const { isCompound, hasCompoundLabel, hasCompoundHint, hasCompoundError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasCompoundLabel: compound && compoundHasLabel(children),
      hasCompoundHint: compound
        ? hasCompoundChild(children, "CheckboxHint", "Checkbox.Hint")
        : false,
      hasCompoundError: compound
        ? hasCompoundChild(children, "CheckboxError", "Checkbox.Error")
        : false,
    };
  }, [children]);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = CHECKBOX_SIZE_LAYOUT[size];
  const hasHint = hint != null;
  const hasError = error != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: isCompound ? hasCompoundError : hasError,
    formInvalid: Boolean(formBound && formBinding.error),
  });
  const isDanger = isInvalid;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);
 
  const textColRef = useRef<HTMLElement>(null);
 
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isReadOnly) {
        e.preventDefault();
        return;
      }
      const next = e.target.checked;
      if (isStandaloneUncontrolled) setMergedChecked(next);
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
      isReadOnly,
      inMultipleGroup,
      inSingleGroup,
      isStandaloneUncontrolled,
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
      isReadOnly,
      isInvalid,
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
        defaultChecked: isStandaloneUncontrolled ? defaultChecked : undefined,
        required: inputRequired,
        form,
        autoFocus,
        tabIndex,
        readOnly: isReadOnly,
        onBlur: handleBlur,
        onFocus,
        inputRef: mergeRefs(inputElementRef, formBound ? formBinding.ref : undefined, inputRef),
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
      isReadOnly,
      isStandaloneUncontrolled,
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
    isReadOnly,
    isInvalid,
    isRequired: Boolean(inputRequired),
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
 