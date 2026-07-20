import type { ReactNode } from "react";

import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";

export function normalizeDropdownValues(
  value: string | string[] | undefined,
): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? [...value] : [value];
}

export function partitionDropdownItemChildren(children: ReactNode) {
  return partitionOptionListItemChildren(children);
}
