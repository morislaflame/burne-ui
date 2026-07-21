import { useCallback, useMemo, useRef, useState } from "react";

import { accordionDefaultValue } from "./accordionAPI";
import type { AccordionContextValue, UseAccordionRootStateProps } from "./accordionTypes";

export function useAccordionRootState({
  defaultValue: defaultValueProp = null,
  defaultOpenIndex = null,
  value: valueProp,
  onValueChange,
  size = "base",
}: UseAccordionRootStateProps) {
  const controlled = valueProp !== undefined;
  const defaultValue = accordionDefaultValue(defaultValueProp, defaultOpenIndex);
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const value = controlled ? valueProp : internalValue;
  const itemIndexRef = useRef(0);

  itemIndexRef.current = 0;

  const getItemId = useCallback((explicit?: string) => {
    if (explicit != null) return explicit;
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
      getItemId,
      size,
    }),
    [getItemId, value, setValue, size],
  );

  return { contextValue };
}
