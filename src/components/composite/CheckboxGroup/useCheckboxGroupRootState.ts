import { useCallback, useMemo } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupRequiredAnchor } from "@/components/composite/utils/useOptionGroupRequiredAnchor";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";

import type {
  CheckboxGroupContextValue,
  UseCheckboxGroupRootStateProps,
} from "./checkboxGroupTypes";

export function useCheckboxGroupRootState({
  required = false,
  selection = "multiple",
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseCheckboxGroupRootStateProps) {
  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);

  const { selectedValue: singleSelectedValue, selectValue } = useOptionGroupSingleValue({
    value: valueProp,
    defaultValue,
    onValueChange,
    allowClear: true,
  });

  const selectedValue = selection === "single" ? singleSelectedValue : undefined;

  const selectSingleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (selection !== "single") return;
      selectValue(checked ? optionValue : undefined);
    },
    [selectValue, selection],
  );

  const { claimRequiredAnchor: claimAnchor } = useOptionGroupRequiredAnchor([
    required,
    selection,
  ]);

  const claimRequiredAnchor = useCallback(() => {
    if (selection !== "single" || !required) return false;
    return claimAnchor();
  }, [claimAnchor, required, selection]);

  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      selection,
      disabled,
      required,
      hintId,
      errorId,
      selectedValue,
      selectSingleValue,
      claimRequiredAnchor,
    }),
    [
      claimRequiredAnchor,
      disabled,
      errorId,
      hintId,
      required,
      selectSingleValue,
      selectedValue,
      selection,
    ],
  );

  const fieldLabelCtx = useMemo(() => ({ required }), [required]);

  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
