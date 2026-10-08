import type { ButtonVariant } from "@/components/core/Button/buttonTypes";
import { isKitVariant } from "@/skins/resolveVariantVisual";
import type { SemanticSurfaceStatus } from "@/components/core/utils/semanticStatusSurface";
import { cn } from "@/utils/cn";

/** Kit visual variants for field shells (Input, TextArea, Select, ComboBox, TimeField, SearchInput). */
export const KIT_FIELD_SHELL_VARIANTS = ["default", "outline", "secondary"] as const;
export type KitFieldShellVariant = (typeof KIT_FIELD_SHELL_VARIANTS)[number];
export type FieldShellVariant = KitFieldShellVariant | (string & {});

export type FieldShellFilledVariant = KitFieldShellVariant;

export type FieldShellStatus = "default" | SemanticSurfaceStatus;

export const FIELD_SHELL_VARIANT_BG_CLASS: Record<KitFieldShellVariant, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
  secondary: "bg-secondary",
};

export function fieldShellHoverVariantForShell(
  variant: KitFieldShellVariant,
): "default" | "secondary" {
  return variant === "secondary" ? "secondary" : "default";
}

export function fieldShellVariantFromButtonGroup(
  groupVariant?: ButtonVariant,
): FieldShellVariant {
  if (!groupVariant) return "default";
  if (groupVariant === "outline") return "outline";
  if (groupVariant === "secondary") return "secondary";
  // Non-kit button variants (skins) pass through as the field shell variant name.
  if (!isKitVariant(groupVariant, ["default", "primary", "outline", "secondary", "ghost"] as const)) {
    return groupVariant;
  }
  return "default";
}

/**
 * Neutral variant surface + border token.
 * Outline shells use `border-token-outline` (hairline floor when theme border is 0).
 * Status accents live on the permanent status ring (`fieldShellFocusRingClass`), not the border.
 * Registered skins supply their own target class via `resolveVariantVisual` at the control.
 */
export function resolveFieldShellSurfaceClass({
  variant,
}: {
  variant: FieldShellVariant;
}): string {
  if (!isKitVariant(variant, KIT_FIELD_SHELL_VARIANTS)) {
    // Skin / unknown — caller should prefer resolveVariantVisual; empty kit fill.
    return "";
  }

  if (variant === "outline") {
    return "bg-transparent border-token-outline";
  }

  return cn(FIELD_SHELL_VARIANT_BG_CLASS[variant], "border-token");
}
