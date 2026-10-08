import { TableBody, TableCaption, TableCell, TableColumn, TableContent, TableEmpty, TableFooter, TableHeader, TableHeaderRow, TableLabel, TableRoot, TableRow, TableScrollContainer } from "./Table";
 
export const Table = Object.assign(TableRoot, {
  ScrollContainer: TableScrollContainer,
  Content: TableContent,
  Header: TableHeader,
  HeaderRow: TableHeaderRow,
  Column: TableColumn,
  Label: TableLabel,
  Caption: TableCaption,
  Body: TableBody,
  Empty: TableEmpty,
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
  TableCaptionProps,
  TableLabelProps,
  TableBodyProps,
  TableEmptyProps,
  TableRowProps,
  TableCellProps,
  TableFooterProps,
  SortDescriptor,
  SortDirection,
  SelectionMode,
  Selection,
  TableClassNames,
  TableMotion,
  TablePartMotion,
} from "./tableTypes";
 