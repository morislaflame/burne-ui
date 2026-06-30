import { createContext, useContext, useMemo } from "react";

import type {
  TableClassNames,
  TableClassNamesProviderProps,
  TableContentContextValue,
  TableRowContextValue,
  TableVariant,
} from "./tableTypes";

const TableVariantContext = createContext<TableVariant>("default");
const TableClassNamesContext = createContext<TableClassNames>({});
const TableContentContext = createContext<TableContentContextValue>({
  selectionMode: "none",
  selectedKeys: new Set(),
  onRowSelect: () => {},
  isRowSelected: () => false,
  sortDescriptor: undefined,
  onSortChange: undefined,
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

export { TableVariantContext, TableContentContext, TableRowContext };
