import type { SelectionIndicatorClassNames, SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import { cn } from "@/utils/cn";

import type { RadioClassNames, RadioIndicatorClassNames, RadioVariant } from "./radioTypes";

export function radioVariantToIndicator(variant: RadioVariant): SelectionIndicatorVariant {
  return variant;
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
