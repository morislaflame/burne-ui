import type { ClassValue } from "clsx";
import type { ReactNode } from "react";

import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

import type { UseListBoxItemStateProps } from "./listBoxTypes";

export function mergeListBoxSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function normalizeListBoxValues(
  value: string | string[] | undefined,
): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? [...value] : [value];
}

export function partitionListBoxItemChildren(children: ReactNode) {
  return partitionOptionListItemChildren(children);
}

export function resolveListBoxItemLayout({
  children,
  label,
  hint,
  icon,
  showIndicator,
}: Pick<UseListBoxItemStateProps, "children" | "label" | "hint" | "icon"> & {
  showIndicator: boolean;
}) {
  const parts = partitionListBoxItemChildren(children);
  const hasCompoundIndicator = parts.indicator != null;
  const hasHint = parts.hint != null || hint != null;
  const hasIcon = parts.icon != null || icon != null;
  const isCompound =
    parts.label != null || parts.hint != null || parts.icon != null;
  const hasLabel = label != null || parts.label != null;
  const showIndicatorSlot = isCompound
    ? showIndicator && hasCompoundIndicator
    : showIndicator;

  return {
    parts,
    hasCompoundIndicator,
    hasHint,
    hasIcon,
    isCompound,
    hasLabel,
    showIndicatorSlot,
  };
}
