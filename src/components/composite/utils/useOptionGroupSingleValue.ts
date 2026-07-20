import { useCallback, useState } from "react";

export type UseOptionGroupSingleValueOptions = {
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  /**
   * When `false`, clearing the selection (`undefined`) is ignored.
   * RadioGroup uses `!isRequired`; CheckboxGroup single always allows clear.
   */
  allowClear?: boolean;
};

export function useOptionGroupSingleValue({
  value: valueProp,
  defaultValue,
  onValueChange,
  allowClear = true,
}: UseOptionGroupSingleValueOptions) {
  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);

  const selectedValue = controlled
    ? valueProp == null
      ? undefined
      : String(valueProp)
    : internalValue;

  const selectValue = useCallback(
    (next: string | undefined) => {
      if (!allowClear && next === undefined) return;
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [allowClear, controlled, onValueChange],
  );

  return { selectedValue, selectValue };
}
