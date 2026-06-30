import type { SortDirection } from "./tableTypes";

export function columnAriaSort(
  allowsSorting: boolean,
  sortDirection: SortDirection | undefined,
): "ascending" | "descending" | "none" | undefined {
  if (!allowsSorting) return undefined;
  if (sortDirection === "ascending") return "ascending";
  if (sortDirection === "descending") return "descending";
  return "none";
}

export function rowAriaSelected(
  selectionMode: "none" | "single" | "multiple",
  isSelected: boolean,
): boolean | undefined {
  return selectionMode !== "none" ? isSelected : undefined;
}
