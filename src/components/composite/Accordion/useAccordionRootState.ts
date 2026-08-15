import { useCallback, useMemo, useRef, useState } from "react";

import { accordionDefaultValue } from "./accordionAPI";
import type { AccordionContextValue, UseAccordionRootStateProps } from "./accordionTypes";

export function useAccordionRootState({
  defaultValue: defaultValueProp = null,
  defaultOpenIndex = null,
  value: valueProp,
  onValueChange,
  size = "base",
  motion,
}: UseAccordionRootStateProps) {
  const controlled = valueProp !== undefined;
  const defaultValue = accordionDefaultValue(defaultValueProp, defaultOpenIndex);
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const value = controlled ? valueProp : internalValue;
  /** Auto-ids for items without `value`. Never reset during render (Strict Mode / concurrent). */
  const itemIndexRef = useRef(0);

  const allocateAutoItemId = useCallback(() => {
    const id = String(itemIndexRef.current);
    itemIndexRef.current += 1;
    return id;
  }, []);

  const setValue = useCallback(
    (next: string | null) => {
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      value,
      setValue,
      allocateAutoItemId,
      size,
      motion,
    }),
    [allocateAutoItemId, motion, value, setValue, size],
  );

  return { contextValue };
}
