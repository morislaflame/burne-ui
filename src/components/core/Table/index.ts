import { TableBody, TableCell, TableColumn, TableContent, TableFooter, TableHeader, TableHeaderRow, TableLabel, TableRoot, TableRow, TableScrollContainer } from "./Table";

export const Table = Object.assign(TableRoot, {
  ScrollContainer: TableScrollContainer,
  Content: TableContent,
  Header: TableHeader,
  HeaderRow: TableHeaderRow,
  Column: TableColumn,
  Label: TableLabel,
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
  TableHeaderRowProps,
  TableColumnProps,
  TableColumnRenderProps,
  TableColumnSortIconRenderProps,
  TableLabelProps,
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
