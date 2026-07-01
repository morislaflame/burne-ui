import { useCallback, useState } from "react";

import type { SelectionIndicatorClassNames, SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type { RadioClassNames, RadioVariant } from "./radioTypes";

export function mergeRadioSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function radioVariantToIndicator(variant: RadioVariant): SelectionIndicatorVariant {
  return variant === "gloss" ? "gloss" : "base";
}

export function resolveRadioIndicatorClassNames({
  slotClassNames,
  classNames,
  className,
}: {
  slotClassNames: RadioClassNames;
  classNames?: SelectionIndicatorClassNames;
  className?: string;
}): SelectionIndicatorClassNames {
  return {
    shell: mergeRadioSlotClass(slotClassNames.indicator, classNames?.shell, className),
    fill: mergeRadioSlotClass(slotClassNames.indicatorFill, classNames?.fill),
    mark: mergeRadioSlotClass(slotClassNames.indicatorMark, classNames?.mark),
  };
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
