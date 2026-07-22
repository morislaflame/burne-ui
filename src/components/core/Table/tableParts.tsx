import { Children, forwardRef, isValidElement, useCallback, useMemo, type MouseEvent, type ReactNode } from "react";

import { columnAriaSort, rowAriaSelected } from "./tableA11y";
import { hasTableLabel, resolveColumnSortDirection, resolveNextSortDescriptor, TONED_ROW_DEFAULT_TONE } from "./tableAPI";
import { TableSortChevron } from "./tableAnimations";
import { TableContentProvider, TableRowProvider, useTableClassNames, useTableContent, useTableRow, useTableVariant } from "./tableContext";
import { TABLE_BODY_EMPTY_CELL_CLASS, TABLE_COLUMN_INNER_CLASS, TABLE_FOOTER_CLASS, TABLE_HEADER_ROW_VARIANT_CLASS, TABLE_SCROLL_CONTAINER_CLASS, tableCellClass, tableColumnClass, tableColumnLabelClass, tableContentClass, tableRowClass } from "./tableStyles";
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
  function TableScrollContainer({ className, tabIndex = 0, ...rest }, ref) {
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

    return (
      <tr
        ref={ref}
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
    const { sortDescriptor, onSortChange } = useTableContent();

    const sortDirection = resolveColumnSortDirection(id, sortDescriptor);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLTableCellElement>) => {
        onClick?.(e);
        if (!allowsSorting || !id || !onSortChange) return;
        onSortChange(resolveNextSortDescriptor(id, sortDescriptor));
      },
      [allowsSorting, id, onClick, onSortChange, sortDescriptor],
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

    return (
      <th
        ref={ref}
        scope={isRowHeader ? "row" : "col"}
        aria-sort={columnAriaSort(allowsSorting, sortDirection)}
        data-allows-sorting={allowsSorting || undefined}
        className={tableColumnClass({
          variant,
          allowsSorting,
          slotClass: slotClassNames.column,
          className,
        })}
        onClick={handleClick}
        {...rest}
      >
        <span
          className={cn(
            TABLE_COLUMN_INNER_CLASS,
            slotClassNames.columnInner,
          )}
        >
          {labelBody}
          {sortIndicator}
        </span>
      </th>
    );
  },
);

TableColumn.displayName = "TableColumn";

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ items, children, renderEmptyState, className, ...rest }, ref) {
    const slotClassNames = useTableClassNames();
    let content: ReactNode;

    if (items !== undefined) {
      if (items.length === 0 && renderEmptyState) {
        const emptyState = renderEmptyState();
        content = (
          <tr>
            <td
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

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { id, tone, children, className, onClick, onKeyDown, ...rest },
  ref,
) {
  const variant = useTableVariant();
  const slotClassNames = useTableClassNames();
  const { selectionMode, isRowSelected, onRowSelect } = useTableContent();

  const isSelected = id !== undefined ? isRowSelected(id) : false;
  const isSelectable = selectionMode !== "none" && id !== undefined;
  const isToned = variant === "toned";
  const resolvedTone = tone ?? (isToned ? TONED_ROW_DEFAULT_TONE : undefined);

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
      if (!e.defaultPrevented && isSelectable) onRowSelect(id!);
    },
    [id, isSelectable, onClick, onRowSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (isSelectable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onRowSelect(id!);
      }
    },
    [id, isSelectable, onKeyDown, onRowSelect],
  );

  return (
    <TableRowProvider value={isToned || resolvedTone ? rowCtx : null}>
      <tr
        ref={ref}
        data-selected={isSelected || undefined}
        data-tone={resolvedTone}
        aria-selected={rowAriaSelected(selectionMode, isSelected)}
        tabIndex={isSelectable ? 0 : undefined}
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

TableRow.displayName = "TableRow";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...rest },
  ref,
) {
  const variant = useTableVariant();
  const slotClassNames = useTableClassNames();
  const row = useTableRow();

  return (
    <td
      ref={ref}
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
