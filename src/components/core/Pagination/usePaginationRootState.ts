import { useMemo } from "react";

import { PAGINATION_DEFAULT_ARIA_LABEL } from "./paginationA11y";
import type {
  PaginationContextValue,
  UsePaginationRootStateProps,
} from "./paginationTypes";

export function usePaginationRootState({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  "aria-label": ariaLabel = PAGINATION_DEFAULT_ARIA_LABEL,
}: UsePaginationRootStateProps & { "aria-label"?: string }) {
  const contextValue = useMemo<PaginationContextValue>(
    () => ({
      page,
      totalPages,
      onPageChange,
      siblingCount,
    }),
    [onPageChange, page, siblingCount, totalPages],
  );

  return {
    contextValue,
    ariaLabel,
  };
}
