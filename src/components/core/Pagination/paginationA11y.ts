import type { ReactNode } from "react";

export const PAGINATION_DEFAULT_ARIA_LABEL = "Pagination";

export const PAGINATION_ELLIPSIS_ARIA_HIDDEN = true as const;

export const PAGINATION_ICON_ARIA_HIDDEN = true as const;

export const PAGINATION_PREVIOUS_DEFAULT_LABEL = "Back";

export const PAGINATION_NEXT_DEFAULT_LABEL = "Forward";

export function resolvePaginationPageAriaLabel({
  ariaLabel,
  children,
  pageNumber,
}: {
  ariaLabel?: string;
  children?: ReactNode;
  pageNumber: number;
}): string | undefined {
  if (ariaLabel != null) return ariaLabel;
  if (children != null) return `Page ${pageNumber}`;
  return undefined;
}
