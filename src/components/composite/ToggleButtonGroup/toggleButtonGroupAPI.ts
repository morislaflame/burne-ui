import type { ReactElement } from "react";

import { ToggleButton } from "@/components/core/ToggleButton";
import { flattenFragmentChildren } from "@/components/composite/ButtonGroup/buttonGroupAPI";

import type { ToggleButtonGroupType } from "./toggleButtonGroupTypes";

export { flattenFragmentChildren };

export function isToggleButtonChild(child: ReactElement): boolean {
  return child.type === ToggleButton;
}

export function countToggleButtonChildren(children: ReactElement[]): number {
  return children.reduce((n, el) => n + (isToggleButtonChild(el) ? 1 : 0), 0);
}

export function extractToggleItemValues(children: ReactElement[]): string[] {
  return children.reduce<string[]>((acc, el) => {
    if (!isToggleButtonChild(el)) return acc;
    const value = (el.props as { value?: string }).value;
    if (typeof value === "string") acc.push(value);
    return acc;
  }, []);
}

export function normalizeMultipleDefault(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizeSingleDefault(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function isToggleButtonGroupItemSelected(
  type: ToggleButtonGroupType,
  itemValue: string,
  singleValue: string | undefined,
  multipleValues: string[],
): boolean {
  if (type === "single") return singleValue === itemValue;
  return multipleValues.includes(itemValue);
}

export type ToggleButtonGroupSelectionChange =
  | { kind: "single"; value: string }
  | { kind: "multiple"; value: string[] }
  | null;

export function resolveToggleButtonGroupSelectionChange(
  type: ToggleButtonGroupType,
  itemValue: string,
  singleValue: string | undefined,
  multipleValues: string[],
): ToggleButtonGroupSelectionChange {
  if (type === "single") {
    if (singleValue === itemValue) return null;
    return { kind: "single", value: itemValue };
  }

  const next = multipleValues.includes(itemValue)
    ? multipleValues.filter((v) => v !== itemValue)
    : [...multipleValues, itemValue];

  return { kind: "multiple", value: next };
}
