import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import { EMPTY_TABLE_SELECTION } from "./tableAPI";
import type {
  TableClassNames,
  TableClassNamesProviderProps,
  TableContentContextValue,
  TableRowContextValue,
  TableRowSelectionStore,
  TableVariant,
} from "./tableTypes";

const noopStore: TableRowSelectionStore = {
  subscribeSelection: () => () => {},
  subscribeFocus: () => () => {},
  getSelectedKeys: () => EMPTY_TABLE_SELECTION,
  isSelected: () => false,
  getFocusedRowKey: () => null,
  isFocusTarget: () => false,
  setSelectedKeys: () => {},
  setFocusedRowKey: () => {},
  claimFocusedRowKey: () => {},
};

const TableVariantContext = createContext<TableVariant>("default");
const TableClassNamesContext = createContext<TableClassNames>({});
const TableContentContext = createContext<TableContentContextValue>({
  selectionMode: "none",
  onRowSelect: () => {},
  sortDescriptor: undefined,
  onSortChange: undefined,
  setFocusedRowKey: () => {},
  claimFocusedRowKey: () => {},
  rowStore: noopStore,
});
const TableRowContext = createContext<TableRowContextValue | null>(null);

export function TableVariantProvider({
  variant,
  children,
}: {
  variant: TableVariant;
  children: React.ReactNode;
}) {
  return (
    <TableVariantContext.Provider value={variant}>{children}</TableVariantContext.Provider>
  );
}

export function TableClassNamesProvider({
  classNames,
  children,
}: TableClassNamesProviderProps) {
  const parent = useContext(TableClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <TableClassNamesContext.Provider value={merged}>
      {children}
    </TableClassNamesContext.Provider>
  );
}

export function TableContentProvider({
  value,
  children,
}: {
  value: TableContentContextValue;
  children: React.ReactNode;
}) {
  return (
    <TableContentContext.Provider value={value}>{children}</TableContentContext.Provider>
  );
}

export function TableRowProvider({
  value,
  children,
}: {
  value: TableRowContextValue | null;
  children: React.ReactNode;
}) {
  return (
    <TableRowContext.Provider value={value}>{children}</TableRowContext.Provider>
  );
}

export function useTableVariant(): TableVariant {
  return useContext(TableVariantContext);
}

export function useTableClassNames(): TableClassNames {
  return useContext(TableClassNamesContext);
}

export function useTableContent(): TableContentContextValue {
  return useContext(TableContentContext);
}

export function useTableRow(): TableRowContextValue | null {
  return useContext(TableRowContext);
}

/** Per-row selected boolean — re-renders only when *this* row's selection flips. */
export function useTableRowIsSelected(id: string | number | undefined): boolean {
  const { rowStore } = useTableContent();
  return useSyncExternalStore(
    rowStore.subscribeSelection,
    () => (id === undefined ? false : rowStore.isSelected(id)),
    () => false,
  );
}

/** Per-row roving tab-stop — re-renders only when *this* row's focus target flips. */
export function useTableRowIsFocusTarget(id: string | number | undefined): boolean {
  const { rowStore, selectionMode } = useTableContent();
  return useSyncExternalStore(
    rowStore.subscribeFocus,
    () =>
      selectionMode === "none" || id === undefined
        ? false
        : rowStore.isFocusTarget(id),
    () => false,
  );
}

export { TableVariantContext, TableContentContext, TableRowContext };

/** Scope only. Defaults and host play live in `tableSlotMotion.ts` via `tableAnimations.tsx` helpers. */
export const {
  MotionScopeProvider: TableMotionProvider,
  useMotionScope: useTableMotionScope,
  useOptionalMotionScope: useOptionalTableMotionScope,
} = createMotionScope("Table");
