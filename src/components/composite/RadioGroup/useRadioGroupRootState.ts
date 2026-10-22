import { useCallback, useId, useMemo } from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupRequiredAnchor } from "@/components/composite/utils/useOptionGroupRequiredAnchor";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";
 
import { radioGroupName } from "./radioGroupA11y";
import type { RadioGroupContextValue, UseRadioGroupRootStateProps } from "./radioGroupTypes";
 
export function useRadioGroupRootState({
  required = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  name: nameProp,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseRadioGroupRootStateProps) {
  const autoId = useId();
  const legendId = useId();
  const groupName = radioGroupName(nameProp, autoId);
  const formBinding = useFormFieldBinding({
    name: nameProp,
    value: valueProp,
    disabled,
    readOnly,
  });
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const formBound = formBinding.bound;
  const formValue =
    formBound && formBinding.value != null && formBinding.value !== ""
      ? String(formBinding.value)
      : null;
  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);
 
  const { selectedValue, selectValue: selectRaw } = useOptionGroupSingleValue({
    value: formBound ? formValue : valueProp,
    defaultValue,
    onValueChange,
    allowClear: !required,
  });
  const selectValue = useCallback(
    (next: string | undefined) => {
      if (resolvedReadOnly) return;
      selectRaw(next);
      if (formBound) formBinding.setValue(next ?? "");
    },
    [formBinding, formBound, resolvedReadOnly, selectRaw],
  );
 
  const { claimRequiredAnchor: claimAnchor } = useOptionGroupRequiredAnchor([
    required,
    groupName,
  ]);
 
  const claimRequiredAnchor = useCallback(() => {
    if (!required) return false;
    return claimAnchor();
  }, [claimAnchor, required]);
 
  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      disabled: Boolean(formBinding.disabled),
      readOnly: resolvedReadOnly,
      required,
      legendId,
      hintId,
      errorId,
      selectedValue,
      selectValue,
      claimRequiredAnchor,
    }),
    [
      claimRequiredAnchor,
      errorId,
      formBinding,
      resolvedReadOnly,
      groupName,
      hintId,
      legendId,
      required,
      selectValue,
      selectedValue,
    ],
  );
 
  const fieldLabelCtx = useMemo(() => ({ required }), [required]);
 
  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
 