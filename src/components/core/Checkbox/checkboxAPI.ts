import { Children, isValidElement, useCallback, useState, type ReactNode } from "react";

import type { SelectionIndicatorClassNames, SelectionIndicatorVariant } from "@/components/core/SelectionIndicator";
import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type { CheckboxClassNames, CheckboxIndicatorClassNames, CheckboxVariant } from "./checkboxTypes";

export function mergeCheckboxSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function checkboxVariantToIndicator(
  variant: CheckboxVariant,
): SelectionIndicatorVariant {
  if (variant === "default") return "base";
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
    shell: mergeCheckboxSlotClass(
      slotClassNames.indicator,
      classNames?.shell,
      classNames?.indicator,
      className,
    ),
    fill: mergeCheckboxSlotClass(
      slotClassNames.indicatorFill,
      classNames?.fill,
      classNames?.indicatorFill,
    ),
    mark: mergeCheckboxSlotClass(
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
