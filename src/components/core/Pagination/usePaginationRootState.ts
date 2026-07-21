import { useCallback, useMemo } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import { PAGINATION_DEFAULT_ARIA_LABEL } from "./paginationA11y";
import type {
  PaginationContextValue,
  UsePaginationRootStateProps,
} from "./paginationTypes";

export function usePaginationRootState({
  page: pageProp,
  defaultPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  "aria-label": ariaLabel = PAGINATION_DEFAULT_ARIA_LABEL,
}: UsePaginationRootStateProps & { "aria-label"?: string }) {
  const [page, setPageRaw] = useControllableState<number | undefined>({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange
      ? (next) => {
          if (next !== undefined) onPageChange(next);
        }
      : undefined,
  });

  const setPage = useCallback(
    (next: number) => {
      setPageRaw(next);
    },
    [setPageRaw],
  );

  const contextValue = useMemo<PaginationContextValue>(
    () => ({
      page,
      totalPages,
      onPageChange: setPage,
      siblingCount,
    }),
    [page, setPage, siblingCount, totalPages],
  );

  return {
    contextValue,
    ariaLabel,
  };
}
