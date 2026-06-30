import type { ClassValue } from "clsx";
import type { Ref, RefObject } from "react";

import type { InputStatus } from "@/components/core/Input";
import { cn } from "@/utils/cn";

import type { ComboBoxOption } from "./comboBoxTypes";

export function mergeComboBoxSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as RefObject<T | null>).current = node;
    }
  };
}

function optionSearchHaystack(opt: ComboBoxOption): string {
  const parts: string[] = [opt.value];
  if (opt.filterText) parts.push(opt.filterText);
  if (typeof opt.label === "string") parts.push(opt.label);
  if (typeof opt.hint === "string") parts.push(opt.hint);
  return parts.join(" ").toLowerCase();
}

function comboBoxOptionMatchesFilter(opt: ComboBoxOption, query: string): boolean {
  const t = query.trim().toLowerCase();
  if (!t) return true;
  return optionSearchHaystack(opt).includes(t);
}

export function comboBoxFilteredValues(options: ComboBoxOption[], query: string): string[] {
  const result: string[] = [];
  for (const opt of options) {
    if (comboBoxOptionMatchesFilter(opt, query)) result.push(opt.value);
  }
  return result;
}

export function comboBoxOptionsByValue(options: ComboBoxOption[]): Map<string, ComboBoxOption> {
  return new Map(options.map((o) => [o.value, o]));
}

export function comboBoxOptionDisplayString(
  selectedOption: ComboBoxOption | undefined,
): string {
  if (!selectedOption) return "";
  if (typeof selectedOption.label === "string") return selectedOption.label;
  if (selectedOption.filterText) return selectedOption.filterText;
  return selectedOption.value;
}

export function comboBoxBumpActiveValue({
  filteredValues,
  activeValue,
  optionsByValue,
  delta,
}: {
  filteredValues: string[];
  activeValue: string | null;
  optionsByValue: Map<string, ComboBoxOption>;
  delta: number;
}): string | null {
  if (filteredValues.length === 0) return activeValue;
  const idx = activeValue ? filteredValues.indexOf(activeValue) : -1;
  let j = idx < 0 ? 0 : idx;
  for (let step = 0; step < filteredValues.length; step += 1) {
    j = (j + delta + filteredValues.length) % filteredValues.length;
    const v = filteredValues[j];
    const opt = optionsByValue.get(v);
    if (v && opt && !opt.disabled) return v;
  }
  return activeValue;
}

export function comboBoxFirstEnabledValue(
  filteredValues: string[],
  optionsByValue: Map<string, ComboBoxOption>,
): string | null {
  for (const v of filteredValues) {
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}

export function comboBoxLastEnabledValue(
  filteredValues: string[],
  optionsByValue: Map<string, ComboBoxOption>,
): string | null {
  for (let i = filteredValues.length - 1; i >= 0; i -= 1) {
    const v = filteredValues[i]!;
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}

export function comboBoxResolveHintStatus(
  status: Exclude<InputStatus, "danger"> | "default" | undefined,
  fieldStatus: InputStatus,
): Exclude<InputStatus, "danger"> | "default" {
  if (status) return status;
  if (fieldStatus === "danger") return "default";
  if (fieldStatus === "default") return "default";
  return fieldStatus;
}

export const EMPTY_COMBOBOX_OPTIONS: ComboBoxOption[] = [];
