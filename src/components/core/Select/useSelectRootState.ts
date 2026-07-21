import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { selectFieldIds } from "./selectA11y";
import { EMPTY_SELECT_OPTIONS, selectOptionValues } from "./selectAPI";
import type {
  SelectContextValue,
  SelectFieldContextValue,
  UseSelectRootStateProps,
} from "./selectTypes";

export function useSelectRootState({
  children,
  label,
  hint,
  error,
  id: idProp,
  name,
  required = false,
  status = "default",
  size = "base",
  options = EMPTY_SELECT_OPTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant: variantProp,
  disabled: disabledProp = false,
  placeholder = "Select a value",
  menuMaxHeight = "min(24rem, 70vh)",
}: UseSelectRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: valueProp,
    disabled: disabledProp,
  });
  const formBound = formBinding.bound;
  const disabled = formBinding.disabled ?? disabledProp;
  const autoId = useId();
  const buttonGroupCtx = useOptionalButtonGroupSegment();
  const variant: InputVariant =
    variantProp ??
    (buttonGroupCtx?.variant != null
      ? fieldShellVariantFromButtonGroup(buttonGroupCtx.variant)
      : "default");
  const selectId = idProp ?? `select-${autoId}`;
  const { hintId, errorId, labelId, listId } = selectFieldIds(selectId);

  const isCompound = hasCompoundChildren(children);
  const hasLabel = label != null || (isCompound && hasCompoundChild(children, "Label"));
  const hasHint =
    hint != null || (isCompound && hasCompoundChild(children, "SelectHint"));
  const hasError =
    error != null || (isCompound && hasCompoundChild(children, "SelectError"));

  const isControlled = valueProp !== undefined || formBound;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = formBound
    ? String(formBinding.value ?? "")
    : isControlled
      ? (valueProp ?? "")
      : internalValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
      if (formBound) formBinding.setValue(next);
    },
    [formBound, formBinding, isControlled, onValueChange],
  );

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

  const fieldCtx: SelectFieldContextValue = useMemo(
    () => ({
      selectId,
      hintId,
      errorId,
      labelId,
      labelConnected: hasLabel,
      hintConnected: hasHint,
      errorConnected: hasError,
      required,
      status,
      size,
      errorMessage: error,
    }),
    [selectId, error, errorId, hasError, hasHint, hasLabel, hintId, required, labelId, size, status],
  );

  const selectCtx: SelectContextValue = useMemo(
    () => ({
      ...fieldCtx,
      open,
      setOpen,
      value,
      setValue,
      listId,
      activeValue,
      setActiveValue,
      anchorRef,
      valueRef,
      variant,
      disabled,
      placeholder,
      menuMaxHeight,
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
      open,
      optionValues,
      options,
      placeholder,
      setValue,
      value,
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
