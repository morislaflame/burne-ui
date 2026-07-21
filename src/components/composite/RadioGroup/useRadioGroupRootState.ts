import { useCallback, useId, useMemo } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupRequiredAnchor } from "@/components/composite/utils/useOptionGroupRequiredAnchor";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";

import type { RadioGroupContextValue, UseRadioGroupRootStateProps } from "./radioGroupTypes";

export function useRadioGroupRootState({
  required = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  name: nameProp,
  hintId: hintIdProp,
  errorId: errorIdProp,
}: UseRadioGroupRootStateProps) {
  const autoId = useId();
  const groupName = nameProp ?? `radio-group-${autoId}`;
  const hintId = useFieldSetHintId(hintIdProp);
  const errorId = useFieldSetErrorId(errorIdProp);

  const { selectedValue, selectValue } = useOptionGroupSingleValue({
    value: valueProp,
    defaultValue,
    onValueChange,
    allowClear: !required,
  });

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
      disabled,
      required,
      hintId,
      errorId,
      selectedValue,
      selectValue,
      claimRequiredAnchor,
    }),
    [
      claimRequiredAnchor,
      disabled,
      errorId,
      groupName,
      hintId,
      required,
      selectValue,
      selectedValue,
    ],
  );

  const fieldLabelCtx = useMemo(() => ({ required }), [required]);

  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
