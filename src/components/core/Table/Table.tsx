import { forwardRef, useCallback, useMemo, type ForwardedRef } from "react";

import { TableBody, TableCaption, TableCell, TableColumn, TableContent, TableEmpty, TableFooter, TableHeader, TableHeaderRow, TableLabel, TableRow, TableScrollContainer } from "./tableParts";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useSkinRegistryRevision } from "@/skins/skinContext";

import { resolveTableMotionDefaults, useTableSlotMotion } from "./tableAnimations";
import { TableClassNamesProvider, TableMotionProvider, TableVariantProvider } from "./tableContext";
import { tableRootClass } from "./tableStyles";
import type { TableProps } from "./tableTypes";
import { useTableRootState } from "./useTableRootState";

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

export { TABLE_ROW_TONE_SURFACE } from "./tableStyles";

export const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  { variant: variantProp, className, classNames, children, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const { variant } = useTableRootState({ variant: variantProp });
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveTableMotionDefaults(variant);
  }, [skinRevision, variant]);

  return (
    <TableVariantProvider variant={variant}>
      <TableClassNamesProvider classNames={classNames}>
        <TableMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <TableRootSurface
            forwardedRef={ref}
            variant={variant}
            slotClass={classNames?.root}
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
  variant,
  slotClass,
  className,
  rest,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  variant: ReturnType<typeof useTableRootState>["variant"];
  slotClass?: string;
  className?: string;
  rest: Omit<TableProps, "variant" | "className" | "classNames" | "children" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">;
  children: TableProps["children"];
}) {
  const {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...domRest
  } = rest;
  const part = useTableSlotMotion<HTMLDivElement>("root", {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const setSlotRef = part.setRef;
  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      setSlotRef(node);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef, setSlotRef],
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
      {...dataVariantProps({ variant })}
    >
      {children}
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
  TableCaption,
  TableBody,
  TableEmpty,
  TableRow,
  TableCell,
  TableFooter,
};
