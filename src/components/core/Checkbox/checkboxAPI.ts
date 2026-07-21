import { Children, isValidElement, type ReactNode } from "react";

import type { SelectionIndicatorClassNames, SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import { cn } from "@/utils/cn";

import type { CheckboxClassNames, CheckboxIndicatorClassNames, CheckboxVariant } from "./checkboxTypes";

export function checkboxVariantToIndicator(
  variant: CheckboxVariant,
): SelectionIndicatorVariant {
  if (variant === "default") return "default";
  return variant;
}

export function resolveCheckboxIndicatorClassNames({
  slotClassNames,
  classNames,
  className,
}: {
  slotClassNames: CheckboxClassNames;
  classNames?: CheckboxIndicatorClassNames;
  className?: string;
}): SelectionIndicatorClassNames {
  return {
    root: cn(
      slotClassNames.indicator,
      classNames?.root,
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

export function compoundContentHasExternalLabel(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const props = child.props as { htmlFor?: string; children?: ReactNode };
      if (props.htmlFor != null) {
        found = true;
        return;
      }
      walk(props.children);
    }
  };

  walk(children);
  return found;
}

export function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}
