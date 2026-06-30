import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergePaginationSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, totalPages - 1);

  const items: (number | "ellipsis")[] = [1];

  if (leftSibling > 2) items.push("ellipsis");
  else for (let i = 2; i < leftSibling; i++) items.push(i);

  for (let i = leftSibling; i <= rightSibling; i++) items.push(i);

  if (rightSibling < totalPages - 1) items.push("ellipsis");
  else for (let i = rightSibling + 1; i < totalPages; i++) items.push(i);

  items.push(totalPages);
  return items;
}

export function resolvePaginationPreviousDisabled({
  disabled,
  page,
}: {
  disabled?: boolean;
  page?: number;
}): boolean {
  return disabled ?? (page != null ? page <= 1 : false);
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
  return (
    disabled ??
    (page != null && totalPages != null ? page >= totalPages : false)
  );
}
