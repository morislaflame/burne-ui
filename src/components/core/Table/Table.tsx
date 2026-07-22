import { forwardRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";

import "@/components/core/utils/glossInteractive.css";

import { TableBody, TableCell, TableColumn, TableContent, TableFooter, TableHeader, TableRow, TableScrollContainer } from "./tableParts";
import { TableClassNamesProvider, TableVariantProvider } from "./tableContext";
import { TABLE_GLOSS_CONTENT_CLASS, tableRootClass } from "./tableStyles";
import type { TableProps } from "./tableTypes";
import { useTableRootState } from "./useTableRootState";

import { cn } from "@/utils/cn";

export type {
  TableProps,
  TableVariant,
  TableRowTone,
  TableScrollContainerProps,
  TableContentProps,
  TableHeaderProps,
  TableColumnProps,
  TableColumnRenderProps,
  TableColumnSortIconRenderProps,
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

export { TABLE_ROW_TONE_SURFACE } from "./tableStyles";

export const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  { variant: variantProp = "default", className, classNames, children, ...rest },
  ref,
) {
  const { variant, isGloss } = useTableRootState({ variant: variantProp });
  const setRootRef = useMergedGlossPanelRef(ref, isGloss);

  return (
    <TableVariantProvider variant={variant}>
      <TableClassNamesProvider classNames={classNames}>
        <div
          ref={setRootRef}
          className={tableRootClass({
            variant,
            slotClass: classNames?.root,
            className,
          })}
          {...rest}
        >
          {isGloss ? (
            <div className={cn(TABLE_GLOSS_CONTENT_CLASS, classNames?.glossContent)}>
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </TableClassNamesProvider>
    </TableVariantProvider>
  );
});

TableRoot.displayName = "TableRoot";

export {
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
};
