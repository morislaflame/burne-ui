import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";

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

  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  const selectedValue = controlled
    ? valueProp == null
      ? undefined
      : String(valueProp)
    : internalValue;

  const selectValue = useCallback(
    (next: string | undefined) => {
      if (isRequired && next === undefined) return;
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlled, isRequired, onValueChange],
  );

  const requiredAnchorClaimedRef = useRef(false);
  useEffect(() => {
    requiredAnchorClaimedRef.current = false;
  }, [isRequired, groupName]);

  const claimRequiredAnchor = useCallback(() => {
    if (!isRequired || requiredAnchorClaimedRef.current) return false;
    requiredAnchorClaimedRef.current = true;
    return true;
  }, [isRequired]);

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
