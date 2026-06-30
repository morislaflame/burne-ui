import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFieldSetErrorId, useFieldSetHintId } from "@/components/core/Field";

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

  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  const selectedValue =
    selection === "single"
      ? controlled
        ? valueProp == null
          ? undefined
          : String(valueProp)
        : internalValue
      : undefined;

  const selectSingleValue = useCallback(
    (optionValue: string, checked: boolean) => {
      if (selection !== "single") return;
      const next = checked ? optionValue : undefined;
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange, selection],
  );

  const requiredAnchorClaimedRef = useRef(false);
  useEffect(() => {
    requiredAnchorClaimedRef.current = false;
  }, [isRequired, selection]);

  const claimRequiredAnchor = useCallback(() => {
    if (selection !== "single" || !isRequired || requiredAnchorClaimedRef.current) return false;
    requiredAnchorClaimedRef.current = true;
    return true;
  }, [isRequired, selection]);

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
