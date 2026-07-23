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

export const TABLE_ROW_KEY_ATTR = "data-table-row-key";

export function tableSelectableRows(table: HTMLElement): HTMLElement[] {
  return Array.from(
    table.querySelectorAll<HTMLElement>(`tbody tr[${TABLE_ROW_KEY_ATTR}]`),
  );
}

export function tableSortButtons(from: HTMLElement): HTMLButtonElement[] {
  const root = from.closest("table") ?? from.closest("[role='grid']");
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>("thead button[type='button']"),
  );
}

export function tableBumpRow(
  rows: HTMLElement[],
  current: HTMLElement,
  delta: number,
): HTMLElement | null {
  if (rows.length === 0) return null;
  const idx = rows.indexOf(current);
  if (idx < 0) return rows[0] ?? null;
  const next = idx + delta;
  if (next < 0 || next >= rows.length) return rows[idx] ?? null;
  return rows[next] ?? null;
}

export function tableBumpSortButton(
  buttons: HTMLButtonElement[],
  current: HTMLButtonElement,
  delta: number,
): HTMLButtonElement | null {
  if (buttons.length === 0) return null;
  const idx = buttons.indexOf(current);
  if (idx < 0) return buttons[0] ?? null;
  const next = idx + delta;
  if (next < 0 || next >= buttons.length) return buttons[idx] ?? null;
  return buttons[next] ?? null;
}
