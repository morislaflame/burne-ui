import { Children, forwardRef, isValidElement, memo, useCallback, useLayoutEffect, useMemo, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { focusKeyboard } from "@/components/core/utils/focusElement";

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
import { hasTableLabel, resolveColumnSortDirection, resolveNextSortDescriptor, TABLE_ROW_KEY_ATTR, tableBumpRow, tableBumpSortButton, tableSelectableRows, tableSortButtons, TONED_ROW_DEFAULT_TONE } from "./tableAPI";
import { TableSortChevron } from "./tableAnimations";
import {
  TableContentProvider,
  TableRowProvider,
  useTableClassNames,
  useTableContent,
  useTableRow,
  useTableRowIsFocusTarget,
  useTableRowIsSelected,
  useTableVariant,
} from "./tableContext";
import { TABLE_BODY_EMPTY_CELL_CLASS, TABLE_COLUMN_INNER_CLASS, TABLE_FOOTER_CLASS, TABLE_HEADER_ROW_VARIANT_CLASS, TABLE_SCROLL_CONTAINER_CLASS, tableCellClass, tableColumnClass, tableColumnLabelClass, tableColumnSortButtonClass, tableContentClass, tableRowClass } from "./tableStyles";
import type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableColumnRenderProps,
  TableContentProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeaderRowProps,
  TableLabelProps,
  TableRowContextValue,
  TableRowProps,
  TableScrollContainerProps,
} from "./tableTypes";
import { useTableContentState } from "./useTableContentState";

import { cn } from "@/utils/cn";

function hasTableHeaderRow(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "Table.HeaderRow",
  );
}

export const TableScrollContainer = forwardRef<HTMLDivElement, TableScrollContainerProps>(
  function TableScrollContainer({ className, tabIndex, ...rest }, ref) {
    const slotClassNames = useTableClassNames();

    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        className={cn(
          TABLE_SCROLL_CONTAINER_CLASS,
          slotClassNames.scrollContainer,
          className,
        )}
        {...rest}
      />
    );
  },
);

TableScrollContainer.displayName = "TableScrollContainer";

export const TableContent = forwardRef<HTMLTableElement, TableContentProps>(
  function TableContent(
    {
      selectionMode = "none",
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      sortDescriptor,
      defaultSortDescriptor,
      onSortChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const variant = useTableVariant();
    const slotClassNames = useTableClassNames();
    const ctx = useTableContentState({
      selectionMode,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      sortDescriptor,
      defaultSortDescriptor,
      onSortChange,
    });

    return (
      <TableContentProvider value={ctx}>
        <table
          ref={ref}
          role={tableContentRole(selectionMode)}
          aria-multiselectable={tableAriaMultiSelectable(selectionMode)}
          className={tableContentClass({
            variant,
            slotClass: slotClassNames.content,
            className,
          })}
          {...rest}
        >
          {children}
        </table>
      </TableContentProvider>
    );
  },
);

TableContent.displayName = "TableContent";

export const TableHeaderRow = forwardRef<HTMLTableRowElement, TableHeaderRowProps>(
  function TableHeaderRow({ className, ...rest }, ref) {
    const variant = useTableVariant();
    const slotClassNames = useTableClassNames();
    const { selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);

    return (
      <tr
        ref={ref}
        role={tableRowRole(isGrid)}
        className={cn(
          TABLE_HEADER_ROW_VARIANT_CLASS[variant],
          slotClassNames.headerRow,
          className,
        )}
        {...rest}
      />
    );
  },
);

TableHeaderRow.displayName = "Table.HeaderRow";

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ columns, children, className, ...rest }, ref) {
    const slotClassNames = useTableClassNames();

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
        ref={ref}
        className={cn(slotClassNames.header, className)}
        {...rest}
      >
        {rows}
      </thead>
    );
  },
);

TableHeader.displayName = "TableHeader";

export const TableLabel = forwardRef<HTMLSpanElement, TableLabelProps>(
  function TableLabel({ className, ...rest }, ref) {
    const slotClassNames = useTableClassNames();

    return (
      <span
        ref={ref}
        className={tableColumnLabelClass({
          slotClass: slotClassNames.columnLabel,
          className,
        })}
        {...rest}
      />
    );
  },
);

TableLabel.displayName = "Table.Label";

export const TableColumn = forwardRef<HTMLTableCellElement, TableColumnProps>(
  function TableColumn(
    {
      id,
      allowsSorting = false,
      isRowHeader = false,
      sortIcon,
      children,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const variant = useTableVariant();
    const slotClassNames = useTableClassNames();
    const { sortDescriptor, onSortChange, selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);

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
    if (allowsSorting) {
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

    return (
      <th
        ref={ref}
        role={tableColumnHeaderRole(isGrid, isRowHeader)}
        scope={isRowHeader ? "row" : "col"}
        aria-sort={columnAriaSort(allowsSorting, sortDirection)}
        data-allows-sorting={allowsSorting || undefined}
        className={tableColumnClass({
          variant,
          allowsSorting,
          slotClass: slotClassNames.column,
          className,
        })}
        onClick={allowsSorting ? undefined : handleThClick}
        {...rest}
      >
        {allowsSorting ? (
          <button
            type="button"
            className={tableColumnSortButtonClass({
              slotClass: slotClassNames.columnInner,
            })}
            onClick={handleSortClick}
            onKeyDown={handleSortKeyDown}
          >
            {inner}
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
      </th>
    );
  },
);

TableColumn.displayName = "TableColumn";

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ items, children, renderEmptyState, className, ...rest }, ref) {
    const slotClassNames = useTableClassNames();
    const { selectionMode } = useTableContent();
    const isGrid = tableIsSelectableGrid(selectionMode);
    let content: ReactNode;

    if (items !== undefined) {
      if (items.length === 0 && renderEmptyState) {
        const emptyState = renderEmptyState();
        content = (
          <tr role={tableRowRole(isGrid)}>
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
        ref={ref}
        className={cn(slotClassNames.body, className)}
        {...rest}
      >
        {content}
      </tbody>
    );
  },
);

TableBody.displayName = "TableBody";

const TableRowInner = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { id, tone, children, className, onClick, onKeyDown, ...rest },
  ref,
) {
  const variant = useTableVariant();
  const slotClassNames = useTableClassNames();
  const {
    selectionMode,
    onRowSelect,
    setFocusedRowKey,
    claimFocusedRowKey,
  } = useTableContent();

  const isSelected = useTableRowIsSelected(id);
  const isRovingTarget = useTableRowIsFocusTarget(id);
  const isSelectable = selectionMode !== "none" && id !== undefined;
  const isGrid = tableIsSelectableGrid(selectionMode);
  const isToned = variant === "toned";
  const resolvedTone = tone ?? (isToned ? TONED_ROW_DEFAULT_TONE : undefined);

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
    [id, isSelectable, onKeyDown, onRowSelect, setFocusedRowKey],
  );

  return (
    <TableRowProvider value={isToned || resolvedTone ? rowCtx : null}>
      <tr
        ref={ref}
        role={tableRowRole(isGrid)}
        {...(id !== undefined ? { [TABLE_ROW_KEY_ATTR]: String(id) } : {})}
        data-selected={isSelected || undefined}
        data-tone={resolvedTone}
        aria-selected={rowAriaSelected(selectionMode, isSelected)}
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
        {...rest}
      >
        {children}
      </tr>
    </TableRowProvider>
  );
});

export const TableRow = memo(TableRowInner);

TableRow.displayName = "TableRow";

const TableCellInner = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...rest },
  ref,
) {
  const variant = useTableVariant();
  const slotClassNames = useTableClassNames();
  const row = useTableRow();
  const { selectionMode } = useTableContent();
  const isGrid = tableIsSelectableGrid(selectionMode);

  return (
    <td
      ref={ref}
      role={tableCellRole(isGrid)}
      className={tableCellClass({
        variant,
        tone: row?.tone,
        isSelected: row?.isSelected ?? false,
        slotClass: slotClassNames.cell,
        className,
      })}
      {...rest}
    />
  );
});

export const TableCell = memo(TableCellInner);

TableCell.displayName = "TableCell";

export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(function TableFooter(
  { className, ...rest },
  ref,
) {
  const slotClassNames = useTableClassNames();

  return (
    <div
      ref={ref}
      className={cn(TABLE_FOOTER_CLASS, slotClassNames.footer, className)}
      {...rest}
    />
  );
});

TableFooter.displayName = "TableFooter";
