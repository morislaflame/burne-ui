import { SEMANTIC_STATUS_TEXT } from "@/components/core/utils/semanticStatusSurface";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { AlertStatus, AlertVariant, KitAlertVariant } from "./alertTypes";
import { KIT_ALERT_VARIANTS } from "./alertTypes";

export const ALERT_VARIANT_SURFACE: Record<KitAlertVariant, string> = {
  default: "bg-surface border-token text-foreground",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

/** Panel surface follows variant only; status colors the indicator (and AlertDialog mirrors this). */
export function alertSurfaceClass(variant: AlertVariant, _status: AlertStatus = "default"): string {
  const visual = resolveVariantVisual(variant, KIT_ALERT_VARIANTS, "alert.root");
  if (visual.className !== undefined) return visual.className;
  return ALERT_VARIANT_SURFACE[visual.key];
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

export function alertTitleClass(status: AlertStatus): string {
  return cn(
    ALERT_TITLE_CLASS,
    status !== "default" ? SEMANTIC_STATUS_TEXT[status] : "",
  );
}

export const ALERT_DESCRIPTION_CLASS = "text-muted";
