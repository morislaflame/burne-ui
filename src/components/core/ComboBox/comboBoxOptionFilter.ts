import type { ComboBoxOption } from "./comboBoxContext";

function optionSearchHaystack(opt: ComboBoxOption): string {
  const parts: string[] = [opt.value];
  if (opt.filterText) parts.push(opt.filterText);
  if (typeof opt.label === "string") parts.push(opt.label);
  if (typeof opt.hint === "string") parts.push(opt.hint);
  return parts.join(" ").toLowerCase();
}

export function comboBoxOptionSearchHaystack(opt: ComboBoxOption): string {
  return optionSearchHaystack(opt);
}

export function comboBoxOptionMatchesFilter(opt: ComboBoxOption, query: string): boolean {
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
