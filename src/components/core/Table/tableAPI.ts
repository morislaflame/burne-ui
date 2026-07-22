import type { Selection, SelectionMode, SortDescriptor } from "./tableTypes";
import { Children, isValidElement, type ReactNode } from "react";

export const EMPTY_TABLE_SELECTION = new Set<string | number>();

export const TONED_ROW_DEFAULT_TONE = "secondary" as const;

export const TABLE_LABEL_DISPLAY_NAME = "Table.Label";

export function hasTableLabel(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === TABLE_LABEL_DISPLAY_NAME,
  );
}

export function isRowInSelection(selectedKeys: Selection, key: string | number): boolean {
  if (selectedKeys === "all") return true;
  return selectedKeys.has(key);
}

export function toggleSelectionKey({
  selectionMode,
  selectedKeys,
  key,
}: {
  selectionMode: SelectionMode;
  selectedKeys: Selection;
  key: string | number;
}): Selection | null {
  if (selectionMode === "none") return null;
  if (selectionMode === "single") return new Set([key]);
  if (selectedKeys === "all") return new Set([key]);
  const next = new Set(selectedKeys);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function resolveColumnSortDirection(
  columnId: string | undefined,
  sortDescriptor: SortDescriptor | undefined,
): SortDescriptor["direction"] | undefined {
  if (!columnId || sortDescriptor?.column !== columnId) return undefined;
  return sortDescriptor.direction;
}

export function resolveNextSortDescriptor(
  columnId: string,
  sortDescriptor: SortDescriptor | undefined,
): SortDescriptor {
  return {
    column: columnId,
    direction:
      sortDescriptor?.column === columnId && sortDescriptor.direction === "ascending"
        ? "descending"
        : "ascending",
  };
}
