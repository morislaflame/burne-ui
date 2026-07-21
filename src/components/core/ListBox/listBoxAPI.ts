import type { ReactNode } from "react";

import type { SelectionIndicatorClassNames } from "@/components/core/SelectionIndicator";
import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

import type { ListBoxClassNames, ListBoxItemIndicatorClassNames, UseListBoxItemStateProps } from "./listBoxTypes";

export function resolveListBoxItemIndicatorClassNames({
  slotClassNames,
  classNames,
}: {
  slotClassNames: ListBoxClassNames;
  classNames?: ListBoxItemIndicatorClassNames;
}): SelectionIndicatorClassNames {
  return {
    root: cn(
      slotClassNames.itemIndicatorShell,
      classNames?.root,
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
