import type { ClassValue } from "clsx";
import type { ReactNode, Ref, RefObject } from "react";

import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";
import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

import type { DropdownClassNames } from "./dropdownTypes";

export function mergeDropdownSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function resolveDropdownItemIndicatorClassNames({
  slotClassNames,
  classNames,
}: {
  slotClassNames: DropdownClassNames;
  classNames?: SelectionIndicatorClassNames;
}): SelectionIndicatorClassNames {
  return {
    shell: mergeDropdownSlotClass(slotClassNames.itemIndicatorShell, classNames?.shell),
    fill: mergeDropdownSlotClass(slotClassNames.itemIndicatorFill, classNames?.fill),
    mark: mergeDropdownSlotClass(slotClassNames.itemIndicatorMark, classNames?.mark),
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
