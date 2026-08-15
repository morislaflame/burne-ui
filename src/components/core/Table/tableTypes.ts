import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

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
  columnSortIcon?: string;
  body?: string;
  row?: string;
  cell?: string;
  footer?: string;
  emptyCell?: string;
};

export type TablePartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  check?: MotionValue;
  uncheck?: MotionValue;
  change?: MotionValue;
};

export type TableMotion = {
  root?: TablePartMotion;
  scrollContainer?: TablePartMotion;
  content?: TablePartMotion;
  header?: TablePartMotion;
  footer?: TablePartMotion;
  row?: TablePartMotion;
  column?: TablePartMotion;
  cell?: TablePartMotion;
};

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TableVariant;
  classNames?: Prettify<TableClassNames>;
  /**
   * Per-slot motion (`root`, `scrollContainer`, `content`, `header`, `footer`, `row`, `column`, `cell`).
   * `glossContent` is not a slot. Sort chevron rotation is kit-internal. Defaults are empty.
   */
  motion?: Prettify<TableMotion>;
};

export type UseTableRootStateProps = Pick<TableProps, "variant">;

export type TableScrollContainerProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TablePartMotion>;
};

export type TableContentProps = HTMLAttributes<HTMLTableElement> & {
  "aria-label"?: string;
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  motion?: Prettify<TablePartMotion>;
};

export type TableHeaderProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((column: any) => ReactNode);
  motion?: Prettify<TablePartMotion>;
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
  motion?: Prettify<TablePartMotion>;
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
  motion?: Prettify<TablePartMotion>;
};

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  motion?: Prettify<TablePartMotion>;
};

export type TableFooterProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TablePartMotion>;
};

export type TableContentContextValue = {
  selectionMode: SelectionMode;
  onRowSelect: (key: string | number) => void;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: ((d: SortDescriptor) => void) | undefined;
  setFocusedRowKey: (key: string | number) => void;
  /** First selectable row claims initial tab stop. */
  claimFocusedRowKey: (key: string | number) => void;
  /** External store for per-row selection / roving focus (avoids N-row context churn). */
  rowStore: TableRowSelectionStore;
};

export type TableRowSelectionStore = {
  subscribeSelection: (onStoreChange: () => void) => () => void;
  subscribeFocus: (onStoreChange: () => void) => () => void;
  getSelectedKeys: () => Selection;
  isSelected: (key: string | number) => boolean;
  getFocusedRowKey: () => string | number | null;
  isFocusTarget: (key: string | number) => boolean;
  setSelectedKeys: (next: Selection) => void;
  setFocusedRowKey: (key: string | number) => void;
  claimFocusedRowKey: (key: string | number) => void;
};

export type TableRowContextValue = {
  tone: TableRowTone;
  isSelected: boolean;
};

export type TableClassNamesProviderProps = {
  classNames?: Prettify<TableClassNames>;
  children: ReactNode;
};
