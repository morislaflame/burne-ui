import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
 
import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useSkinVariant } from "@/skins/skinContext";

import { selectFieldIds } from "./selectA11y";
import {
  EMPTY_SELECT_OPTIONS,
  EMPTY_SELECT_VALUES,
  normalizeSelectValues,
  resolveSelectSingleValue,
  resolveSelectValues,
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
}: {
  multiple: boolean;
  valuesProp: string[] | undefined;
  defaultValues: string[] | undefined;
  onValuesChange: ((values: string[]) => void) | undefined;
  formBound: boolean;
  formValue: unknown;
  setFormValue: (next: unknown) => void;
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
      if (!multiple) return;
      if (!isValuesControlled) setInternalValues(next);
      onValuesChange?.(next);
      if (formBound) setFormValue(next);
    },
    [formBound, isValuesControlled, multiple, onValuesChange, setFormValue],
  );
  return { values, setValues };
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
  status = "default",
  size = "base",
  options = EMPTY_SELECT_OPTIONS,
  multiple = false,
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
  placeholder = "Select a value",
  menuMaxHeight = "min(24rem, 70dvh)",
  virtualized = false,
  virtualItemSize,
}: UseSelectRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: multiple ? valuesProp : valueProp,
    disabled: disabledProp,
  });
  const formBound = formBinding.bound;
  const disabled = formBinding.disabled ?? disabledProp;
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
      hasLabel: label != null || (compound && hasCompoundChild(children, "Label")),
      hasHint: hint != null || (compound && hasCompoundChild(children, "SelectHint")),
      hasError: error != null || (compound && hasCompoundChild(children, "SelectError")),
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
      if (multiple) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
      if (formBound) formBinding.setValue(next);
    },
    [formBinding, formBound, isControlled, multiple, onValueChange],
  );

  const { values, setValues } = useSelectMultipleValues({
    multiple,
    valuesProp,
    defaultValues,
    onValuesChange,
    formBound,
    formValue: formBinding.value,
    setFormValue: formBinding.setValue,
  });
 
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [activeValue, setActiveValue] = useState<string | null>(null);
 
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLButtonElement | null>(null);
 
  const optionValues = useMemo(() => selectOptionValues(options), [options]);
 
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
      status,
      size,
      errorMessage: error,
    }),
    [formInvalid, selectId, error, errorId, hasError, hasHint, hasLabel, hintId, invalid, required, labelId, size, status],
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
      placeholder,
      menuMaxHeight,
      virtualized,
      virtualItemSize,
      options,
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
      formBound,
      formBinding,
      listId,
      menuMaxHeight,
      virtualized,
      virtualItemSize,
      multiple,
      open,
      setOpen,
      optionValues,
      options,
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
  };
}
 