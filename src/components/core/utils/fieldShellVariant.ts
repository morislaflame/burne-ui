import type { ButtonVariant } from "@/components/core/Button/buttonTypes";
import { cn } from "@/utils/cn";

/** Shared visual variants for field shells (Input, TextArea, Select, ComboBox, TimeField, SearchInput). */
export type FieldShellVariant = "default" | "outline" | "secondary" | "gloss";

export type FieldShellFilledVariant = Exclude<FieldShellVariant, "gloss">;

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

export function resolveFieldShellSurfaceClass({
  variant,
  statusTinted,
  statusTintClass,
}: {
  variant: FieldShellVariant;
  statusTinted: boolean;
  statusTintClass: string;
}): string {
  if (variant === "gloss") return "gloss-control";

  if (statusTinted) {
    return cn(statusTintClass, "border-token");
  }

  if (variant === "outline") {
    return "bg-transparent border-token";
  }

  return cn(FIELD_SHELL_VARIANT_BG_CLASS[variant], "border-token");
}
