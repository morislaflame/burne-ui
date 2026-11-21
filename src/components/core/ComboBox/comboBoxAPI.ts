import type { ComboBoxItem } from "./comboBoxTypes";
 
function optionSearchHaystack(opt: ComboBoxItem): string {
  const parts: string[] = [opt.value];
  if (opt.filterText) parts.push(opt.filterText);
  if (typeof opt.label === "string") parts.push(opt.label);
  if (typeof opt.hint === "string") parts.push(opt.hint);
  return parts.join(" ").toLowerCase();
}
 
export function comboBoxOptionMatchesFilter(opt: ComboBoxItem, query: string): boolean {
  const t = query.trim().toLowerCase();
  if (!t) return true;
  return optionSearchHaystack(opt).includes(t);
}
 
export function comboBoxFilteredValues(
  items: ComboBoxItem[],
  query: string,
  filter?: (option: ComboBoxItem, query: string) => boolean,
): string[] {
  const match = filter ?? comboBoxOptionMatchesFilter;
  const result: string[] = [];
  for (const opt of items) {
    if (match(opt, query)) result.push(opt.value);
  }
  return result;
}
 
export function comboBoxOptionsByValue(items: ComboBoxItem[]): Map<string, ComboBoxItem> {
  return new Map(items.map((o) => [o.value, o]));
}
 
export function comboBoxOptionDisplayString(
  selectedOption: ComboBoxItem | undefined,
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
  optionsByValue: Map<string, ComboBoxItem>;
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
  optionsByValue: Map<string, ComboBoxItem>,
): string | null {
  for (const v of filteredValues) {
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}
 
export function comboBoxLastEnabledValue(
  filteredValues: string[],
  optionsByValue: Map<string, ComboBoxItem>,
): string | null {
  for (let i = filteredValues.length - 1; i >= 0; i -= 1) {
    const v = filteredValues[i]!;
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}
 
export const EMPTY_COMBOBOX_OPTIONS: ComboBoxItem[] = [];
 