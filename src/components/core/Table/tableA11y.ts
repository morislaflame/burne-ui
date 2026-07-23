import type { SelectionMode, SortDirection } from "./tableTypes";

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
  selectionMode: SelectionMode,
  isSelected: boolean,
): boolean | undefined {
  return selectionMode !== "none" ? isSelected : undefined;
}

/** `aria-selected` on `row` is valid only inside `grid` / `treegrid`. */
export function tableContentRole(
  selectionMode: SelectionMode,
): "grid" | undefined {
  return selectionMode !== "none" ? "grid" : undefined;
}

export function tableIsSelectableGrid(selectionMode: SelectionMode): boolean {
  return selectionMode !== "none";
}

export function tableAriaMultiSelectable(
  selectionMode: SelectionMode,
): true | undefined {
  return selectionMode === "multiple" ? true : undefined;
}

export function tableRowRole(isGrid: boolean): "row" | undefined {
  return isGrid ? "row" : undefined;
}

export function tableColumnHeaderRole(
  isGrid: boolean,
  isRowHeader: boolean,
): "columnheader" | "rowheader" | undefined {
  if (!isGrid) return undefined;
  return isRowHeader ? "rowheader" : "columnheader";
}

export function tableCellRole(isGrid: boolean): "gridcell" | undefined {
  return isGrid ? "gridcell" : undefined;
}
