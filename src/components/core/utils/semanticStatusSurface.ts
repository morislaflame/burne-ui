import type { SemanticStatus } from "./semanticStatusIcons";

/** Semantic statuses with tint/fill/border (shared by Badge, Button, etc.). */
export type SemanticSurfaceStatus = "danger" | "success" | "info" | "warning";
 
export const SEMANTIC_STATUS_TEXT: Record<SemanticSurfaceStatus, string> = {
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};
 
export const SEMANTIC_STATUS_SURFACE_TINT: Record<SemanticSurfaceStatus, string> = {
  danger: "bg-surface-tint-danger border-token",
  success: "bg-surface-tint-success border-token",
  info: "bg-surface-tint-info border-token",
  warning: "bg-surface-tint-warning border-token",
};
 
export const SEMANTIC_STATUS_FILL: Record<SemanticSurfaceStatus, string> = {
  danger: "bg-danger border border-transparent text-danger-foreground",
  success: "bg-success border border-transparent text-success-foreground",
  info: "bg-info border border-transparent text-info-foreground",
  warning: "bg-warning border border-transparent text-warning-foreground",
};
 
export const SEMANTIC_STATUS_FILL_TEXT: Record<SemanticSurfaceStatus, string> = {
  danger: "text-danger-foreground",
  success: "text-success-foreground",
  info: "text-info-foreground",
  warning: "text-warning-foreground",
};
 
export const SEMANTIC_STATUS_BG: Record<SemanticSurfaceStatus, string> = {
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

/** Fill paint for Meter, ProgressBar, and Switch. `color` wins. `default` keeps the kit fill. */
export function semanticStatusBgClass(
  status: SemanticStatus | undefined,
  hasCustomColor: boolean,
): string | undefined {
  if (hasCustomColor || status == null || status === "default") return undefined;
  return SEMANTIC_STATUS_BG[status];
}

export const SEMANTIC_STATUS_OUTLINE_BORDER: Record<SemanticSurfaceStatus, string> = {
  danger: "border-token-danger",
  success: "border-token-success",
  info: "border-token-info",
  warning: "border-token-warning",
};
 