import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import type { TableRowTone } from "./tableStyles";

export type { TableRowTone };

export type SortDirection = "ascending" | "descending";

export type SortDescriptor = { column: string; direction: SortDirection };

export type TableVariant = "default" | "secondary" | "toned" | "gloss";

export type SelectionMode = "none" | "single" | "multiple";

export type Selection = Set<string | number> | "all";

export type TableClassNames = {
  root?: string;
  glossContent?: string;
  scrollContainer?: string;
  content?: string;
  header?: string;
  headerRow?: string;
  column?: string;
  columnInner?: string;
  columnLabel?: string;
  columnSortChevron?: string;
  body?: string;
  row?: string;
  cell?: string;
  footer?: string;
  emptyCell?: string;
};

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TableVariant;
  classNames?: TableClassNames;
};

export type UseTableRootStateProps = Pick<TableProps, "variant">;

export type TableScrollContainerProps = HTMLAttributes<HTMLDivElement>;

export type TableContentProps = HTMLAttributes<HTMLTableElement> & {
  "aria-label"?: string;
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
};

export type TableHeaderProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((column: any) => ReactNode);
};

export type TableHeaderRowProps = HTMLAttributes<HTMLTableRowElement>;

export type TableColumnRenderProps = {
  sortDirection?: SortDirection;
};

export type TableColumnSortIconRenderProps = {
  sortDirection?: SortDirection;
};

export type TableLabelProps = HTMLAttributes<HTMLSpanElement>;

export type TableColumnProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "children"> & {
  id?: string;
  allowsSorting?: boolean;
  isRowHeader?: boolean;
  /**
   * Replaces the default sort chevron. Pass `null` to hide.
   * Render prop receives the current `sortDirection`.
   */
  sortIcon?:
    | ReactNode
    | ((props: TableColumnSortIconRenderProps) => ReactNode);
  children?: ReactNode | ((props: TableColumnRenderProps) => ReactNode);
};

export type TableBodyProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((item: any) => ReactNode);
  renderEmptyState?: () => ReactNode;
};

export type TableRowProps = Omit<HTMLAttributes<HTMLTableRowElement>, "id"> & {
  id?: string | number;
  tone?: TableRowTone;
};

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export type TableFooterProps = HTMLAttributes<HTMLDivElement>;

export type TableContentContextValue = {
  selectionMode: SelectionMode;
  selectedKeys: Selection;
  onRowSelect: (key: string | number) => void;
  isRowSelected: (key: string | number) => boolean;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: ((d: SortDescriptor) => void) | undefined;
};

export type TableRowContextValue = {
  tone: TableRowTone;
  isSelected: boolean;
};

export type TableClassNamesProviderProps = {
  classNames?: TableClassNames;
  children: ReactNode;
};
