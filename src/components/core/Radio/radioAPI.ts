import { useCallback, useState } from "react";

import type { SelectionIndicatorClassNames, SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import { cn } from "@/utils/cn";

import type { RadioClassNames, RadioIndicatorClassNames, RadioVariant } from "./radioTypes";

export function radioVariantToIndicator(variant: RadioVariant): SelectionIndicatorVariant {
  return variant === "gloss" ? "gloss" : "base";
}

export function resolveRadioIndicatorClassNames({
  slotClassNames,
  classNames,
  className,
}: {
  slotClassNames: RadioClassNames;
  classNames?: RadioIndicatorClassNames;
  className?: string;
}): SelectionIndicatorClassNames {
  return {
    shell: cn(
      slotClassNames.indicator,
      classNames?.shell,
      classNames?.indicator,
      className,
    ),
    fill: cn(
      slotClassNames.indicatorFill,
      classNames?.fill,
      classNames?.indicatorFill,
    ),
    mark: cn(
      slotClassNames.indicatorMark,
      classNames?.mark,
      classNames?.indicatorMark,
    ),
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
