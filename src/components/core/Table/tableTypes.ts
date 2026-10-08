import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { TableRowTone } from "./tableStyles";
 
export type { TableRowTone };
 
export type SortDirection = "ascending" | "descending";
 
export type SortDescriptor = { column: string; direction: SortDirection };
 
export const KIT_TABLE_VARIANTS = ["default", "secondary", "toned"] as const;
export type KitTableVariant = (typeof KIT_TABLE_VARIANTS)[number];
export type TableVariant = KitTableVariant | (string & {});
 
export type SelectionMode = "none" | "single" | "multiple";
 
export type Selection = Set<string | number> | "all";
 
export type TableClassNames = {
  root?: string;
  scrollContainer?: string;
  content?: string;
  header?: string;
  headerRow?: string;
  column?: string;
  columnInner?: string;
  columnButton?: string;
  columnLabel?: string;
  columnSortIcon?: string;
  body?: string;
  row?: string;
  cell?: string;
  footer?: string;
  caption?: string;
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
};
 
export type TableMotion = {
  root?: TablePartMotion;
  scrollContainer?: TablePartMotion;
  content?: TablePartMotion;
  header?: TablePartMotion;
  headerRow?: TablePartMotion;
  body?: TablePartMotion;
  footer?: TablePartMotion;
  row?: TablePartMotion;
  column?: TablePartMotion;
  cell?: TablePartMotion;
  label?: TablePartMotion;
  columnSortIcon?: TablePartMotion;
  caption?: TablePartMotion;
  empty?: TablePartMotion;
};
 
export type TableProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TableVariant;
  classNames?: Prettify<TableClassNames>;
  /**
   * Per-slot motion (`root`, `scrollContainer`, `content`, `header`, `headerRow`, `body`, `footer`, `row`, `column`, `columnSortIcon`, `cell`, `label`, `caption`, `empty`).
 * `Content` is not a slot. `emptyCell` is CSS for `Table.Empty`. `columnSortIcon` rotates with `chevronRotate`.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<TableMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this table chrome scope (`root` / `header` / `column` …).
   * Nested `Table.Row` is a separate scope — pass its own handle. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
 
export type TableHeaderRowProps = HTMLAttributes<HTMLTableRowElement> & {
  motion?: Prettify<TablePartMotion>;
};
 
export type TableColumnRenderProps = {
  sortDirection?: SortDirection;
};
 
export type TableColumnSortIconRenderProps = {
  sortDirection?: SortDirection;
};
 
export type TableLabelProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<TablePartMotion>;
};

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement> & {
  motion?: Prettify<TablePartMotion>;
};
 
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
 
export type TableVirtualMove = {
  index: number;
  count: number;
  step: (from: number, delta: number) => void;
  jump: (index: number) => void;
};

export type TableBodyProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((item: any) => ReactNode);
  renderEmptyState?: () => ReactNode;
  /**
   * Mount only the visible `items` rows. The scrollport is the nearest
   * ancestor with `overflow-y: auto | scroll` (`Table.ScrollContainer`).
   */
  virtualized?: boolean;
  /** Fixed row height in px. Measured from the first row when omitted. */
  virtualItemSize?: number;
  motion?: Prettify<TablePartMotion>;
};
 
export type TableEmptyProps = TdHTMLAttributes<HTMLTableCellElement> & {
  motion?: Prettify<TablePartMotion>;
};
 
export type TableRowProps = Omit<HTMLAttributes<HTMLTableRowElement>, "id"> & {
  id?: string | number;
  tone?: TableRowTone;
  motion?: Prettify<TablePartMotion>;
  /**
   * Handle for this row's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("row")`. Cells live here (`playAll` on the row handle).
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
 