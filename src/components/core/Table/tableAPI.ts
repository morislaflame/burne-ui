import type { Selection, SelectionMode, SortDescriptor } from "./tableTypes";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
 
export const EMPTY_TABLE_SELECTION = new Set<string | number>();
 
export const TONED_ROW_DEFAULT_TONE = "secondary" as const;
 
export const TABLE_LABEL_DISPLAY_NAME = "Table.Label";
export const TABLE_EMPTY_DISPLAY_NAME = "Table.Empty";
 
export function hasTableLabel(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === TABLE_LABEL_DISPLAY_NAME,
  );
}
 
export function isTableEmptyElement(node: ReactNode): node is ReactElement {
  return (
    isValidElement(node) &&
    (node.type as { displayName?: string }).displayName === TABLE_EMPTY_DISPLAY_NAME
  );
}
 
export function isRowInSelection(selectedKeys: Selection, key: string | number): boolean {
  if (selectedKeys === "all") return true;
  return selectedKeys.has(key);
}
 
export function selectionEquals(a: Selection, b: Selection): boolean {
  if (Object.is(a, b)) return true;
  if (a === "all" || b === "all") return a === b;
  if (a.size !== b.size) return false;
  for (const key of a) {
    if (!b.has(key)) return false;
  }
  return true;
}
 
export function toggleSelectionKey({
  selectionMode,
  selectedKeys,
  key,
  allSelectableKeys,
  disallowEmptySelection = false,
}: {
  selectionMode: SelectionMode;
  selectedKeys: Selection;
  key: string | number;
  allSelectableKeys?: readonly (string | number)[];
  disallowEmptySelection?: boolean;
}): Selection | null {
  if (selectionMode === "none") return null;
  if (selectionMode === "single") {
    if (selectedKeys === "all") return new Set([key]);
    const alreadySelected =
      selectedKeys.has(key) ||
      Array.from(selectedKeys).some((k) => String(k) === String(key));
    if (alreadySelected) {
      return disallowEmptySelection ? null : new Set();
    }
    return new Set([key]);
  }
  if (selectedKeys === "all") {
    if (!allSelectableKeys) return new Set();
    const next = new Set(
      allSelectableKeys.filter((k) => k !== key && String(k) !== String(key)),
    );
    if (disallowEmptySelection && next.size === 0) return null;
    return next;
  }
  const next = new Set(selectedKeys);
  if (next.has(key)) {
    if (disallowEmptySelection && next.size <= 1) return null;
    next.delete(key);
  } else {
    next.add(key);
  }
  return next;
}

const ROW_INTERACTIVE_DESCENDANT_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[role='checkbox']",
  "[role='switch']",
  "[role='menuitem']",
  "[role='option']",
  "[role='combobox']",
  "[role='link']",
  "[contenteditable='true']",
].join(",");

export function isInteractiveRowDescendant(
  target: EventTarget | null,
  rowEl: HTMLElement,
): boolean {
  if (!(target instanceof Element) || target === rowEl) return false;
  const interactive = target.closest(ROW_INTERACTIVE_DESCENDANT_SELECTOR);
  if (!interactive || interactive === rowEl) return false;
  return rowEl.contains(interactive);
}

export function extractTableRowKey(
  item: unknown,
  renderItem?: (item: unknown) => ReactNode,
): string | number | undefined {
  if (renderItem) {
    try {
      const rendered = renderItem(item);
      if (isValidElement<{ id?: string | number }>(rendered) && rendered.props.id !== undefined) {
        return rendered.props.id;
      }
    } catch {
      // Fallback to object fields if renderItem relies on runtime context.
    }
  }
  if (typeof item === "object" && item !== null) {
    const rec = item as { id?: unknown; key?: unknown };
    if (typeof rec.id === "string" || typeof rec.id === "number") return rec.id;
    if (typeof rec.key === "string" || typeof rec.key === "number") return rec.key;
  }
  return undefined;
}

export function clampTableColumnWidth(
  rawWidth: number,
  minWidth: number,
  maxWidth: number | undefined,
): number {
  const clampedMin = Math.max(minWidth, Math.round(rawWidth));
  if (maxWidth != null && maxWidth >= minWidth) {
    return Math.min(maxWidth, clampedMin);
  }
  return clampedMin;
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
export const TABLE_VIRTUAL_INDEX_ATTR = "data-virtual-index";
 
export function tableSelectableRows(table: HTMLElement): HTMLElement[] {
  return Array.from(
    table.querySelectorAll<HTMLElement>(`tbody tr[${TABLE_ROW_KEY_ATTR}]`),
  ).filter((row) => !row.hasAttribute("data-disabled"));
}

export function tableDisabledKeySet(
  keys: ReadonlySet<string | number> | readonly (string | number)[] | undefined,
): ReadonlySet<string> {
  if (!keys) return EMPTY_DISABLED_KEYS;
  return new Set(Array.from(keys, (key) => String(key)));
}

const EMPTY_DISABLED_KEYS: ReadonlySet<string> = new Set();
 
export function tableSortButtons(from: HTMLElement): HTMLButtonElement[] {
  const root = from.closest("table") ?? from.closest("[role='grid']");
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLButtonElement>("thead button[type='button']"),
  );
}
 
export function moveVirtualTableRow(
  key: string,
  move: { index: number; count: number; step: (from: number, delta: number) => void; jump: (index: number) => void },
): boolean {
  if (key === "ArrowDown") {
    move.step(move.index, 1);
    return true;
  }
  if (key === "ArrowUp") {
    move.step(move.index, -1);
    return true;
  }
  if (key === "Home") {
    move.jump(0);
    return true;
  }
  if (key === "End") {
    move.jump(Math.max(0, move.count - 1));
    return true;
  }
  return false;
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
 