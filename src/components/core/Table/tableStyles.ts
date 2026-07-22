import { hoverVariant, SURFACE_COLOR_TRANSITION, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import type { TableVariant } from "./tableTypes";

export const TABLE_ROOT_BASE_CLASS = "w-full";

export const TABLE_ROOT_VARIANT_CLASS: Record<TableVariant, string> = {
  default: "rounded-mid border-token bg-surface overflow-clip",
  secondary: "",
  toned: "overflow-visible bg-transparent",
  gloss: "gloss-panel gloss-deep rounded-mid overflow-clip border-0",
};

export const TABLE_GLOSS_CONTENT_CLASS = "gloss-content w-full min-w-0";

export const TABLE_SCROLL_CONTAINER_CLASS = "w-full overflow-x-auto";

export const TABLE_CONTENT_BASE_CLASS = "w-full";

export const TABLE_CONTENT_VARIANT_CLASS: Record<TableVariant, string> = {
  default: "border-collapse",
  secondary: "border-collapse",
  toned: "border-separate border-spacing-y-xsmall",
  gloss: "border-collapse",
};

export const TABLE_HEADER_ROW_VARIANT_CLASS: Record<TableVariant, string> = {
  default: "border-b-token",
  secondary: "border-b-token",
  toned: "",
  gloss: "border-b-token",
};

export const TABLE_COLUMN_BASE_CLASS = "group/col";

export const TABLE_COLUMN_VARIANT_CLASS: Record<TableVariant, string> = {
  default:
    "bg-secondary px-mid py-plus text-secondary-foreground whitespace-nowrap",
  secondary: "px-mid py-plus text-secondary-foreground whitespace-nowrap",
  toned: "px-mid py-plus text-muted whitespace-nowrap bg-transparent",
  gloss: "bg-transparent px-mid py-plus text-muted whitespace-nowrap",
};

export const TABLE_COLUMN_SORTABLE_CLASS =
  "cursor-pointer select-none hover:text-foreground";

export const TABLE_COLUMN_INNER_CLASS = "inline-flex items-center gap-xsmall";

export const TABLE_COLUMN_LABEL_CLASS = "min-w-0 text-small text-left font-w-mid";

export const TABLE_COLUMN_SORT_CHEVRON_BASE_CLASS = "shrink-0 origin-center";

export const TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS = "icon-xsmall";

export const TABLE_COLUMN_SORT_CHEVRON_ACTIVE_CLASS = "text-primary opacity-100";

export const TABLE_COLUMN_SORT_CHEVRON_IDLE_CLASS =
  "opacity-0 group-hover/col:opacity-40 text-muted";

export const TABLE_BODY_EMPTY_CELL_CLASS = "px-mid py-mid text-center";

export const TABLE_ROW_BASE_CLASS = "outline-none";

export const TABLE_ROW_VARIANT_CLASS: Record<TableVariant, string> = {
  default: "border-b-token last:border-b-0",
  secondary: "border-b-token last:border-b-0",
  toned: "",
  gloss: "border-b-token last:border-b-0",
};

export const TABLE_ROW_SELECTABLE_CLASS = "cursor-pointer";

export const TABLE_ROW_SELECTED_CLASS = "bg-default-hover";

export const TABLE_ROW_GLOSS_SELECTED_CLASS =
  "bg-primary-tint hover:bg-primary-tint-strong";

export const TABLE_ROW_GLOSS_HOVER_CLASS = cn(
  SURFACE_COLOR_TRANSITION,
  "hover:bg-primary-tint focus-visible:bg-primary-tint",
);

export const TABLE_ROW_FOCUS_CLASS = "focus-ring-inset";

export const TABLE_CELL_BASE_CLASS = "text-small";

export const TABLE_CELL_VARIANT_CLASS: Record<TableVariant, string> = {
  default: "px-mid py-plus",
  secondary: "px-mid py-plus",
  toned: "px-mid py-plus first:rounded-l-mid last:rounded-r-mid",
  gloss: "px-mid py-plus",
};

export const TABLE_CELL_SELECTED_RING_CLASS = "ring-2 ring-inset ring-primary";

export const TABLE_CELL_TONED_HOVER_CLASS =
  "hover:brightness-[0.97] motion-reduce:hover:brightness-100";

export const TABLE_FOOTER_CLASS =
  "flex flex-wrap items-center justify-between gap-base border-t-token px-mid py-plus";

export type TableRowTone =
  | "default"
  | "outline"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export const TABLE_ROW_TONE_SURFACE: Record<TableRowTone, string> = {
  default: "bg-surface text-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  danger: "bg-surface-tint-danger text-foreground",
  success: "bg-surface-tint-success text-foreground",
  info: "bg-surface-tint-info text-foreground",
  warning: "bg-surface-tint-warning text-foreground",
};

export function tableRootClass({
  variant,
  slotClass,
  className,
}: {
  variant: TableVariant;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    TABLE_ROOT_BASE_CLASS,
    TABLE_ROOT_VARIANT_CLASS[variant],
    slotClass,
    className,
  );
}

export function tableContentClass({
  variant,
  slotClass,
  className,
}: {
  variant: TableVariant;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    TABLE_CONTENT_BASE_CLASS,
    TABLE_CONTENT_VARIANT_CLASS[variant],
    slotClass,
    className,
  );
}

export function tableColumnClass({
  variant,
  allowsSorting,
  slotClass,
  className,
}: {
  variant: TableVariant;
  allowsSorting: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    TABLE_COLUMN_BASE_CLASS,
    TABLE_COLUMN_VARIANT_CLASS[variant],
    allowsSorting && cn(TABLE_COLUMN_SORTABLE_CLASS, TEXT_COLOR_TRANSITION),
    slotClass,
    className,
  );
}

export function tableColumnLabelClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(TABLE_COLUMN_LABEL_CLASS, slotClass, className);
}

export function tableRowClass({
  variant,
  isToned,
  isSelectable,
  isSelected,
  slotClass,
  className,
}: {
  variant: TableVariant;
  isToned: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    TABLE_ROW_BASE_CLASS,
    TABLE_ROW_VARIANT_CLASS[variant],
    isSelectable && TABLE_ROW_SELECTABLE_CLASS,
    variant === "gloss" &&
      !isToned &&
      (isSelected ? TABLE_ROW_GLOSS_SELECTED_CLASS : TABLE_ROW_GLOSS_HOVER_CLASS),
    variant !== "gloss" &&
      !isToned &&
      (isSelected ? TABLE_ROW_SELECTED_CLASS : hoverVariant()),
    isSelectable && TABLE_ROW_FOCUS_CLASS,
    slotClass,
    className,
  );
}

export function tableCellClass({
  variant,
  tone,
  isSelected,
  slotClass,
  className,
}: {
  variant: TableVariant;
  tone?: TableRowTone;
  isSelected: boolean;
  slotClass?: string;
  className?: string;
}): string {
  const isToned = variant === "toned";
  const toneSurface = tone ? TABLE_ROW_TONE_SURFACE[tone] : undefined;

  return cn(
    TABLE_CELL_BASE_CLASS,
    TABLE_CELL_VARIANT_CLASS[variant],
    isToned && toneSurface,
    isToned && isSelected && TABLE_CELL_SELECTED_RING_CLASS,
    isToned && !isSelected && TABLE_CELL_TONED_HOVER_CLASS,
    slotClass,
    className,
  );
}

export function tableSortChevronClass(active: boolean): string {
  return cn(
    TABLE_COLUMN_SORT_CHEVRON_BASE_CLASS,
    active ? TABLE_COLUMN_SORT_CHEVRON_ACTIVE_CLASS : TABLE_COLUMN_SORT_CHEVRON_IDLE_CLASS,
  );
}
