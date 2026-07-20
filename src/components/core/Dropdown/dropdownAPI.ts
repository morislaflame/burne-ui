import type { ReactNode, Ref, RefObject } from "react";

import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";
import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

import type { DropdownClassNames, DropdownItemIndicatorClassNames } from "./dropdownTypes";

export function resolveDropdownItemIndicatorClassNames({
  slotClassNames,
  classNames,
}: {
  slotClassNames: DropdownClassNames;
  classNames?: DropdownItemIndicatorClassNames;
}): SelectionIndicatorClassNames {
  return {
    shell: cn(
      slotClassNames.itemIndicatorShell,
      classNames?.shell,
      classNames?.itemIndicatorShell,
    ),
    fill: cn(
      slotClassNames.itemIndicatorFill,
      classNames?.fill,
      classNames?.itemIndicatorFill,
    ),
    mark: cn(
      slotClassNames.itemIndicatorMark,
      classNames?.mark,
      classNames?.itemIndicatorMark,
    ),
  };
}

export function mergeDropdownRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as RefObject<T | null>).current = node;
    }
  };
}

export function normalizeDropdownValues(
  value: string | string[] | undefined,
): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? [...value] : [value];
}

export function partitionDropdownItemChildren(children: ReactNode) {
  return partitionOptionListItemChildren(children);
}
