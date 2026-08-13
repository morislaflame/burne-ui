import type { ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type {
  SelectionIndicatorClassNames,
  SelectionIndicatorSize,
} from "@/components/core/SelectionIndicator";
import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import { cn } from "@/utils/cn";

import {
  listBoxEnabledOptionElements,
  listBoxOptionValue,
} from "./listBoxA11y";
import type {
  ListBoxClassNames,
  ListBoxItemIndicatorClassNames,
  ListBoxSize,
  UseListBoxItemStateProps,
} from "./listBoxTypes";

/** List size → indicator: one step smaller than the list (dense menus). */
export const LISTBOX_INDICATOR_SIZE: Record<ListBoxSize, SelectionIndicatorSize> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "large",
};

export function resolveListBoxIndicatorSize(
  listSize: ListBoxSize,
  sizeProp?: SelectionIndicatorSize,
): SelectionIndicatorSize {
  return sizeProp ?? LISTBOX_INDICATOR_SIZE[listSize];
}

export function resolveListBoxItemIndicatorClassNames({
  slotClassNames,
  classNames,
}: {
  slotClassNames: ListBoxClassNames;
  classNames?: Prettify<ListBoxItemIndicatorClassNames>;
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
  indicator = false,
}: Pick<UseListBoxItemStateProps, "children" | "label" | "hint" | "icon" | "indicator">) {
  const parts = partitionListBoxItemChildren(children);
  const hasCompoundIndicator = parts.indicator != null;
  const hasHint = parts.hint != null || hint != null;
  const hasIcon = parts.icon != null || icon != null;
  const hasRest = parts.rest.length > 0;
  /** Compound body: slots and/or freeform `rest` (like Dropdown.Item). */
  const isCompound =
    parts.label != null ||
    parts.hint != null ||
    parts.icon != null ||
    hasCompoundIndicator ||
    hasRest;
  const hasLabel = label != null || parts.label != null;
  /** Explicit `<ListBox.ItemIndicator />` or simple `indicator` prop. */
  const showIndicatorSlot = hasCompoundIndicator || indicator;

  return {
    parts,
    hasCompoundIndicator,
    hasHint,
    hasIcon,
    hasRest,
    isCompound,
    hasLabel,
    showIndicatorSlot,
  };
}

/** Next/prev enabled option value inside a listbox root (DOM walk). */
export function listBoxBumpActiveValue({
  root,
  activeValue,
  delta,
}: {
  root: HTMLElement;
  activeValue: string | null;
  delta: number;
}): string | null {
  const options = listBoxEnabledOptionElements(root);
  if (options.length === 0) return activeValue;

  const idx = activeValue
    ? options.findIndex((el) => listBoxOptionValue(el) === activeValue)
    : -1;

  let nextIdx: number;
  if (idx < 0) {
    nextIdx = delta > 0 ? 0 : options.length - 1;
  } else {
    nextIdx = (idx + delta + options.length) % options.length;
  }

  return listBoxOptionValue(options[nextIdx]!) ?? activeValue;
}

export function listBoxFirstEnabledValue(root: HTMLElement): string | null {
  const first = listBoxEnabledOptionElements(root)[0];
  return first ? listBoxOptionValue(first) : null;
}

export function listBoxLastEnabledValue(root: HTMLElement): string | null {
  const options = listBoxEnabledOptionElements(root);
  const last = options[options.length - 1];
  return last ? listBoxOptionValue(last) : null;
}

export function listBoxPreferredInitialActiveValue(
  root: HTMLElement,
): string | null {
  const selected = root.querySelector<HTMLElement>(
    '[role="option"][aria-selected="true"]:not([disabled]):not([aria-disabled="true"])',
  );
  if (selected) {
    const value = listBoxOptionValue(selected);
    if (value) return value;
  }
  return listBoxFirstEnabledValue(root);
}

export function listBoxTypeaheadLabels(root: HTMLElement): {
  values: string[];
  labels: string[];
} {
  const options = listBoxEnabledOptionElements(root);
  const values: string[] = [];
  const labels: string[] = [];
  for (const el of options) {
    const value = listBoxOptionValue(el);
    if (!value) continue;
    values.push(value);
    labels.push((el.textContent ?? "").trim().replace(/\s+/g, " "));
  }
  return { values, labels };
}
