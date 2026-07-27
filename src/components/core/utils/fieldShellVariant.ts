import type { ButtonVariant } from "@/components/core/Button/buttonTypes";
import type { SemanticSurfaceStatus } from "@/components/core/utils/semanticStatusSurface";
import { cn } from "@/utils/cn";

/** Shared visual variants for field shells (Input, TextArea, Select, ComboBox, TimeField, SearchInput). */
export type FieldShellVariant = "default" | "outline" | "secondary" | "gloss";

export type FieldShellFilledVariant = Exclude<FieldShellVariant, "gloss">;

export type FieldShellStatus = "default" | SemanticSurfaceStatus;

export const FIELD_SHELL_VARIANT_BG_CLASS: Record<FieldShellFilledVariant, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
  secondary: "bg-secondary",
};

export function fieldShellHoverVariantForShell(
  variant: FieldShellFilledVariant,
): "default" | "secondary" {
  return variant === "secondary" ? "secondary" : "default";
}

export function fieldShellVariantFromButtonGroup(
  groupVariant?: ButtonVariant,
): FieldShellFilledVariant | "gloss" {
  if (groupVariant === "gloss") return "gloss";
  if (groupVariant === "outline") return "outline";
  if (groupVariant === "secondary") return "secondary";
  return "default";
}

/**
 * Neutral variant surface + `border-token`.
 * Status accents live on the permanent status ring (`fieldShellFocusRingClass`), not the border.
 */
export function resolveFieldShellSurfaceClass({
  variant,
}: {
  variant: FieldShellVariant;
}): string {
  if (variant === "gloss") return "gloss-control";

  if (variant === "outline") {
    return "bg-transparent border-token";
  }

  return cn(FIELD_SHELL_VARIANT_BG_CLASS[variant], "border-token");
}
