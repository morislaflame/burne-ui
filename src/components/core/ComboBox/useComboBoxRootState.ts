import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
 
import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import type { InputVariant } from "@/components/core/Input";
import { fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useSkinVariant } from "@/skins/skinContext";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
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
  size = "base",
  items = EMPTY_COMBOBOX_OPTIONS,
  filter,
  allowsCustomValue = false,
  loading = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant: variantProp,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  placeholder: placeholderProp,
  inputValue,
  defaultInputValue,
  onInputValueChange,
  menuMaxHeight = "min(24rem, 70dvh)",
  portalContainer,
  virtualized = false,
  virtualItemSize,
}: UseComboBoxRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: valueProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const formBound = formBinding.bound;
  const disabled = formBinding.disabled ?? disabledProp;
  const readOnly = Boolean(formBinding.readOnly);
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
      if (readOnly) return;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next === "" ? null : next);
      if (formBound) formBinding.setValue(next);
    },
    [formBound, formBinding, isControlled, onValueChange, readOnly],
  );
 
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const setOpen = useCallback(
    (next: boolean) => {
      if (readOnly) return;
      setOpenState(next);
    },
    [readOnly, setOpenState],
  );
  const [filterQuery, setFilterQuery] = useControllableState({
    value: inputValue,
    defaultValue: defaultInputValue ?? "",
    onChange: onInputValueChange,
  });
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const blurGeneration = useRef(0);
  const cancelBlurCommit = useCallback(() => {
    blurGeneration.current += 1;
  }, []);
 
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
 
  useEffect(() => {
    if (!open || !activeValue) return;
    document.getElementById(`${listId}-opt-${activeValue}`)?.scrollIntoView({ block: "nearest" });
  }, [activeValue, listId, open]);
 
  const filteredValues = useMemo(
    () => comboBoxFilteredValues(items, filterQuery, filter),
    [filter, filterQuery, items],
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
      size,
      errorMessage: error,
    }),
    [comboBoxId, error, errorId, formInvalid, hasError, hasHint, hasLabel, hintId, invalid, required, labelId, size],
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
      readOnly,
      placeholder,
      menuMaxHeight,
      portalContainer,
      virtualized,
      virtualItemSize,
      items,
      filteredValues,
      allowsCustomValue,
      loading,
      filter,
      blurGeneration,
      cancelBlurCommit,
      formInputRef: formBound ? (formBinding.ref as (node: HTMLInputElement | null) => void) : undefined,
      formOnBlur: formBound ? formBinding.onBlur : undefined,
    }),
    [
      activeValue,
      disabled,
      fieldCtx,
      readOnly,
      filterQuery,
      filteredValues,
      allowsCustomValue,
      blurGeneration,
      cancelBlurCommit,
      filter,
      loading,
      formBound,
      formBinding,
      listId,
      menuMaxHeight,
      portalContainer,
      virtualized,
      virtualItemSize,
      open,
      setOpen,
      items,
      placeholder,
      setFilterQuery,
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
    readOnly,
  };
}
 