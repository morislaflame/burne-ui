import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import { comboBoxFieldIds } from "./comboBoxA11y";
import { comboBoxFilteredValues, EMPTY_COMBOBOX_OPTIONS } from "./comboBoxAPI";
import type {
  ComboBoxContextValue,
  ComboBoxFieldContextValue,
  UseComboBoxRootStateProps,
} from "./comboBoxTypes";

export function useComboBoxRootState({
  children,
  label,
  hint,
  error,
  id: idProp,
  name,
  isRequired = false,
  status = "default",
  size = "base",
  options = EMPTY_COMBOBOX_OPTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  variant: variantProp,
  disabled: disabledProp = false,
  placeholder = "Select a value",
  menuMaxHeight = "min(24rem, 70vh)",
}: UseComboBoxRootStateProps) {
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
  const comboBoxId = idProp ?? `combobox-${autoId}`;
  const { hintId, errorId, labelId, listId } = comboBoxFieldIds(comboBoxId);

  const isCompound = hasCompoundChildren(children);
  const hasLabel = label != null || (isCompound && hasCompoundChild(children, "Label"));
  const hasHint =
    hint != null || (isCompound && hasCompoundChild(children, "ComboBoxHint"));
  const hasError =
    error != null || (isCompound && hasCompoundChild(children, "ComboBoxError"));

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

  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !activeValue) return;
    document.getElementById(`${listId}-opt-${activeValue}`)?.scrollIntoView({ block: "nearest" });
  }, [activeValue, listId, open]);

  const filteredValues = useMemo(
    () => comboBoxFilteredValues(options, filterQuery),
    [filterQuery, options],
  );

  const fieldCtx: ComboBoxFieldContextValue = useMemo(
    () => ({
      comboBoxId,
      hintId,
      errorId,
      labelId,
      labelConnected: hasLabel,
      hintConnected: hasHint,
      errorConnected: hasError,
      isRequired,
      status,
      size,
      errorMessage: error,
    }),
    [comboBoxId, error, errorId, hasError, hasHint, hasLabel, hintId, isRequired, labelId, size, status],
  );

  const comboCtx: ComboBoxContextValue = useMemo(
    () => ({
      ...fieldCtx,
      open,
      setOpen,
      value,
      setValue,
      filterQuery,
      setFilterQuery,
      listId,
      activeValue,
      setActiveValue,
      anchorRef,
      inputRef,
      variant,
      disabled,
      placeholder,
      menuMaxHeight,
      options,
      filteredValues,
      formInputRef: formBound ? (formBinding.ref as (node: HTMLInputElement | null) => void) : undefined,
      formOnBlur: formBound ? formBinding.onBlur : undefined,
    }),
    [
      activeValue,
      disabled,
      fieldCtx,
      filterQuery,
      filteredValues,
      formBound,
      formBinding,
      listId,
      menuMaxHeight,
      open,
      options,
      placeholder,
      setValue,
      value,
      variant,
    ],
  );

  const fieldLabelCtx = useMemo(
    () => ({ controlId: comboBoxId, labelId, isRequired }),
    [comboBoxId, isRequired, labelId],
  );

  return {
    isCompound,
    label,
    hint,
    error,
    children,
    fieldCtx,
    comboCtx,
    fieldLabelCtx,
  };
}
