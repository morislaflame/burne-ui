import { useCallback, useMemo } from "react";
 
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
import { resolvePaginationAriaLabel } from "./paginationA11y";
import { clampPaginationPage, normalizePaginationTotalPages } from "./paginationAPI";
import type {
  PaginationContextValue,
  UsePaginationRootStateProps,
} from "./paginationTypes";
 
export function usePaginationRootState({
  page: pageProp,
  defaultPage = 1,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "base",
  "aria-label": ariaLabel,
}: UsePaginationRootStateProps & { "aria-label"?: string }) {
  const paginationLabel = useBurneLabel("pagination");
  const safeTotal =
    totalPages != null ? normalizePaginationTotalPages(totalPages) : undefined;

  const [rawPage, setPageRaw] = useControllableState<number | undefined>({
    value: pageProp,
    defaultValue: defaultPage,
    onChange: onPageChange
      ? (next) => {
          if (next !== undefined) onPageChange(next);
        }
      : undefined,
  });

  const page =
    rawPage == null
      ? undefined
      : safeTotal != null && safeTotal > 0
        ? clampPaginationPage(rawPage, safeTotal)
        : Number.isFinite(rawPage)
          ? Math.max(1, Math.floor(rawPage))
          : 1;
 
  const setPage = useCallback(
    (next: number) => {
      if (!Number.isFinite(next)) return;
      if (safeTotal != null && safeTotal <= 0) return;
      const clamped =
        safeTotal != null
          ? clampPaginationPage(next, safeTotal)
          : Math.max(1, Math.floor(next));
      setPageRaw(clamped);
    },
    [safeTotal, setPageRaw],
  );
 
  const contextValue = useMemo<PaginationContextValue>(
    () => ({
      page,
      totalPages: safeTotal,
      onPageChange: setPage,
      siblingCount,
      size,
    }),
    [page, safeTotal, setPage, siblingCount, size],
  );
 
  return {
    contextValue,
    ariaLabel: resolvePaginationAriaLabel(ariaLabel, paginationLabel),
  };
}
 