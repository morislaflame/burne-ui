import { useCallback, useState } from "react";
 
export type UseOptionGroupSingleValueOptions = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /**
   * When `false`, clearing the selection (`null`) is ignored.
   * RadioGroup uses `!required`; CheckboxGroup single always allows clear.
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
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
 
  const selectedValue = controlled ? (valueProp ?? null) : internalValue;
 
  const selectValue = useCallback(
    (next: string | undefined) => {
      if (!allowClear && next == null) return;
      if (!controlled) setInternalValue(next ?? null);
      onValueChange?.(next ?? null);
    },
    [allowClear, controlled, onValueChange],
  );
 
  return { selectedValue, selectValue };
}
 