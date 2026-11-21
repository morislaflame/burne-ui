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
      if (val === openValue) return;
      if (!singleControlled) setInternal(val);
      onValueChange?.(val);
    },
    [onValueChange, openValue, singleControlled],
  );

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
      const isCurrentlyOpen = openValue === id;
      if (open === isCurrentlyOpen) return;
      const next = open ? id : null;
      if (!singleControlled) setInternal(next);
      onValueChange?.(next);
    },
    [manyControlled, onValueChange, onValuesChange, openValue, selectionMode, singleControlled, values],
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
