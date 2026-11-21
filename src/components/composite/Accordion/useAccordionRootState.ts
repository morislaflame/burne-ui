import { useCallback, useMemo, useRef, useState } from "react";
 
import type { AccordionContextValue, UseAccordionRootStateProps } from "./accordionTypes";
 
export function useAccordionRootState({
  selectionMode = "single",
  defaultValue: defaultValueProp = null,
  value: valueProp,
  onValueChange,
  values: valuesProp,
  defaultValues = [],
  onValuesChange,
  variant = "default",
  size = "base",
  motion,
}: UseAccordionRootStateProps) {
  const singleControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValueProp);
  const value = singleControlled ? (valueProp ?? null) : internalValue;

  const manyControlled = valuesProp !== undefined;
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
  const values = manyControlled ? valuesProp : internalValues;
  /** Auto-ids for items without `value`. Never reset during render (Strict Mode / concurrent). */
  const itemIndexRef = useRef(0);
 
  const allocateAutoItemId = useCallback(() => {
    const id = String(itemIndexRef.current);
    itemIndexRef.current += 1;
    return id;
  }, []);
 
  const setItemOpen = useCallback(
    (id: string, open: boolean) => {
      if (selectionMode === "multiple") {
        const hasItem = values.includes(id);
        if (open === hasItem) return;
        const next = open
          ? [...values, id]
          : values.filter((item) => item !== id);
        if (!manyControlled) setInternalValues(next);
        onValuesChange?.(next);
        return;
      }
      const isCurrentlyOpen = value === id;
      if (open === isCurrentlyOpen) return;
      const next = open ? id : null;
      if (!singleControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [manyControlled, onValueChange, onValuesChange, selectionMode, singleControlled, value, values],
  );
 
  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      selectionMode,
      value,
      values,
      setItemOpen,
      allocateAutoItemId,
      variant,
      size,
      motion,
    }),
    [allocateAutoItemId, motion, selectionMode, setItemOpen, size, value, values, variant],
  );
 
  return { contextValue };
}
