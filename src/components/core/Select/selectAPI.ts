import type { InputStatus } from "@/components/core/Input";
import type { SelectOption } from "./selectTypes";

export function selectOptionsByValue(options: SelectOption[]): Map<string, SelectOption> {
  return new Map(options.map((o) => [o.value, o]));
}

export function selectOptionValues(options: SelectOption[]): string[] {
  return options.map((o) => o.value);
}

export function selectBumpActiveValue({
  optionValues,
  activeValue,
  optionsByValue,
  delta,
}: {
  optionValues: string[];
  activeValue: string | null;
  optionsByValue: Map<string, SelectOption>;
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
  optionsByValue: Map<string, SelectOption>,
): string | null {
  for (const v of optionValues) {
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}

export function selectLastEnabledValue(
  optionValues: string[],
  optionsByValue: Map<string, SelectOption>,
): string | null {
  for (let i = optionValues.length - 1; i >= 0; i -= 1) {
    const v = optionValues[i]!;
    const opt = optionsByValue.get(v);
    if (opt && !opt.disabled) return v;
  }
  return null;
}

/** Haystack for typeahead — string label / value only. */
export function selectOptionTypeaheadLabel(opt: SelectOption | undefined): string {
  if (!opt) return "";
  if (typeof opt.label === "string") return opt.label.trim();
  return opt.value;
}

export function selectTypeaheadLabels(
  optionValues: string[],
  optionsByValue: Map<string, SelectOption>,
): string[] {
  return optionValues.map((v) => selectOptionTypeaheadLabel(optionsByValue.get(v)));
}

export function selectResolveHintStatus(
  status: Exclude<InputStatus, "danger"> | "default" | undefined,
  fieldStatus: InputStatus,
): Exclude<InputStatus, "danger"> | "default" {
  if (status) return status;
  if (fieldStatus === "danger") return "default";
  if (fieldStatus === "default") return "default";
  return fieldStatus;
}

export const EMPTY_SELECT_OPTIONS: SelectOption[] = [];
