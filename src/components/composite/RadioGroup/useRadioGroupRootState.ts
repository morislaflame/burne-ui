import { useCallback, useId, useMemo } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";
import { useOptionGroupRequiredAnchor } from "@/components/composite/utils/useOptionGroupRequiredAnchor";
import { useOptionGroupSingleValue } from "@/components/composite/utils/useOptionGroupSingleValue";

import type { RadioGroupContextValue, UseRadioGroupRootStateProps } from "./radioGroupTypes";

export function useRadioGroupRootState({
  isRequired = false,
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
    allowClear: !isRequired,
  });

  const { claimRequiredAnchor: claimAnchor } = useOptionGroupRequiredAnchor([
    isRequired,
    groupName,
  ]);

  const claimRequiredAnchor = useCallback(() => {
    if (!isRequired) return false;
    return claimAnchor();
  }, [claimAnchor, isRequired]);

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      disabled,
      isRequired,
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
      isRequired,
      selectValue,
      selectedValue,
    ],
  );

  const fieldLabelCtx = useMemo(() => ({ isRequired }), [isRequired]);

  return { contextValue, fieldLabelCtx, hintId, errorId, disabled };
}
