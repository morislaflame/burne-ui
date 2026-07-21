import { SEMANTIC_STATUS_OUTLINE_BORDER, SEMANTIC_STATUS_SURFACE_TINT, SEMANTIC_STATUS_TEXT } from "@/components/core/utils/semanticStatusSurface";
import { cn } from "@/utils/cn";

import type { AlertStatus, AlertVariant } from "./alertTypes";

export const ALERT_VARIANT_SURFACE: Record<Exclude<AlertVariant, "gloss">, string> = {
  default: "bg-surface border-token text-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

export function alertSurfaceClass(variant: AlertVariant, status: AlertStatus): string {
  if (variant === "gloss") {
    return cn(
      "gloss-panel border-0 text-foreground",
      status !== "default" ? SEMANTIC_STATUS_TEXT[status] : "",
    );
  }

  if (status === "default") return ALERT_VARIANT_SURFACE[variant];

  switch (variant) {
    case "default":
      return cn(SEMANTIC_STATUS_SURFACE_TINT[status], SEMANTIC_STATUS_TEXT[status]);
    case "outline":
      return cn(
        "bg-transparent",
        SEMANTIC_STATUS_OUTLINE_BORDER[status],
        SEMANTIC_STATUS_TEXT[status],
      );
    case "secondary":
      return cn("bg-secondary border-token", SEMANTIC_STATUS_TEXT[status]);
  }
}

export function alertIndicatorWrapperTextClass(status: AlertStatus): string {
  if (status !== "default") return SEMANTIC_STATUS_TEXT[status];
  return "text-primary";
}

export const ALERT_INDICATOR_BASE_CLASS = "inline-flex shrink-0 items-center justify-center";

export function alertIndicatorClass(status: AlertStatus, iconSvgClass: string): string {
  return cn(ALERT_INDICATOR_BASE_CLASS, iconSvgClass, alertIndicatorWrapperTextClass(status));
}

/** Compound slots (`Alert.Content`, `Alert.Message`) — pass-through grid children. */
export const ALERT_COMPOUND_CONTENTS_CLASS = "contents";

export const ALERT_TITLE_CLASS = "font-w-mid";

export const ALERT_DESCRIPTION_CLASS = "text-muted";
