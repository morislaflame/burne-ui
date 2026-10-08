import { useCallback, useMemo, useState } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import type {
  DisclosureGroupContextValue,
  UseDisclosureGroupRootStateProps,
} from "./disclosureTypes";
 
export function useDisclosureGroupRootState({
  accordion = true,
  separated = false,
  variant: variantProp,
  size = "base",
  value: valueProp,
  defaultValue,
  onValueChange,
  motion,
}: UseDisclosureGroupRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<string | null>(defaultValue ?? null);
  const openValue = isControlled ? valueProp! : internal;
 
  const setOpenValue = useCallback(
    (val: string | null) => {
      const next = accordion && val === openValue ? null : val;
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [accordion, isControlled, onValueChange, openValue],
  );
 
  const contextValue: DisclosureGroupContextValue = useMemo(
    () => ({ openValue, setOpenValue, variant, size, separated, accordion, motion }),
    [accordion, motion, openValue, setOpenValue, variant, size, separated],
  );
 
  return {
    contextValue,
    separated,
    variant,
  };
}
 