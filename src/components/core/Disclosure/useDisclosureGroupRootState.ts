import { useCallback, useMemo, useState } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import type {
  DisclosureGroupContextValue,
  UseDisclosureGroupRootStateProps,
} from "./disclosureTypes";
 
export function useDisclosureGroupRootState({
  selectionMode = "single",
  separated = false,
  variant: variantProp,
  size = "base",
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues = [],
  onValuesChange,
  motion,
}: UseDisclosureGroupRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const singleControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const openValue = singleControlled ? valueProp! : internal;

  const manyControlled = valuesProp !== undefined;
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
  const values = manyControlled ? valuesProp : internalValues;
 
  const setOpenValue = useCallback(
    (val: string | null) => {
      const next = val === openValue ? null : val;
      if (!singleControlled) setInternal(next);
      onValueChange?.(next);
    },
    [onValueChange, openValue, singleControlled],
  );

  const setItemOpen = useCallback(
    (id: string, open: boolean) => {
      const next = open
        ? values.includes(id) ? values : [...values, id]
        : values.filter((item) => item !== id);
      if (!manyControlled) setInternalValues(next);
      onValuesChange?.(next);
    },
    [manyControlled, onValuesChange, values],
  );
 
  const contextValue: DisclosureGroupContextValue = useMemo(
    () => ({
      selectionMode,
      openValue,
      values,
      setOpenValue,
      setItemOpen,
      variant,
      size,
      separated,
      motion,
    }),
    [motion, openValue, selectionMode, separated, setItemOpen, setOpenValue, size, values, variant],
  );
 
  return {
    contextValue,
    separated,
    variant,
  };
}
