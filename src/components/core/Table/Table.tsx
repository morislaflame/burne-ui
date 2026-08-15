import { forwardRef, useCallback, useMemo, type ForwardedRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";

import "@/components/core/utils/glossInteractive.css";

import { TableBody, TableCell, TableColumn, TableContent, TableFooter, TableHeader, TableHeaderRow, TableLabel, TableRow, TableScrollContainer } from "./tableParts";
import { resolveTableMotionDefaults, useTableSlotMotion } from "./tableAnimations";
import { TableClassNamesProvider, TableMotionProvider, TableVariantProvider } from "./tableContext";
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
  TableMotion,
  TablePartMotion,
} from "./tableTypes";

export { TABLE_ROW_TONE_SURFACE } from "./tableStyles";

export const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  { variant: variantProp = "default", className, classNames, children, motion, ...rest },
  ref,
) {
  const { variant, isGloss } = useTableRootState({ variant: variantProp });
  const motionDefaults = useMemo(() => resolveTableMotionDefaults(), []);

  return (
    <TableVariantProvider variant={variant}>
      <TableClassNamesProvider classNames={classNames}>
        <TableMotionProvider motion={motion} defaults={motionDefaults}>
          <TableRootSurface
            forwardedRef={ref}
            isGloss={isGloss}
            variant={variant}
            slotClass={classNames?.root}
            glossClass={classNames?.glossContent}
            className={className}
            rest={rest}
          >
            {children}
          </TableRootSurface>
        </TableMotionProvider>
      </TableClassNamesProvider>
    </TableVariantProvider>
  );
});

function TableRootSurface({
  forwardedRef,
  isGloss,
  variant,
  slotClass,
  glossClass,
  className,
  rest,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  isGloss: boolean;
  variant: ReturnType<typeof useTableRootState>["variant"];
  slotClass?: string;
  glossClass?: string;
  className?: string;
  rest: Omit<TableProps, "variant" | "className" | "classNames" | "children" | "motion">;
  children: TableProps["children"];
}) {
  const {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...domRest
  } = rest;
  const bindGlossRef = useMergedGlossPanelRef(forwardedRef, isGloss);
  const part = useTableSlotMotion<HTMLDivElement>("root", {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      part.setRef(node);
    },
    [bindGlossRef, part.setRef],
  );

  return (
    <div
      ref={setRootRef}
      className={tableRootClass({
        variant,
        slotClass,
        className,
      })}
      {...domRest}
      {...part.pointerHandlers}
    >
      {isGloss ? (
        <div className={cn(TABLE_GLOSS_CONTENT_CLASS, glossClass)}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

TableRoot.displayName = "TableRoot";

export {
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableHeaderRow,
  TableColumn,
  TableLabel,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
};
