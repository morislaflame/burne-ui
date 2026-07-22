import type { ElementType } from "react";

/**
 * Semantic heading/body comes from `as` (or the variant default element).
 * Text itself does not inject ARIA roles.
 */
export function resolveTextAs(
  as: ElementType | undefined,
  variantDefault: ElementType,
): ElementType {
  return as ?? variantDefault;
}
