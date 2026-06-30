import type { ClassValue } from "clsx";
import type { ReactNode, Ref, RefObject } from "react";

import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

export function mergeDropdownSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
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
