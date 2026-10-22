import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { GridAlign, GridColumns, GridGap, GridMinTrack } from "./gridTypes";

export const GRID_BASE_CLASS = "grid min-w-0";

export const GRID_COLUMNS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

export const GRID_AUTO_CLASS = {
  xsmall: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-xsmall)),1fr))]",
  small: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-small)),1fr))]",
  base: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-base)),1fr))]",
  mid: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-mid)),1fr))]",
  large: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-large)),1fr))]",
  xlarge: "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-xlarge)),1fr))]",
  "2xlarge": "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--max-component-2xlarge)),1fr))]",
} as const satisfies Record<GridMinTrack, string>;

export const GRID_GAP_CLASS = {
  xsmall: "gap-xsmall",
  small: "gap-small",
  base: "gap-base",
  mid: "gap-mid",
  large: "gap-large",
  xlarge: "gap-xlarge",
  "2xlarge": "gap-2xlarge",
  "3xlarge": "gap-3xlarge",
} as const satisfies Record<GridGap, string>;

export const GRID_ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const satisfies Record<GridAlign, string>;

export function gridRootClass({
  columns,
  minTrack,
  gap,
  align,
  slotClass,
  className,
}: {
  columns: GridColumns;
  minTrack: GridMinTrack;
  gap: GridGap;
  align: GridAlign;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    GRID_BASE_CLASS,
    columns === "auto" ? GRID_AUTO_CLASS[minTrack] : GRID_COLUMNS_CLASS[columns],
    GRID_GAP_CLASS[gap],
    GRID_ALIGN_CLASS[align],
    layoutTargetClass("grid.root"),
    slotClass,
    className,
  );
}
