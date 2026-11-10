import type { ReactNode } from "react";

import type { SelectItem, SelectItemGroup, SelectItemSection } from "./selectTypes";

export function isSelectItemGroup(
  item: SelectItem | SelectItemGroup,
): item is SelectItemGroup {
  return Array.isArray((item as SelectItemGroup).items);
}

/** Splits a mixed `items` list into labeled groups and loose items. */
export function selectOptionSections(
  items: readonly (SelectItem | SelectItemGroup)[] | undefined,
): SelectItemSection[] {
  const sections: SelectItemSection[] = [];
  let loose: SelectItem[] = [];
  const flush = () => {
    if (loose.length === 0) return;
    sections.push({ items: loose });
    loose = [];
  };
  for (const item of items ?? []) {
    if (isSelectItemGroup(item)) {
      flush();
      sections.push({ label: item.label, items: [...item.items] });
    } else {
      loose.push(item);
    }
  }
  flush();
  return sections;
}

export function flattenSelectItems(
  items: readonly (SelectItem | SelectItemGroup)[] | undefined,
): SelectItem[] {
  return selectOptionSections(items).flatMap((section) => section.items);
}
 
export function selectOptionsByValue(items: SelectItem[]): Map<string, SelectItem> {
  return new Map(items.map((o) => [o.value, o]));
}
 
export function selectOptionValues(items: SelectItem[]): string[] {
  return items.map((o) => o.value);
}
 
export function selectBumpActiveValue({
  optionValues,
  activeValue,
  optionsByValue,
  delta,
}: {
  optionValues: string[];
  activeValue: string | null;
  optionsByValue: Map<string, SelectItem>;
  delta: number;
}): string | null {
  if (optionValues.length === 0) return activeValue;
  const idx = activeValue ? optionValues.indexOf(activeValue) : -1;
  let j = idx < 0 ? 0 : idx;
  for (let step = 0; step < optionValues.length; step += 1) {
    j = (j + delta + optionValues.length) % optionValues.length;
    const v = optionValues[j];
    const opt = optionsByValue.get(v);
    if (v && opt && !opt.disabled) return v;
  }
  return activeValue;
}
 
export function selectFirstEnabledValue(
  optionValues: string[],
  optionsByValue: Map<string, SelectItem>,
): string | null {
  for (const v of optionValues) {
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}
 
export function selectLastEnabledValue(
  optionValues: string[],
  optionsByValue: Map<string, SelectItem>,
): string | null {
  for (let i = optionValues.length - 1; i >= 0; i -= 1) {
    const v = optionValues[i]!;
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}
 
/** Haystack for typeahead — string label / value only. */
export function selectOptionTypeaheadLabel(opt: SelectItem | undefined): string {
  if (!opt) return "";
  if (typeof opt.label === "string") return opt.label.trim();
  return opt.value;
}
 
export function selectTypeaheadLabels(
  optionValues: string[],
  optionsByValue: Map<string, SelectItem>,
): string[] {
  return optionValues.map((v) => selectOptionTypeaheadLabel(optionsByValue.get(v)));
}
 
export const EMPTY_SELECT_OPTIONS: SelectItem[] = [];

export const EMPTY_SELECT_VALUES: string[] = [];

export function normalizeSelectValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value !== "") return [value];
  return EMPTY_SELECT_VALUES;
}

/** Selected labels in option order. A non-string label falls back to its value. */
export function selectSelectionLabels(
  optionValues: string[],
  selected: readonly string[],
  optionsByValue: Map<string, SelectItem>,
): string[] {
  const picked = new Set(selected);
  const labels: string[] = [];
  for (const value of optionValues) {
    if (!picked.has(value)) continue;
    const opt = optionsByValue.get(value);
    if (!opt) continue;
    labels.push(typeof opt.label === "string" ? opt.label : value);
  }
  return labels;
}

export function selectActiveOnOpen({
  optionValues,
  multiple,
  values,
  value,
}: {
  optionValues: string[];
  multiple: boolean;
  values: readonly string[];
  value: string;
}): string | null {
  const selected = multiple ? values : value ? [value] : [];
  const picked = new Set(selected);
  return optionValues.find((item) => picked.has(item)) ?? optionValues[0] ?? null;
}

export function selectShownValue(
  multiple: boolean,
  labels: readonly string[],
  selectedLabel: ReactNode | undefined,
  placeholder: string,
): { text: ReactNode; muted: boolean } {
  if (multiple) {
    if (labels.length === 0) return { text: placeholder, muted: true };
    return { text: labels.join(", "), muted: false };
  }
  if (selectedLabel == null || selectedLabel === false) return { text: placeholder, muted: true };
  return { text: selectedLabel, muted: false };
}

export function resolveSelectSingleValue({
  multiple,
  formBound,
  formValue,
  isControlled,
  valueProp,
  internalValue,
}: {
  multiple: boolean;
  formBound: boolean;
  formValue: unknown;
  isControlled: boolean;
  valueProp: string | null | undefined;
  internalValue: string;
}): string {
  if (multiple) return "";
  if (formBound) return String(formValue ?? "");
  if (isControlled) return valueProp ?? "";
  return internalValue;
}

export function resolveSelectValues({
  multiple,
  formBound,
  formValues,
  isValuesControlled,
  valuesProp,
  internalValues,
}: {
  multiple: boolean;
  formBound: boolean;
  formValues: string[];
  isValuesControlled: boolean;
  valuesProp: string[] | undefined;
  internalValues: string[];
}): string[] {
  if (!multiple) return EMPTY_SELECT_VALUES;
  if (formBound) return formValues;
  if (isValuesControlled) return valuesProp ?? EMPTY_SELECT_VALUES;
  return internalValues;
}
 