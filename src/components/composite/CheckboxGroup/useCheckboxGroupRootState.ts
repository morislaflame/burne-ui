import { useCallback, useMemo, useState } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";
 
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
  disabled = false,
  readOnly = false,
  name,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseCheckboxGroupRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: selection === "multiple" ? valuesProp : valueProp,
    disabled,
    readOnly,
  });
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const formBound = formBinding.bound;
  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);
  const multiple = selection === "multiple";
  const valuesControlled = multiple && valuesProp !== undefined;
 
  const formSingle =
    formBound && selection === "single" && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : null;
  const { selectedValue: singleSelectedValue, selectValue } = useOptionGroupSingleValue({
    value: selection === "single" ? (formBound ? formSingle : valueProp) : undefined,
    defaultValue: selection === "single" ? defaultValue : undefined,
    onValueChange: selection === "single" ? onValueChange : undefined,
    allowClear: true,
  });
 
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
 
  const selectSingleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (selection !== "single" || resolvedReadOnly) return;
      const next = checked ? optionValue : undefined;
      selectValue(next);
      if (formBound) formBinding.setValue(next ?? "");
    },
    [formBinding, formBound, resolvedReadOnly, selectValue, selection],
  );
 
  const toggleMultipleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (!multiple || resolvedReadOnly) return;
      const current = formBound ? formValues : valuesControlled ? (valuesProp ?? EMPTY_VALUES) : internalValues;
      const next = checkboxGroupNextValues(current, optionValue, checked);
      if (checkboxGroupValuesEqual(current, next)) return;
      if (!valuesControlled && !formBound) setInternalValues(next);
      onValuesChange?.(next);
      if (formBound) formBinding.setValue(next);
    },
    [formBinding, formBound, formValues, internalValues, multiple, onValuesChange, resolvedReadOnly, valuesControlled, valuesProp],
  );
 
  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      selection,
      disabled: Boolean(formBinding.disabled),
      readOnly: resolvedReadOnly,
      name,
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
      formBinding,
      hintId,
      name,
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
 
  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
 