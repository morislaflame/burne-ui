export function normalizePaginationTotalPages(totalPages: number | undefined): number {
  if (totalPages == null || !Number.isFinite(totalPages)) return 0;
  return Math.max(0, Math.floor(totalPages));
}

export function clampPaginationPage(page: number, safeTotal: number): number {
  if (!Number.isFinite(page)) return safeTotal > 0 ? 1 : 0;
  const floored = Math.floor(page);
  if (safeTotal <= 0) return Math.max(1, floored);
  return Math.min(Math.max(1, floored), safeTotal);
}

function buildPageSpan(start: number, end: number): number[] {
  const length = Math.max(0, end - start + 1);
  return Array.from({ length }, (_, idx) => start + idx);
}

export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  const safeTotal = normalizePaginationTotalPages(totalPages);
  if (safeTotal <= 0) return [];
  if (safeTotal === 1) return [1];

  const safeSibling = Number.isFinite(siblingCount)
    ? Math.max(0, Math.floor(siblingCount))
    : 1;
  const totalPageNumbers = safeSibling * 2 + 5;

  if (safeTotal <= totalPageNumbers) {
    return buildPageSpan(1, safeTotal);
  }

  const safePage = clampPaginationPage(page, safeTotal);
  const leftSiblingIndex = Math.max(safePage - safeSibling, 1);
  const rightSiblingIndex = Math.min(safePage + safeSibling, safeTotal);

  const shouldShowLeftDots = leftSiblingIndex > 3;
  const shouldShowRightDots = rightSiblingIndex < safeTotal - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * safeSibling;
    return [...buildPageSpan(1, leftItemCount), "ellipsis", safeTotal];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * safeSibling;
    return [1, "ellipsis", ...buildPageSpan(safeTotal - rightItemCount + 1, safeTotal)];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    return [
      1,
      "ellipsis",
      ...buildPageSpan(leftSiblingIndex, rightSiblingIndex),
      "ellipsis",
      safeTotal,
    ];
  }

  return buildPageSpan(1, safeTotal);
}
 
export function resolvePaginationPreviousDisabled({
  disabled,
  page,
  totalPages,
}: {
  disabled?: boolean;
  page?: number;
  totalPages?: number;
}): boolean {
  if (disabled != null) return disabled;
  if (totalPages != null && normalizePaginationTotalPages(totalPages) <= 0) {
    return true;
  }
  return page != null ? !Number.isFinite(page) || page <= 1 : false;
}
 
export function resolvePaginationNextDisabled({
  disabled,
  page,
  totalPages,
}: {
  disabled?: boolean;
  page?: number;
  totalPages?: number;
}): boolean {
  if (disabled != null) return disabled;
  if (totalPages != null) {
    const safeTotal = normalizePaginationTotalPages(totalPages);
    if (safeTotal <= 0) return true;
    return page != null ? !Number.isFinite(page) || page >= safeTotal : false;
  }
  return false;
}
 