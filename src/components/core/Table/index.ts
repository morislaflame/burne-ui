import {
  TableBody,
  TableCell,
  TableColumn,
  TableContent,
  TableFooter,
  TableHeader,
  TableRoot,
  TableRow,
  TableScrollContainer,
} from "./Table";

export const Table = Object.assign(TableRoot, {
  ScrollContainer: TableScrollContainer,
  Content: TableContent,
  Header: TableHeader,
  Column: TableColumn,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Footer: TableFooter,
});

export { TABLE_ROW_TONE_SURFACE } from "./tableStyles";

export type {
  TableProps,
  TableVariant,
  TableRowTone,
  TableScrollContainerProps,
  TableContentProps,
  TableHeaderProps,
  TableColumnProps,
  TableColumnRenderProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableFooterProps,
  SortDescriptor,
  SortDirection,
  SelectionMode,
  Selection,
  TableClassNames,
} from "./tableTypes";
