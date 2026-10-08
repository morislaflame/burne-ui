import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { TableVariant, KitTableVariant } from "./tableTypes";
import { KIT_TABLE_VARIANTS } from "./tableTypes";

export const TABLE_ROOT_BASE_CLASS = "w-full";

export const TABLE_ROOT_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default: "rounded-mid border-token bg-surface overflow-clip",
  secondary: "",
  toned: "overflow-visible bg-transparent",
};

export const TABLE_SCROLL_CONTAINER_CLASS =
  "w-full overflow-x-auto overscroll-none outline-none focus-ring";

export const TABLE_VIRTUAL_SPACER_CELL_CLASS = "border-0 p-0";

export const TABLE_CONTENT_BASE_CLASS = "w-full";

export const TABLE_CONTENT_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default: "border-collapse",
  secondary: "border-collapse",
  toned: "border-separate border-spacing-y-xsmall",
};

export const TABLE_HEADER_ROW_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default: "border-b-token",
  secondary: "border-b-token",
  toned: "",
};

export const TABLE_COLUMN_BASE_CLASS = "group/col sticky top-0 z-10";

export const TABLE_COLUMN_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default:
    "bg-secondary px-large py-mid text-start text-secondary-foreground whitespace-nowrap",
  secondary: "px-large py-mid text-start text-secondary-foreground whitespace-nowrap",
  toned: "px-large py-mid text-start text-muted whitespace-nowrap bg-transparent",
};

export const TABLE_COLUMN_SORTABLE_CLASS = "select-none";

export const TABLE_COLUMN_SORT_BUTTON_CLASS =
  "sort-btn inline-flex w-full min-w-0 items-center gap-xsmall border-0 bg-transparent text-inherit cursor-pointer outline-none focus-ring-inset rounded-small hover:text-foreground -mx-large -my-mid px-large py-mid box-border";

/** Full-width row so `text-center` / `text-end` on the `<th>` moves the label with the cells. */
export const TABLE_COLUMN_INNER_CLASS =
  "inline-flex w-full items-center justify-start gap-xsmall group-[.text-center]/col:justify-center group-[.text-end]/col:justify-end";

export const TABLE_COLUMN_LABEL_CLASS = "min-w-0 text-small text-start font-w-mid";

export const TABLE_COLUMN_SORT_CHEVRON_BASE_CLASS = "shrink-0 origin-center";

export const TABLE_COLUMN_SORT_CHEVRON_ICON_CLASS = "icon-xsmall";

export const TABLE_COLUMN_SORT_CHEVRON_ACTIVE_CLASS = "text-primary opacity-100";

export const TABLE_COLUMN_SORT_CHEVRON_IDLE_CLASS =
  "opacity-0 group-hover/col:opacity-40 text-muted";

export const TABLE_BODY_EMPTY_CELL_CLASS = "px-large py-large text-center";

export const TABLE_ROW_BASE_CLASS = "outline-none";

export const TABLE_ROW_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default: "border-b-token last:border-b-0",
  secondary: "border-b-token last:border-b-0",
  toned: "",
};

export const TABLE_ROW_SELECTABLE_CLASS = "cursor-pointer";

export const TABLE_ROW_SELECTED_CLASS = "bg-default-hover";

export const TABLE_ROW_FOCUS_CLASS = "focus-ring-inset";

export const TABLE_CELL_BASE_CLASS = "text-small text-start";

export const TABLE_CELL_VARIANT_CLASS: Record<KitTableVariant, string> = {
  default: "px-large py-mid",
  secondary: "px-large py-mid",
  toned: "px-large py-mid first:rounded-s-mid last:rounded-e-mid",
};

export const TABLE_CELL_SELECTED_RING_CLASS = "ring-2 ring-inset ring-primary";

export const TABLE_CELL_TONED_HOVER_CLASS =
  "hover:brightness-[0.97] motion-reduce:hover:brightness-100";

export const TABLE_CAPTION_CLASS = "caption-top px-large py-small text-start text-small font-w-mid";

export const TABLE_FOOTER_CLASS =
  "flex flex-wrap items-center justify-between gap-base border-t-token px-large py-mid";

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
  outline: "bg-transparent border-token-outline text-foreground",
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
  const visual = resolveVariantVisual(variant, KIT_TABLE_VARIANTS, "table.root");
  return cn(
    TABLE_ROOT_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TABLE_ROOT_VARIANT_CLASS[visual.key],
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
  const visual = resolveVariantVisual(variant, KIT_TABLE_VARIANTS, "table.content");
  return cn(
    TABLE_CONTENT_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TABLE_CONTENT_VARIANT_CLASS[visual.key],
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
  const visual = resolveVariantVisual(variant, KIT_TABLE_VARIANTS, "table.column");
  return cn(
    TABLE_COLUMN_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TABLE_COLUMN_VARIANT_CLASS[visual.key],
    allowsSorting && cn(TABLE_COLUMN_SORTABLE_CLASS, TEXT_COLOR_TRANSITION),
    slotClass,
    className,
  );
}

export function tableColumnSortButtonClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    TABLE_COLUMN_SORT_BUTTON_CLASS,
    TABLE_COLUMN_INNER_CLASS,
    TEXT_COLOR_TRANSITION,
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
  const visual = resolveVariantVisual(variant, KIT_TABLE_VARIANTS, "table.row");
  return cn(
    TABLE_ROW_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TABLE_ROW_VARIANT_CLASS[visual.key],
    isSelectable && TABLE_ROW_SELECTABLE_CLASS,
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
  const visual = resolveVariantVisual(variant, KIT_TABLE_VARIANTS, "table.cell");
  const isToned = visual.key === "toned";
  const toneSurface = tone ? TABLE_ROW_TONE_SURFACE[tone] : undefined;

  return cn(
    TABLE_CELL_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TABLE_CELL_VARIANT_CLASS[visual.key],
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
