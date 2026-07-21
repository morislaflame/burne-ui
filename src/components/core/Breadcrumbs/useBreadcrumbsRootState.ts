import { useMemo, type ReactNode } from "react";

import { collectBreadcrumbItems, hasBreadcrumbCompoundChildren, toCollapsedPieces, toExpandedPieces } from "./breadcrumbsAPI";
import { useBreadcrumbsCollapse } from "./breadcrumbsContext";
import type { BreadcrumbItemData } from "./breadcrumbsTypes";

function useBreadcrumbPieces(items: BreadcrumbItemData[]) {
  const collapse = useBreadcrumbsCollapse();
  return useMemo(
    () => (collapse ? toCollapsedPieces(items) : toExpandedPieces(items)),
    [collapse, items],
  );
}

export function useBreadcrumbsRootState({
  children,
}: {
  children?: ReactNode;
} = {}) {
  return {
    isCompound: hasBreadcrumbCompoundChildren(children),
  };
}

export function useBreadcrumbsListState(children?: ReactNode) {
  const collapse = useBreadcrumbsCollapse();
  const items = useMemo(() => collectBreadcrumbItems(children), [children]);
  const pieces = useBreadcrumbPieces(items);

  return { collapse, items, pieces };
}

export function useBreadcrumbsPiecesFromItems(items: BreadcrumbItemData[]) {
  const pieces = useBreadcrumbPieces(items);
  return { pieces };
}
