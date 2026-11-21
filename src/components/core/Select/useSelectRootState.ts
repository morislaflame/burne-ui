import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
 
import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useSkinVariant } from "@/skins/skinContext";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { selectFieldIds } from "./selectA11y";
import {
  EMPTY_SELECT_OPTIONS,
  EMPTY_SELECT_VALUES,
  normalizeSelectValues,
  resolveSelectSingleValue,
  resolveSelectValues,
  selectOptionSections,
  selectOptionValues,
} from "./selectAPI";
import type {
  SelectContextValue,
  SelectFieldContextValue,
  UseSelectRootStateProps,
} from "./selectTypes";

function useSelectMultipleValues({
  multiple,
  valuesProp,
  defaultValues,
  onValuesChange,
  formBound,
  formValue,
  setFormValue,
  disabled,
  readOnly,
}: {
  multiple: boolean;
  valuesProp: string[] | undefined;
  defaultValues: string[] | undefined;
  onValuesChange: ((values: string[]) => void) | undefined;
  formBound: boolean;
  formValue: unknown;
  setFormValue: (next: unknown) => void;
  disabled: boolean;
  readOnly: boolean;
}) {
  const isValuesControlled = multiple && (valuesProp !== undefined || formBound);
  const [internalValues, setInternalValues] = useState<string[]>(() => defaultValues ?? EMPTY_SELECT_VALUES);
  const formValues = useMemo(
    () => (multiple && formBound ? normalizeSelectValues(formValue) : EMPTY_SELECT_VALUES),
    [formBound, formValue, multiple],
  );
  const values = resolveSelectValues({
    multiple,
    formBound,
    formValues,
    isValuesControlled,
    valuesProp,
    internalValues,
  });
  const setValues = useCallback(
    (next: string[]) => {
      if (!multiple || disabled || readOnly) return;
      if (!isValuesControlled) setInternalValues(next);
      onValuesChange?.(next);
      if (formBound) setFormValue(next);
    },
    [disabled, formBound, isValuesControlled, multiple, onValuesChange, readOnly, setFormValue],
  );
  const resetInternalValues = useCallback(() => {
    if (!isValuesControlled) {
      setInternalValues(defaultValues ?? EMPTY_SELECT_VALUES);
    }
  }, [defaultValues, isValuesControlled]);
  return { values, setValues, isValuesControlled, resetInternalValues };
}

export function useSelectRootState({
  children,
  label,
  hint,
  error,
  invalid,
  id: idProp,
  name,
  required = false,
  size = "base",
  items: optionsProp = EMPTY_SELECT_OPTIONS,
  clearable = false,
  portalContainer,
  icon,
  selectionMode = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant: variantProp,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  placeholder: placeholderProp,
  menuMaxHeight = "min(24rem, 70dvh)",
  virtualized = false,
  virtualItemSize,
}: UseSelectRootStateProps) {
  const multiple = selectionMode === "multiple";
  const formBinding = useFormFieldBinding({
    name,
    value: multiple ? valuesProp : valueProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const formBound = formBinding.bound;
  const disabled = Boolean(formBinding.disabled ?? disabledProp);
  const readOnly = Boolean(formBinding.readOnly ?? readOnlyProp);
  const selectValueLabel = useBurneLabel("selectValue");
  const placeholder = placeholderProp ?? selectValueLabel;
  const autoId = useId();
  const buttonGroupCtx = useOptionalButtonGroupSegment();
  const variant: InputVariant = useSkinVariant(
    variantProp ??
      (buttonGroupCtx?.variant != null
        ? fieldShellVariantFromButtonGroup(buttonGroupCtx.variant)
        : undefined),
  );
  const selectId = idProp ?? `select-${autoId}`;
  const { hintId, errorId, labelId, listId } = selectFieldIds(selectId);
 
  const { isCompound, hasLabel, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel:
        label != null ||
        (compound &&
          (hasCompoundChild(children, "SelectLabel") ||
            hasCompoundChild(children, "Label"))),
      hasHint:
        hint != null ||
        (compound &&
          (hasCompoundChild(children, "SelectHint") ||
            hasCompoundChild(children, "Select.Hint"))),
      hasError:
        error != null ||
        (compound &&
          (hasCompoundChild(children, "SelectError") ||
            hasCompoundChild(children, "Select.Error"))),
    };
  }, [children, error, hint, label]);
 
  const isControlled = valueProp !== undefined || formBound;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = resolveSelectSingleValue({
    multiple,
    formBound,
    formValue: formBinding.value,
    isControlled,
    valueProp,
    internalValue,
  });
 
  const setValue = useCallback(
    (next: string) => {
      if (multiple || disabled || readOnly) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next === "" ? null : next);
      if (formBound) formBinding.setValue(next);
    },
    [disabled, formBinding, formBound, isControlled, multiple, onValueChange, readOnly],
  );

  const { values, setValues, isValuesControlled, resetInternalValues } = useSelectMultipleValues({
    multiple,
    valuesProp,
    defaultValues,
    onValuesChange,
    formBound,
    formValue: formBinding.value,
    setFormValue: formBinding.setValue,
    disabled,
    readOnly,
  });
 
  const [rawOpen, setOpenState] = useControllableState({
    value: disabled || readOnly ? false : openProp,
    defaultValue: disabled || readOnly ? false : defaultOpen,
    onChange: onOpenChange,
  });
  const open = disabled || readOnly ? false : rawOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (next && (disabled || readOnly)) return;
      setOpenState(next);
    },
    [disabled, readOnly, setOpenState],
  );
  const [activeValue, setActiveValue] = useState<string | null>(null);
 
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLButtonElement | null>(null);

  useNativeFormReset(
    anchorRef,
    () => {
      if (!isControlled) setInternalValue(defaultValue ?? "");
      resetInternalValues();
    },
    multiple ? !isValuesControlled : !isControlled,
  );
 
  const optionSections = useMemo(() => selectOptionSections(optionsProp), [optionsProp]);
  const items = useMemo(
    () => optionSections.flatMap((section) => section.items),
    [optionSections],
  );
  const optionValues = useMemo(() => selectOptionValues(items), [items]);
 
  useEffect(() => {
    if (!open || !activeValue) return;
    document.getElementById(`${listId}-opt-${activeValue}`)?.scrollIntoView({ block: "nearest" });
  }, [activeValue, listId, open]);
 
  const formInvalid = formBinding["aria-invalid"] === true;
  const fieldCtx: SelectFieldContextValue = useMemo(
    () => ({
      selectId,
      hintId,
      errorId,
      labelId,
      labelConnected: hasLabel,
      hintConnected: hasHint,
      errorConnected: hasError,
      invalid,
      formInvalid,
      required,
      size,
      errorMessage: error,
    }),
    [formInvalid, selectId, error, errorId, hasError, hasHint, hasLabel, hintId, invalid, required, labelId, size],
  );
 
  const selectCtx: SelectContextValue = useMemo(
    () => ({
      ...fieldCtx,
      open,
      setOpen,
      multiple,
      value,
      setValue,
      values,
      setValues,
      listId,
      activeValue,
      setActiveValue,
      anchorRef,
      valueRef,
      variant,
      disabled,
      readOnly,
      placeholder,
      menuMaxHeight,
      virtualized,
      virtualItemSize,
      items,
      optionSections,
      clearable,
      portalContainer,
      icon,
      optionValues,
      formValueRef: formBound
        ? (formBinding.ref as (node: HTMLButtonElement | null) => void)
        : undefined,
      formOnBlur: formBound ? formBinding.onBlur : undefined,
    }),
    [
      activeValue,
      disabled,
      fieldCtx,
      readOnly,
      formBound,
      formBinding,
      listId,
      menuMaxHeight,
      virtualized,
      virtualItemSize,
      multiple,
      open,
      setOpen,
      icon,
      optionValues,
      items,
      optionSections,
      clearable,
      portalContainer,
      placeholder,
      setValue,
      setValues,
      value,
      values,
      variant,
    ],
  );
 
  const fieldLabelCtx = useMemo(
    () => ({ controlId: selectId, labelId, required }),
    [selectId, required, labelId],
  );
 
  return {
    isCompound,
    label,
    hint,
    error,
    children,
    fieldCtx,
    selectCtx,
    fieldLabelCtx,
    readOnly,
  };
}
 