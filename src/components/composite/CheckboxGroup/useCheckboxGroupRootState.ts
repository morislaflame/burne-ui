import { useCallback, useMemo, useRef, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
 
import { checkboxGroupNextValues, checkboxGroupValuesEqual } from "./checkboxGroupAPI";
import type {
  CheckboxGroupContextValue,
  UseCheckboxGroupRootStateProps,
} from "./checkboxGroupTypes";
 
const EMPTY_VALUES: readonly string[] = [];
 
export function useCheckboxGroupRootState({
  required = false,
  selectionMode: selection = "multiple",
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  disabled: disabledProp,
  readOnly: readOnlyProp,
  name,
  error,
  children,
  onBlur: onBlurProp,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseCheckboxGroupRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: selection === "multiple" ? valuesProp : valueProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
  });
  const resolvedDisabled = Boolean(disabledProp ?? formBinding.disabled);
  const resolvedReadOnly = Boolean(readOnlyProp ?? formBinding.readOnly);
  const formBound = formBinding.bound;
  const formInvalid = Boolean(formBound && formBinding.error);
  const hasCompoundError = useMemo(
    () => hasCompoundChild(children, "CheckboxGroup.Error", "CheckboxGroupError"),
    [children],
  );
  const resolvedError =
    error ?? (!hasCompoundError && formBound ? formBinding.error : undefined);

  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);
  const multiple = selection === "multiple";
  const valuesControlled = multiple && valuesProp !== undefined;
  const singleControlled = !multiple && valueProp !== undefined;
 
  const formSingle =
    formBound && selection === "single" && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : null;
  const [internalSingle, setInternalSingle] = useState<string | null>(() => defaultValue ?? null);
  const singleSelectedValue =
    selection === "single"
      ? formBound
        ? formSingle
        : singleControlled
          ? (valueProp ?? null)
          : internalSingle
      : null;
 
  const [internalValues, setInternalValues] = useState<string[]>(() =>
    defaultValues ? [...defaultValues] : [],
  );
  const formValues =
    formBound && multiple && Array.isArray(formBinding.value) ? formBinding.value.map(String) : EMPTY_VALUES;
  const selectedValues = !multiple
    ? EMPTY_VALUES
    : formBound
      ? formValues
      : valuesControlled
        ? (valuesProp ?? EMPTY_VALUES)
        : internalValues;
 
  const selectedValue = selection === "single" ? singleSelectedValue : null;
 
  const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
  const bindFieldsetRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      fieldsetRef.current = node;
      if (formBound) {
        const firstInput = node?.querySelector<HTMLElement>('input[type="checkbox"]:not(:disabled)');
        formBinding.ref(firstInput ?? node);
      }
    },
    [formBinding, formBound],
  );
 
  useNativeFormReset(
    fieldsetRef,
    () => {
      if (multiple) {
        if (!valuesControlled) setInternalValues(defaultValues ? [...defaultValues] : []);
      } else if (!singleControlled) {
        setInternalSingle(defaultValue ?? null);
      }
    },
    !formBound && (multiple ? !valuesControlled : !singleControlled),
  );
 
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLFieldSetElement>) => {
      onBlurProp?.(event);
      if (formBound && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
        formBinding.onBlur();
      }
    },
    [formBinding, formBound, onBlurProp],
  );
 
  const selectSingleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (selection !== "single" || resolvedReadOnly || resolvedDisabled) return;
      const next = checked ? optionValue : null;
      if (!singleControlled && !formBound) setInternalSingle(next);
      onValueChange?.(next);
      if (formBound) formBinding.setValue(next ?? "");
    },
    [formBinding, formBound, onValueChange, resolvedDisabled, resolvedReadOnly, selection, singleControlled],
  );
 
  const toggleMultipleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (!multiple || resolvedReadOnly || resolvedDisabled) return;
      const current = formBound ? formValues : valuesControlled ? (valuesProp ?? EMPTY_VALUES) : internalValues;
      const next = checkboxGroupNextValues(current, optionValue, checked);
      if (checkboxGroupValuesEqual(current, next)) return;
      if (!valuesControlled && !formBound) setInternalValues(next);
      onValuesChange?.(next);
      if (formBound) formBinding.setValue(next);
    },
    [formBinding, formBound, formValues, internalValues, multiple, onValuesChange, resolvedDisabled, resolvedReadOnly, valuesControlled, valuesProp],
  );
 
  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      selection,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      name: formBinding.name ?? name,
      required,
      hintId,
      errorId,
      selectedValue,
      selectSingleValue,
      selectedValues,
      toggleMultipleValue,
    }),
    [
      errorId,
      formBinding.name,
      hintId,
      name,
      resolvedDisabled,
      resolvedReadOnly,
      required,
      selectSingleValue,
      selectedValue,
      selectedValues,
      selection,
      toggleMultipleValue,
    ],
  );
 
  const fieldLabelCtx = useMemo(() => ({ required }), [required]);
 
  return {
    contextValue,
    fieldLabelCtx,
    hintId,
    errorId,
    disabled: resolvedDisabled,
    formInvalid,
    resolvedError,
    bindFieldsetRef,
    handleBlur,
  };
}
 