import { useSkinVariant } from "@/skins/skinContext";
import { useOptionalRadioGroupContext } from "@/components/composite/RadioGroup/radioGroupContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useCallback, useId, useMemo, useRef, type ChangeEvent, type FocusEvent, type MouseEvent, type ReactNode } from "react";
 
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { radioErrorId, radioHintId, radioInputId } from "./radioA11y";
import { compoundUsesInlineMotion } from "./radioAPI";
import { RADIO_SIZE_LAYOUT } from "./radioStyles";
import type { RadioFieldContextValue, UseRadioRootStateProps } from "./radioTypes";
 
export function useRadioRootState(
  {
    size = "base",
    labelPosition = "end",
    variant: variantProp,
    disabled: disabledProp,
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
    readOnly: readOnlyProp,
    onBlur,
    onFocus,
    inputRef,
    label,
    hint,
    error,
    invalid,
  }: UseRadioRootStateProps,
  children: ReactNode | undefined,
  className?: string,
  onClick?: (e: MouseEvent<HTMLInputElement>) => void,
) {
  const variant = useSkinVariant(variantProp);
  const group = useOptionalRadioGroupContext();
  const optionValueStr = value !== undefined && value !== null ? String(value) : undefined;
  const inGroup = group != null && optionValueStr != null;
  const formBinding = useFormFieldBinding({
    name: inGroup ? undefined : typeof name === "string" ? name : undefined,
    value: checked,
    disabled: disabledProp,
    readOnly: readOnlyProp ?? group?.readOnly,
  });
  const formBound = !inGroup && formBinding.bound;
  const isDisabled = Boolean(disabledProp ?? group?.disabled ?? formBinding.disabled);
  const isReadOnly = Boolean(readOnlyProp ?? group?.readOnly ?? formBinding.readOnly);
 
  const autoId = useId();
  const inputId = radioInputId(idProp, autoId);
  const hintId = radioHintId(inputId);
  const errorId = radioErrorId(inputId);
 
  const isExplicitlyControlled = checked !== undefined;
  const groupChecked = inGroup ? group.selectedValue === optionValueStr : undefined;
  const formChecked = formBound
    ? optionValueStr !== undefined
      ? String(formBinding.value ?? "") === optionValueStr
      : typeof formBinding.value === "boolean"
        ? formBinding.value
        : formBinding.value === "on"
    : undefined;
  const resolvedChecked = isExplicitlyControlled
    ? checked
    : groupChecked !== undefined
      ? groupChecked
      : formChecked;
 
  const isStandaloneUncontrolled = !isExplicitlyControlled && !inGroup && !formBound;
  const [mergedChecked, setMergedChecked, isControlled] = useControllableState({
    value: resolvedChecked,
    defaultValue: Boolean(isStandaloneUncontrolled ? defaultChecked : undefined),
  });
 
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  useNativeFormReset(
    inputElementRef,
    () => {
      setMergedChecked(Boolean(defaultChecked));
    },
    isStandaloneUncontrolled,
  );
 
  const inputName = name ?? group?.name ?? formBinding.name;
  const { isCompound, hasCompoundLabel, hasCompoundHint, hasCompoundError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasCompoundLabel: compound
        ? hasCompoundChild(children, "RadioLabel", "Radio.Label", "Label")
        : false,
      hasCompoundHint: compound
        ? hasCompoundChild(children, "RadioHint", "Radio.Hint")
        : false,
      hasCompoundError: compound
        ? hasCompoundChild(children, "RadioError", "Radio.Error")
        : false,
    };
  }, [children]);
  const hasLabel = isCompound ? hasCompoundLabel : Boolean(label);
  const useInlineCompoundMotion = isCompound && compoundUsesInlineMotion(className);
  const enableTextMotion = !isDisabled && (!isCompound || useInlineCompoundMotion);
  const sz = RADIO_SIZE_LAYOUT[size];
  const resolvedError =
    error ?? (!hasCompoundError && formBound ? formBinding.error : undefined);
  const hasHint = hint != null;
  const hasError = resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: isCompound ? hasCompoundError : hasError,
    formInvalid: Boolean(formBound && formBinding.error),
  });
  const showDanger = isInvalid;
  const secondaryLines = isCompound
    ? (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0)
    : (hasHint ? 1 : 0) + (hasError ? 1 : 0);
 
  const textColRef = useRef<HTMLElement>(null);
 
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isReadOnly || isDisabled) {
        e.preventDefault();
        return;
      }
      if (isStandaloneUncontrolled) setMergedChecked(e.target.checked);
      onChange?.(e);
      if (e.defaultPrevented) return;
      if (inGroup && e.target.checked && optionValueStr != null) {
        group.selectValue(optionValueStr);
        return;
      }
      if (formBound && e.target.checked) {
        formBinding.setValue(optionValueStr !== undefined ? optionValueStr : true);
      }
    },
    [
      formBinding,
      formBound,
      group,
      inGroup,
      isDisabled,
      isReadOnly,
      isStandaloneUncontrolled,
      onChange,
      optionValueStr,
      setMergedChecked,
    ],
  );
 
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (formBound) formBinding.onBlur();
    },
    [formBinding, formBound, onBlur],
  );
 
  const canClearSelection =
    !isDisabled && !isReadOnly && !required && !(inGroup && group.required);
 
  const inputRequired =
    required ?? (inGroup && group.isOptionRequired(optionValueStr, isDisabled) ? true : undefined);
 
  const handleClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !canClearSelection || !mergedChecked) return;
 
      e.preventDefault();
 
      if (inGroup) {
        group.selectValue(undefined);
        return;
      }
 
      if (formBound) {
        formBinding.setValue(optionValueStr !== undefined ? "" : false);
        return;
      }
 
      if (!isExplicitlyControlled) {
        setMergedChecked(false);
      }
    },
    [
      canClearSelection,
      formBinding,
      formBound,
      group,
      inGroup,
      isExplicitlyControlled,
      mergedChecked,
      onClick,
      optionValueStr,
      setMergedChecked,
    ],
  );
 
  const contextValue: RadioFieldContextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      size,
      labelPosition,
      variant,
      mergedChecked,
      isDisabled,
      isReadOnly,
      isControlled,
      isCompound,
      hasCompoundHint,
      hasCompoundError,
      hintConnected: isCompound ? hasCompoundHint : hasHint,
      errorConnected: isCompound ? hasCompoundError : hasError,
      isInvalid,
      hasLabel,
      useInlineCompoundMotion,
      textMotionRef: textColRef,
      danger: showDanger,
      inputName,
      onChange: handleChange,
      onActivate: handleClick,
      inputProps: {
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
      },
    }),
    [
      showDanger,
      isInvalid,
      defaultChecked,
      form,
      formBinding.ref,
      formBound,
      autoFocus,
      errorId,
      handleBlur,
      handleChange,
      handleClick,
      hasCompoundError,
      hasCompoundHint,
      hasError,
      hasHint,
      hasLabel,
      hintId,
      inputId,
      inputName,
      isCompound,
      useInlineCompoundMotion,
      isControlled,
      isDisabled,
      isReadOnly,
      isStandaloneUncontrolled,
      mergedChecked,
      onFocus,
      inputRef,
      inputRequired,
      labelPosition,
      size,
      tabIndex,
      value,
      variant,
    ],
  );
 
  return {
    contextValue,
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
    error: resolvedError,
    hintId,
    errorId,
    danger: showDanger,
  };
}
 