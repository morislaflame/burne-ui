import { useCallback, useState } from "react";

import type { SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type { RadioVariant } from "./radioTypes";

export function mergeRadioSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function radioVariantToIndicator(variant: RadioVariant): SelectionIndicatorVariant {
  return variant === "gloss" ? "gloss" : "base";
}

export function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}

export function useMergedChecked(
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const value = isControlled ? Boolean(checked) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}
