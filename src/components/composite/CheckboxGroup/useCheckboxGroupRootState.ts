import { useCallback, useMemo } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupRequiredAnchor } from "@/components/composite/utils/useOptionGroupRequiredAnchor";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";

import type {
  CheckboxGroupContextValue,
  UseCheckboxGroupRootStateProps,
} from "./checkboxGroupTypes";

export function useCheckboxGroupRootState({
  isRequired = false,
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
    isRequired,
    selection,
  ]);

  const claimRequiredAnchor = useCallback(() => {
    if (selection !== "single" || !isRequired) return false;
    return claimAnchor();
  }, [claimAnchor, isRequired, selection]);

  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      selection,
      disabled,
      isRequired,
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
      isRequired,
      selectSingleValue,
      selectedValue,
      selection,
    ],
  );

  const fieldLabelCtx = useMemo(() => ({ isRequired }), [isRequired]);

  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
