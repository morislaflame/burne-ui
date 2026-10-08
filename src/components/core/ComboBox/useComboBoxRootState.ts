import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
 
import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useSkinVariant } from "@/skins/skinContext";
 
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
  invalid,
  id: idProp,
  name,
  required = false,
  status = "default",
  size = "base",
  options = EMPTY_COMBOBOX_OPTIONS,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant: variantProp,
  disabled: disabledProp = false,
  placeholder = "Select a value",
  menuMaxHeight = "min(24rem, 70dvh)",
  virtualized = false,
  virtualItemSize,
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
  const variant: InputVariant = useSkinVariant(
    variantProp ??
      (buttonGroupCtx?.variant != null
        ? fieldShellVariantFromButtonGroup(buttonGroupCtx.variant)
        : undefined),
  );
  const comboBoxId = idProp ?? `combobox-${autoId}`;
  const { hintId, errorId, labelId, listId } = comboBoxFieldIds(comboBoxId);
 
  const { isCompound, hasLabel, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel: label != null || (compound && hasCompoundChild(children, "Label")),
      hasHint: hint != null || (compound && hasCompoundChild(children, "ComboBoxHint")),
      hasError: error != null || (compound && hasCompoundChild(children, "ComboBoxError")),
    };
  }, [children, error, hint, label]);
 
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
 
  const formInvalid = formBinding["aria-invalid"] === true;
  const fieldCtx: ComboBoxFieldContextValue = useMemo(
    () => ({
      comboBoxId,
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
    [comboBoxId, error, errorId, formInvalid, hasError, hasHint, hasLabel, hintId, invalid, required, labelId, size, status],
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
      virtualized,
      virtualItemSize,
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
      virtualized,
      virtualItemSize,
      open,
      setOpen,
      options,
      placeholder,
      setValue,
      value,
      variant,
    ],
  );
 
  const fieldLabelCtx = useMemo(
    () => ({ controlId: comboBoxId, labelId, required }),
    [comboBoxId, required, labelId],
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
 