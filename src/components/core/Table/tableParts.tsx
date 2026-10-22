import { Children, forwardRef, isValidElement, memo, useCallback, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode, type RefAttributes } from "react";
 
import { focusKeyboard } from "@/components/core/utils/focusElement";
import { dataFlag } from "@/components/core/utils/dataContract";
import { mergeMotionSlotMaps } from "@/components/core/utils/slotMotion";
 
import {
  columnAriaSort,
  rowAriaSelected,
  tableAriaMultiSelectable,
  tableCellRole,
  tableColumnHeaderRole,
  tableContentRole,
  tableIsSelectableGrid,
  tableRowRole,
} from "./tableA11y";
import { hasTableLabel, isTableEmptyElement, resolveColumnSortDirection, resolveNextSortDescriptor, TABLE_ROW_KEY_ATTR, TABLE_VIRTUAL_INDEX_ATTR, moveVirtualTableRow, tableBumpRow, tableBumpSortButton, tableSelectableRows, tableSortButtons, TONED_ROW_DEFAULT_TONE } from "./tableAPI";
import { TableSortChevron, useTableRowSelectionMotion, useTableSlotMotion } from "./tableAnimations";
import {
  TableMotionProvider,
  TableRowProvider,
  useOptionalTableMotionScope,
  useTableClassNames,
  useTableContent,
  useTableMotionScope,
  useTableRow,
  useTableRowIsFocusTarget,
  useTableRowIsSelected,
  useTableSize,
  useTableVariant,
  useTableVirtual,
} from "./tableContext";
import { TABLE_BODY_EMPTY_CELL_CLASS, TABLE_CAPTION_CLASS, TABLE_COLUMN_INNER_CLASS, TABLE_COLUMN_MIN_WIDTH, TABLE_COLUMN_RESIZE_HANDLE_CLASS, TABLE_FOOTER_CLASS, TABLE_HEADER_ROW_VARIANT_CLASS, TABLE_SCROLL_CONTAINER_CLASS, TABLE_SCROLL_STICKY_CLASS, tableCellClass, tableColumnClass, tableColumnLabelClass, tableColumnSortButtonClass, tableContentClass, tableRowClass } from "./tableStyles";
import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableColumnRenderProps,
  TableContentProps,
  TableCaptionProps,
  TableEmptyProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeaderRowProps,
  TableLabelProps,
  TableRowContextValue,
  TableRowProps,
  TableScrollContainerProps,
} from "./tableTypes";
import { TableVirtualRows } from "./tableVirtualRows";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { formatBurneLabel } from "@/theme/burneLabels";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
import { cn } from "@/utils/cn";
 
function hasTableHeaderRow(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "Table.HeaderRow",
  );
}
 
export const TableScrollContainer = forwardRef<HTMLDivElement, TableScrollContainerProps>(
  function TableScrollContainer(
    {
      className,
      tabIndex,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const { stickyHeader } = useTableContent();
    const part = useTableSlotMotion<HTMLDivElement>("scrollContainer", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <div
        ref={part.setRef}
        tabIndex={tabIndex}
        className={cn(
          TABLE_SCROLL_CONTAINER_CLASS,
          stickyHeader && TABLE_SCROLL_STICKY_CLASS,
          slotClassNames.scrollContainer,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
TableScrollContainer.displayName = "TableScrollContainer";
 
export const TableContent = forwardRef<HTMLTableElement, TableContentProps>(
  function TableContent(
    {
      className,
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const variant = useTableVariant();
    const slotClassNames = useTableClassNames();
    const { selectionMode, columnResize } = useTableContent();
    const part = useTableSlotMotion<HTMLTableElement>("content", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
        <table
          ref={part.setRef}
          role={tableContentRole(selectionMode)}
          aria-multiselectable={tableAriaMultiSelectable(selectionMode)}
          className={tableContentClass({
            variant,
            columnResize,
            slotClass: slotClassNames.content,
            className,
          })}
          {...rest}
          {...part.pointerHandlers}
        >
          {children}
        </table>
    );
  },
);
 
TableContent.displayName = "TableContent";
 
export const TableHeaderRow = forwardRef<HTMLTableRowElement, TableHeaderRowProps>(
  function TableHeaderRow(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const variant = useTableVariant();
    const slotClassNames = useTableClassNames();
    const { selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);
    const part = useTableSlotMotion<HTMLTableRowElement>("headerRow", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <tr
        ref={part.setRef}
        role={tableRowRole(isGrid)}
        className={cn(
          TABLE_HEADER_ROW_VARIANT_CLASS[(variant in TABLE_HEADER_ROW_VARIANT_CLASS ? variant : "default") as keyof typeof TABLE_HEADER_ROW_VARIANT_CLASS],
          slotClassNames.headerRow,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
TableHeaderRow.displayName = "Table.HeaderRow";
 
const TableHeaderForward = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(
    {
      columns,
      children,
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const part = useTableSlotMotion<HTMLTableSectionElement>("header", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    const content =
      columns && typeof children === "function"
        ? columns.map((col) => (children as (c: unknown) => ReactNode)(col))
        : (children as ReactNode);
 
    const rows = hasTableHeaderRow(content) ? (
      content
    ) : (
      <TableHeaderRow>{content}</TableHeaderRow>
    );
 
    return (
      <thead
        ref={part.setRef}
        className={cn(slotClassNames.header, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {rows}
      </thead>
    );
  },
);
 
TableHeaderForward.displayName = "TableHeader";

export const TableHeader = TableHeaderForward as unknown as <TColumn>(
  props: TableHeaderProps<TColumn> & RefAttributes<HTMLTableSectionElement>,
) => ReactElement | null;
 
export const TableLabel = forwardRef<HTMLSpanElement, TableLabelProps>(
  function TableLabel(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const part = useTableSlotMotion<HTMLSpanElement>("label", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <span
        ref={part.setRef}
        className={tableColumnLabelClass({
          slotClass: slotClassNames.columnLabel,
          className,
        })}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
TableLabel.displayName = "Table.Label";
 
export const TableColumn = forwardRef<HTMLTableCellElement, TableColumnProps>(
  function TableColumn(
    {
      id,
      sortable = false,
      rowHeader = false,
      sortIcon,
      children,
      className,
      onClick,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const variant = useTableVariant();
    const size = useTableSize();
    const slotClassNames = useTableClassNames();
    const { sortDescriptor, onSortChange, selectionMode, stickyHeader, columnResize, columnWidths, setColumnWidth } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);
    const part = useTableSlotMotion<HTMLTableCellElement>("column", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    const sortDirection = resolveColumnSortDirection(id, sortDescriptor);
 
    const handleSortClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e as unknown as MouseEvent<HTMLTableCellElement>);
        if (!id || !onSortChange) return;
        onSortChange(resolveNextSortDescriptor(id, sortDescriptor));
      },
      [id, onClick, onSortChange, sortDescriptor],
    );
 
    const handleSortKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        const buttons = tableSortButtons(e.currentTarget);
        const next = tableBumpSortButton(
          buttons,
          e.currentTarget,
          e.key === "ArrowRight" ? 1 : -1,
        );
        if (!next || next === e.currentTarget) return;
        e.preventDefault();
        focusKeyboard(next);
      },
      [],
    );
 
    const handleThClick = useCallback(
      (e: MouseEvent<HTMLTableCellElement>) => {
        onClick?.(e);
      },
      [onClick],
    );
 
    const content =
      typeof children === "function"
        ? (children as (p: TableColumnRenderProps) => ReactNode)({ sortDirection })
        : children;
 
    const labelBody = hasTableLabel(content) ? (
      content
    ) : (
      <TableLabel>{content}</TableLabel>
    );
 
    let sortIndicator: ReactNode = null;
    if (sortable) {
      if (sortIcon !== undefined) {
        sortIndicator =
          typeof sortIcon === "function"
            ? sortIcon({ sortDirection })
            : sortIcon;
      } else {
        sortIndicator = <TableSortChevron direction={sortDirection} />;
      }
    }
 
    const inner = (
      <>
        {labelBody}
        {sortIndicator}
      </>
    );

    const labels = useBurneLabels();
    const showResize = columnResize && id != null;
    const width = id ? columnWidths[id] : undefined;
    const headerName = typeof children === "string" ? children : undefined;
    const resizeLabel = headerName
      ? formatBurneLabel(labels.resizeColumnNamed, { name: headerName })
      : labels.resizeColumn;
    const columnRef = useRef<HTMLTableCellElement | null>(null);
    const [columnMax, setColumnMax] = useState<number | undefined>();
    useLayoutEffect(() => {
      const table = columnRef.current?.closest("table");
      if (!table) return;
      const next = Math.round(table.getBoundingClientRect().width);
      if (next > 0) setColumnMax(next);
    }, [width]);
    const dragRef = useRef<{ x: number; width: number } | null>(null);
    const onResizePointerDown = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (!id) return;
        event.preventDefault();
        event.stopPropagation();
        const host = event.currentTarget.parentElement;
        const start = width ?? host?.getBoundingClientRect().width ?? TABLE_COLUMN_MIN_WIDTH;
        dragRef.current = { x: event.clientX, width: start };
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      [id, width],
    );
    const onResizePointerMove = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current || !id) return;
        const host = event.currentTarget.parentElement;
        const sign = host && isRtlElement(host) ? -1 : 1;
        const next = Math.max(
          TABLE_COLUMN_MIN_WIDTH,
          Math.round(dragRef.current.width + sign * (event.clientX - dragRef.current.x)),
        );
        setColumnWidth(id, next);
      },
      [id, setColumnWidth],
    );
    const endResize = useCallback(() => {
      dragRef.current = null;
    }, []);
    const onResizeKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (!id) return;
        const host = event.currentTarget.parentElement;
        const rtl = host ? isRtlElement(host) : false;
        const delta =
          event.key === "ArrowRight" ? (rtl ? -8 : 8) : event.key === "ArrowLeft" ? (rtl ? 8 : -8) : 0;
        if (delta === 0) return;
        event.preventDefault();
        event.stopPropagation();
        const start = width ?? host?.getBoundingClientRect().width ?? TABLE_COLUMN_MIN_WIDTH;
        setColumnWidth(id, Math.max(TABLE_COLUMN_MIN_WIDTH, Math.round(start + delta)));
      },
      [id, setColumnWidth, width],
    );
 
    return (
      <th
        ref={(node) => {
          columnRef.current = node;
          part.setRef(node);
        }}
        role={tableColumnHeaderRole(isGrid, rowHeader)}
        scope={rowHeader ? "row" : "col"}
        aria-sort={columnAriaSort(sortable, sortDirection)}
        className={tableColumnClass({
          size,
          variant,
          sortable,
          stickyHeader,
          resizable: showResize,
          slotClass: slotClassNames.column,
          className,
        })}
        onClick={sortable ? undefined : handleThClick}
        {...rest}
        {...part.pointerHandlers}
        style={width != null ? { ...rest.style, width: `${width}px` } : rest.style}
      >
        {sortable ? (
          <button
            type="button"
            className={tableColumnSortButtonClass({
              slotClass: slotClassNames.columnButton,
            })}
            onClick={handleSortClick}
            onKeyDown={handleSortKeyDown}
          >
            <span className={cn(TABLE_COLUMN_INNER_CLASS, slotClassNames.columnInner)}>
              {inner}
            </span>
          </button>
        ) : (
          <span
            className={cn(
              TABLE_COLUMN_INNER_CLASS,
              slotClassNames.columnInner,
            )}
          >
            {inner}
          </span>
        )}
        {showResize ? (
          // role=separator is the column-resize widget (same pattern as Resizable.Handle).
          /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
          <div
            role="separator"
            aria-label={resizeLabel}
            aria-orientation="vertical"
            aria-valuemin={TABLE_COLUMN_MIN_WIDTH}
            aria-valuemax={columnMax}
            aria-valuenow={width != null ? Math.round(width) : undefined}
            tabIndex={0}
            className={TABLE_COLUMN_RESIZE_HANDLE_CLASS}
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onLostPointerCapture={endResize}
            onKeyDown={onResizeKeyDown}
          />
          /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
        ) : null}
      </th>
    );
  },
);
 
TableColumn.displayName = "TableColumn";
 
const TableBodyForward = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(
    {
      items,
      children,
      renderEmptyState,
      virtualized = false,
      virtualItemSize,
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const { selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);
    const bodyRef = useRef<HTMLTableSectionElement | null>(null);
    const part = useTableSlotMotion<HTMLTableSectionElement>("body", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const setSlotRef = part.setRef;
    const setBodyRef = useCallback(
      (node: HTMLTableSectionElement | null) => {
        bodyRef.current = node;
        setSlotRef(node);
      },
      [setSlotRef],
    );
    const virtualOn = virtualized && items !== undefined && typeof children === "function";
    let content: ReactNode;

    if (virtualOn) {
      content = (
        <TableVirtualRows
          items={items}
          renderItem={children as (item: unknown) => ReactNode}
          itemSizeProp={virtualItemSize}
          bodyRef={bodyRef}
        />
      );
    } else if (items !== undefined) {
      if (items.length === 0 && renderEmptyState) {
        const emptyState = renderEmptyState();
        content = (
          <tr role={tableRowRole(isGrid)}>
            {isTableEmptyElement(emptyState) ? (
              emptyState
            ) : (
              <td
                role={tableCellRole(isGrid)}
                colSpan={9999}
                className={cn(
                  TABLE_BODY_EMPTY_CELL_CLASS,
                  slotClassNames.emptyCell,
                )}
              >
                {emptyState}
              </td>
            )}
          </tr>
        );
      } else if (typeof children === "function") {
        content = items.map(children as (item: unknown) => ReactNode);
      }
    } else {
      content = children as ReactNode;
    }
 
    return (
      <tbody
        ref={setBodyRef}
        className={cn(slotClassNames.body, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {content}
      </tbody>
    );
  },
);
 
TableBodyForward.displayName = "TableBody";

export const TableBody = TableBodyForward as unknown as <TItem>(
  props: TableBodyProps<TItem> & RefAttributes<HTMLTableSectionElement>,
) => ReactElement | null;
 
export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  function TableEmpty(
    {
      className,
      motion,
      colSpan = 9999,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const { selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);
    const part = useTableSlotMotion<HTMLTableCellElement>("empty", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <td
        ref={part.setRef}
        role={tableCellRole(isGrid)}
        colSpan={colSpan}
        className={cn(
          TABLE_BODY_EMPTY_CELL_CLASS,
          slotClassNames.emptyCell,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
TableEmpty.displayName = "Table.Empty";
 
const TableRowInner = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { id, tone, children, className, onClick, onKeyDown, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const parentScope = useOptionalTableMotionScope();
  const mergedMotion = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { row: motion } : undefined,
  );
 
  return (
    <TableMotionProvider motion={mergedMotion} defaults={{}} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <TableRowSurface
        id={id}
        tone={tone}
        className={className}
        onClick={onClick}
        onKeyDown={onKeyDown}
        itemMotion={motion}
        forwardedRef={ref}
        rest={rest}
      >
        {children}
      </TableRowSurface>
    </TableMotionProvider>
  );
});
 
function TableRowSurface({
  id,
  tone,
  children,
  className,
  onClick,
  onKeyDown,
  itemMotion,
  forwardedRef,
  rest,
}: {
  id?: string | number;
  tone?: TableRowProps["tone"];
  children?: ReactNode;
  className?: string;
  onClick?: TableRowProps["onClick"];
  onKeyDown?: TableRowProps["onKeyDown"];
  itemMotion?: TableRowProps["motion"];
  forwardedRef: ForwardedRef<HTMLTableRowElement>;
  rest: Omit<TableRowProps, "id" | "tone" | "children" | "className" | "onClick" | "onKeyDown" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">;
}) {
  const variant = useTableVariant();
  const slotClassNames = useTableClassNames();
  const {
    selectionMode,
    onRowSelect,
    setFocusedRowKey,
    claimFocusedRowKey,
    isRowDisabled,
  } = useTableContent();
  const scope = useTableMotionScope();
  const {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...domRest
  } = rest;
  const part = useTableSlotMotion<HTMLTableRowElement>("row", {
    motion: itemMotion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  const isDisabled = id !== undefined && isRowDisabled(id);
  const isSelected = useTableRowIsSelected(id) && !isDisabled;
  const isRovingTarget = useTableRowIsFocusTarget(id);
  const virtualMove = useTableVirtual();
  const isSelectable = selectionMode !== "none" && id !== undefined && !isDisabled;
  const isGrid = tableIsSelectableGrid(selectionMode);
  const isToned = variant === "toned";
  const resolvedTone = tone ?? (isToned ? TONED_ROW_DEFAULT_TONE : undefined);
  useTableRowSelectionMotion(scope, isSelected, part.targetRef);
 
  useLayoutEffect(() => {
    if (!isSelectable || id === undefined) return;
    claimFocusedRowKey(id);
  }, [claimFocusedRowKey, id, isSelectable]);
 
  const rowCtx = useMemo(
    (): TableRowContextValue => ({
      tone: resolvedTone ?? TONED_ROW_DEFAULT_TONE,
      isSelected,
    }),
    [isSelected, resolvedTone],
  );
 
  const handleClick = useCallback(
    (e: MouseEvent<HTMLTableRowElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !isSelectable || id === undefined) return;
      setFocusedRowKey(id);
      onRowSelect(id);
    },
    [id, isSelectable, onClick, onRowSelect, setFocusedRowKey],
  );
 
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableRowElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !isSelectable || id === undefined) return;
 
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setFocusedRowKey(id);
        onRowSelect(id);
        return;
      }

      if (virtualMove && moveVirtualTableRow(e.key, virtualMove)) {
        e.preventDefault();
        return;
      }

      const table = e.currentTarget.closest("table");
      if (!table) return;
      const rows = tableSelectableRows(table);
 
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = tableBumpRow(
          rows,
          e.currentTarget,
          e.key === "ArrowDown" ? 1 : -1,
        );
        if (!next) return;
        const nextKey = next.getAttribute(TABLE_ROW_KEY_ATTR);
        if (nextKey == null) return;
        setFocusedRowKey(nextKey);
        focusKeyboard(next);
        return;
      }
 
      if (e.key === "Home") {
        e.preventDefault();
        const first = rows[0];
        if (!first) return;
        const key = first.getAttribute(TABLE_ROW_KEY_ATTR);
        if (key == null) return;
        setFocusedRowKey(key);
        focusKeyboard(first);
        return;
      }
 
      if (e.key === "End") {
        e.preventDefault();
        const last = rows[rows.length - 1];
        if (!last) return;
        const key = last.getAttribute(TABLE_ROW_KEY_ATTR);
        if (key == null) return;
        setFocusedRowKey(key);
        focusKeyboard(last);
      }
    },
    [id, isSelectable, onKeyDown, onRowSelect, setFocusedRowKey, virtualMove],
  );
 
  return (
    <TableRowProvider value={isToned || resolvedTone ? rowCtx : null}>
      <tr
        ref={part.setRef}
        role={tableRowRole(isGrid)}
        {...(id !== undefined ? { [TABLE_ROW_KEY_ATTR]: String(id) } : {})}
        aria-selected={rowAriaSelected(selectionMode, isSelected)}
        aria-disabled={isDisabled || undefined}
        tabIndex={isSelectable ? (isRovingTarget ? 0 : -1) : undefined}
        className={tableRowClass({
          variant,
          isToned,
          isSelectable,
          isSelected,
          slotClass: slotClassNames.row,
          className,
        })}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...domRest}
        {...part.pointerHandlers}
        {...(virtualMove ? { [TABLE_VIRTUAL_INDEX_ATTR]: String(virtualMove.index) } : {})}
        data-selected={isSelected || undefined}
        data-disabled={dataFlag(isDisabled)}
        data-variant={resolvedTone || undefined}
        data-state={isSelected ? "selected" : undefined}
      >
        {children}
      </tr>
    </TableRowProvider>
  );
}
 
export const TableRow = memo(TableRowInner);
 
TableRow.displayName = "TableRow";
 
const TableCellInner = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {
    className,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const variant = useTableVariant();
  const size = useTableSize();
  const slotClassNames = useTableClassNames();
  const row = useTableRow();
  const { selectionMode } = useTableContent();
  const isGrid = tableIsSelectableGrid(selectionMode);
  const part = useTableSlotMotion<HTMLTableCellElement>("cell", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  return (
    <td
      ref={part.setRef}
      role={tableCellRole(isGrid)}
      className={tableCellClass({
        size,
        variant,
        tone: row?.tone,
        isSelected: row?.isSelected ?? false,
        slotClass: slotClassNames.cell,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
    />
  );
});
 
export const TableCell = memo(TableCellInner);
 
TableCell.displayName = "TableCell";
 
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTableClassNames();
    const part = useTableSlotMotion<HTMLTableCaptionElement>("caption", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    return (
      <caption
        ref={part.setRef}
        className={cn(TABLE_CAPTION_CLASS, slotClassNames.caption, className)}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);

TableCaption.displayName = "Table.Caption";

export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(function TableFooter(
  {
    className,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const slotClassNames = useTableClassNames();
  const part = useTableSlotMotion<HTMLDivElement>("footer", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
 
  return (
    <div
      ref={part.setRef}
      className={cn(TABLE_FOOTER_CLASS, slotClassNames.footer, className)}
      {...rest}
      {...part.pointerHandlers}
    />
  );
});
 
TableFooter.displayName = "TableFooter";
 