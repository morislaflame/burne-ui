import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { IoChevronUp } from "react-icons/io5";

import { cn } from "@/utils/cn";
import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

import { TABLE_ROW_TONE_SURFACE, type TableRowTone } from "./tableRowToneSurface";

// ─── types ─────────────────────────────────────────────────────────────────

export type SortDirection = "ascending" | "descending";
export type SortDescriptor = { column: string; direction: SortDirection };
export type TableVariant = "default" | "secondary" | "toned";

export type { TableRowTone };
export type SelectionMode = "none" | "single" | "multiple";
export type Selection = Set<string | number> | "all";

const EMPTY_TABLE_SELECTION = new Set<string | number>();

export type TableColumnRenderProps = {
  sortDirection?: SortDirection;
};

const TONED_ROW_DEFAULT_TONE: TableRowTone = "secondary";

// ─── context ────────────────────────────────────────────────────────────────

type TableVariantCtx = TableVariant;
const TableVariantContext = createContext<TableVariantCtx>("default");
const useTableVariant = () => useContext(TableVariantContext);

type TableContentCtx = {
  selectionMode: SelectionMode;
  selectedKeys: Selection;
  onRowSelect: (key: string | number) => void;
  isRowSelected: (key: string | number) => boolean;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: ((d: SortDescriptor) => void) | undefined;
};

const TableContentContext = createContext<TableContentCtx>({
  selectionMode: "none",
  selectedKeys: new Set(),
  onRowSelect: () => {},
  isRowSelected: () => false,
  sortDescriptor: undefined,
  onSortChange: undefined,
});

const useTableContent = () => useContext(TableContentContext);

type TableRowContextValue = {
  tone: TableRowTone;
  isSelected: boolean;
};

const TableRowContext = createContext<TableRowContextValue | null>(null);

const useTableRow = () => useContext(TableRowContext);

// ─── variant styles ─────────────────────────────────────────────────────────

const ROOT_CLS: Record<TableVariant, string> = {
  default: "rounded-mid border-token bg-surface overflow-clip",
  secondary: "",
  toned: "overflow-visible bg-transparent",
};

const TABLE_CLS: Record<TableVariant, string> = {
  default: "border-collapse",
  secondary: "border-collapse",
  toned: "border-separate border-spacing-y-xsmall",
};

const THEAD_ROW_CLS: Record<TableVariant, string> = {
  default: "border-b-token",
  secondary: "border-b-token",
  toned: "",
};

const TH_CLS: Record<TableVariant, string> = {
  default:
    "bg-secondary px-large py-plus text-left font-medium text-secondary-foreground whitespace-nowrap",
  secondary: "px-large py-plus text-left font-medium text-secondary-foreground whitespace-nowrap",
  toned: "px-large py-plus text-left font-medium text-muted whitespace-nowrap bg-transparent",
};

const TBODY_ROW_CLS: Record<TableVariant, string> = {
  default: "border-b-token last:border-b-0",
  secondary: "border-b-token last:border-b-0",
  toned: "",
};

const TD_CLS: Record<TableVariant, string> = {
    default: "px-large py-plus",
  secondary: "px-large py-plus",
  toned: "px-large py-plus first:rounded-l-mid last:rounded-r-mid",
};

// ─── prop types ─────────────────────────────────────────────────────────────

export type TableProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TableVariant;
};

export type TableScrollContainerProps = HTMLAttributes<HTMLDivElement>;

export type TableContentProps = HTMLAttributes<HTMLTableElement> & {
  "aria-label"?: string;
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
};

export type TableHeaderProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((column: any) => ReactNode);
};

export type TableColumnProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "children"> & {
  id?: string;
  allowsSorting?: boolean;
  isRowHeader?: boolean;
  children?: ReactNode | ((props: TableColumnRenderProps) => ReactNode);
};

export type TableBodyProps = Omit<HTMLAttributes<HTMLTableSectionElement>, "children"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: ReactNode | ((item: any) => ReactNode);
  renderEmptyState?: () => ReactNode;
};

export type TableRowProps = Omit<HTMLAttributes<HTMLTableRowElement>, "id"> & {
  id?: string | number;
  /** Семантический фон строки (как у `Alert`). В `variant="toned"` — отдельная «карточка» на строку. */
  tone?: TableRowTone;
};

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export type TableFooterProps = HTMLAttributes<HTMLDivElement>;

// ─── Root ────────────────────────────────────────────────────────────────────

export const TableRoot = forwardRef<HTMLDivElement, TableProps>(function TableRoot(
  { variant = "default", className = "", children, ...rest },
  ref,
) {
  return (
    <TableVariantContext.Provider value={variant}>
      <div ref={ref} className={cn("w-full", ROOT_CLS[variant], className)} {...rest}>
        {children}
      </div>
    </TableVariantContext.Provider>
  );
});

// ─── ScrollContainer ─────────────────────────────────────────────────────────

export const TableScrollContainer = forwardRef<HTMLDivElement, TableScrollContainerProps>(
  function TableScrollContainer({ className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("w-full overflow-x-auto", className)}
        {...rest}
      />
    );
  },
);

// ─── Content (<table>) ───────────────────────────────────────────────────────

export const TableContent = forwardRef<HTMLTableElement, TableContentProps>(function TableContent(
  {
    selectionMode = "none",
    selectedKeys: selectedKeysProp,
    onSelectionChange,
    sortDescriptor,
    onSortChange,
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const variant = useTableVariant();

  const selectedKeys: Selection = selectedKeysProp ?? EMPTY_TABLE_SELECTION;

  const isRowSelected = useCallback(
    (key: string | number): boolean => {
      if (selectedKeys === "all") return true;
      return selectedKeys.has(key);
    },
    [selectedKeys],
  );

  const onRowSelect = useCallback(
    (key: string | number) => {
      if (selectionMode === "none" || !onSelectionChange) return;
      if (selectionMode === "single") {
        onSelectionChange(new Set([key]));
        return;
      }
      // multiple
      if (selectedKeys === "all") {
        onSelectionChange(new Set([key]));
        return;
      }
      const next = new Set(selectedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onSelectionChange(next);
    },
    [selectionMode, selectedKeys, onSelectionChange],
  );

  const ctx: TableContentCtx = useMemo(
    () => ({ selectionMode, selectedKeys, onRowSelect, isRowSelected, sortDescriptor, onSortChange }),
    [selectionMode, selectedKeys, onRowSelect, isRowSelected, sortDescriptor, onSortChange],
  );

  return (
    <TableContentContext.Provider value={ctx}>
      <table
        ref={ref}
        className={cn("w-full", TABLE_CLS[variant], className)}
        {...rest}
      >
        {children}
      </table>
    </TableContentContext.Provider>
  );
});

// ─── Header (<thead>) ────────────────────────────────────────────────────────

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ columns, children, className = "", ...rest }, ref) {
    const variant = useTableVariant();

    const content =
      columns && typeof children === "function"
        ? columns.map((col) => (children as (c: unknown) => ReactNode)(col))
        : (children as ReactNode);

    return (
      <thead ref={ref} className={className} {...rest}>
        <tr className={THEAD_ROW_CLS[variant]}>{content}</tr>
      </thead>
    );
  },
);

// ─── Column (<th>) ───────────────────────────────────────────────────────────

function TableSortChevron({ direction }: { direction: SortDirection | undefined }) {
  const chevronRef = useRef<HTMLSpanElement>(null);
  const bindChevronRef = useChevronRotation(direction === "descending", chevronRef, () => true);

  return (
    <span
      ref={bindChevronRef}
      aria-hidden
      className={cn(
        "shrink-0 origin-center",
        direction ? "text-primary opacity-100" : "opacity-0 group-hover/col:opacity-40 text-muted",
      )}
    >
      <IoChevronUp className="icon-xsmall" />
    </span>
  );
}

export const TableColumn = forwardRef<HTMLTableCellElement, TableColumnProps>(
  function TableColumn(
    { id, allowsSorting = false, isRowHeader = false, children, className = "", onClick, ...rest },
    ref,
  ) {
    const variant = useTableVariant();
    const { sortDescriptor, onSortChange } = useTableContent();

    const sortDirection: SortDirection | undefined =
      id && sortDescriptor?.column === id ? sortDescriptor.direction : undefined;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLTableCellElement>) => {
        onClick?.(e);
        if (!allowsSorting || !id || !onSortChange) return;
        onSortChange({
          column: id,
          direction:
            sortDescriptor?.column === id && sortDescriptor.direction === "ascending"
              ? "descending"
              : "ascending",
        });
      },
      [onClick, allowsSorting, id, onSortChange, sortDescriptor],
    );

    const content =
      typeof children === "function"
        ? (children as (p: TableColumnRenderProps) => ReactNode)({ sortDirection })
        : children;

    return (
      <th
        ref={ref}
        scope={isRowHeader ? "row" : "col"}
        aria-sort={
          allowsSorting
            ? sortDirection === "ascending"
              ? "ascending"
              : sortDirection === "descending"
                ? "descending"
                : "none"
            : undefined
        }
        data-allows-sorting={allowsSorting || undefined}
        className={cn(
          "group/col text-small",
          TH_CLS[variant],
          allowsSorting && cn("cursor-pointer select-none hover:text-foreground", TEXT_COLOR_TRANSITION),
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        <span className="inline-flex items-center gap-xsmall">
          <span className="min-w-0">{content}</span>
          {allowsSorting && <TableSortChevron direction={sortDirection} />}
        </span>
      </th>
    );
  },
);

// ─── Body (<tbody>) ──────────────────────────────────────────────────────────

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ items, children, renderEmptyState, className = "", ...rest }, ref) {
    let content: ReactNode;

    if (items !== undefined) {
      if (items.length === 0 && renderEmptyState) {
        const emptyState = renderEmptyState();
        content = (
          <tr>
            <td colSpan={9999} className="px-large py-xlarge text-center">
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
      <tbody ref={ref} className={className} {...rest}>
        {content}
      </tbody>
    );
  },
);

// ─── Row (<tr>) ──────────────────────────────────────────────────────────────

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ id, tone, children, className = "", onClick, ...rest }, ref) {
    const variant = useTableVariant();
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
      [resolvedTone, isSelected],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLTableRowElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented && isSelectable) onRowSelect(id!);
      },
      [onClick, isSelectable, id, onRowSelect],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (isSelectable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onRowSelect(id!);
        }
      },
      [isSelectable, id, onRowSelect],
    );

    return (
      <TableRowContext.Provider value={isToned || resolvedTone ? rowCtx : null}>
        <tr
          ref={ref}
          data-selected={isSelected || undefined}
          data-tone={resolvedTone}
          aria-selected={selectionMode !== "none" ? isSelected : undefined}
          tabIndex={isSelectable ? 0 : undefined}
          className={cn(
            "outline-none",
            TBODY_ROW_CLS[variant],
            !isToned &&
              isSelectable &&
              "cursor-pointer",
            isToned && isSelectable && "cursor-pointer",
            !isToned &&
              (isSelected
                ? "bg-default-hover"
                : hoverVariant()),
            isSelectable &&
              "focus-ring-inset",
            className,
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </tr>
      </TableRowContext.Provider>
    );
  },
);

// ─── Cell (<td>) ─────────────────────────────────────────────────────────────

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className = "", ...rest }, ref) {
    const variant = useTableVariant();
    const row = useTableRow();
    const isToned = variant === "toned";

    const toneSurface = row ? TABLE_ROW_TONE_SURFACE[row.tone] : undefined;

    return (
      <td
        ref={ref}
        className={cn(
          "text-small",
          TD_CLS[variant],
          isToned && toneSurface,
          isToned &&
            row?.isSelected &&
            "ring-2 ring-inset ring-primary",
          isToned &&
            !row?.isSelected &&
            "hover:brightness-[0.97] motion-reduce:hover:brightness-100",
          className,
        )}
        {...rest}
      />
    );
  },
);

// ─── Footer ──────────────────────────────────────────────────────────────────

export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(
  function TableFooter({ className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-base border-t-token px-mid py-plus",
          className,
        )}
        {...rest}
      />
    );
  },
);

// ─── compound export ──────────────────────────────────────────────────────────

