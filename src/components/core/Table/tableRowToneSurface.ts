import type { AlertStatus } from "@/components/core/Alert/alertUtils";

export type TableRowTone = AlertStatus;

/** Фон строки — те же семантические тоны, что у `Alert`. */
export const TABLE_ROW_TONE_SURFACE: Record<TableRowTone, string> = {
  default: "bg-surface text-foreground",
  outline: "bordered-transparent text-foreground",
  secondary: "surface-secondary text-foreground",
  danger: "bg-surface-tint-danger text-foreground",
  success: "bg-surface-tint-success text-foreground",
  info: "bg-surface-tint-info text-foreground",
  warning: "bg-surface-tint-warning text-foreground",
};
