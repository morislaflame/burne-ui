import type { ReactNode } from "react";

import { DEFAULT_BURNE_LABELS, formatBurneLabel } from "@/theme/burneLabels";

export const PAGINATION_ELLIPSIS_ARIA_HIDDEN = true as const;

export const PAGINATION_ICON_ARIA_HIDDEN = true as const;

export function resolvePaginationAriaLabel(
  ariaLabel?: string,
  paginationLabel: string = DEFAULT_BURNE_LABELS.pagination,
): string {
  return ariaLabel ?? paginationLabel;
}

export function resolvePaginationPageAriaLabel({
  ariaLabel,
  children,
  pageNumber,
  pageTemplate = DEFAULT_BURNE_LABELS.paginationPage,
}: {
  ariaLabel?: string;
  children?: ReactNode;
  pageNumber: number;
  pageTemplate?: string;
}): string | undefined {
  if (ariaLabel != null) return ariaLabel;
  if (children != null) return formatBurneLabel(pageTemplate, { n: pageNumber });
  return undefined;
}
