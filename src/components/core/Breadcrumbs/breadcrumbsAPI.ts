import { Children, isValidElement, type ReactNode } from "react";

import type { BreadcrumbItemData, BreadcrumbsItemProps, DisplayPiece } from "./breadcrumbsTypes";

const BREADCRUMBS_ITEM_DISPLAY_NAME = "Breadcrumbs.Item";
const BREADCRUMBS_LIST_DISPLAY_NAME = "Breadcrumbs.List";

function elementDisplayName(node: ReactNode): string | undefined {
  if (!isValidElement(node)) return undefined;
  return (node.type as { displayName?: string }).displayName;
}

function elementChildren(node: ReactNode): ReactNode {
  if (!isValidElement(node)) return null;
  return (node.props as { children?: ReactNode }).children;
}

function hasDisplayNameDeep(children: ReactNode, displayName: string): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (elementDisplayName(child) === displayName) return true;
    return hasDisplayNameDeep(elementChildren(child), displayName);
  });
}

function collectItemsDeep(children: ReactNode, out: BreadcrumbItemData[]) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (elementDisplayName(child) === BREADCRUMBS_ITEM_DISPLAY_NAME) {
      const props = child.props as BreadcrumbsItemProps;
      out.push({
        label: props.children,
        href: props.href,
        onClick: props.onClick,
        current: props.current,
        className: props.className,
      });
      return;
    }
    collectItemsDeep(elementChildren(child), out);
  });
}

export function hasBreadcrumbCompoundChildren(children: ReactNode): boolean {
  return hasDisplayNameDeep(children, BREADCRUMBS_LIST_DISPLAY_NAME);
}

export function collectBreadcrumbItems(children: ReactNode): BreadcrumbItemData[] {
  const out: BreadcrumbItemData[] = [];
  collectItemsDeep(children, out);
  return out;
}

export function collapsedHiddenItems(items: BreadcrumbItemData[]): BreadcrumbItemData[] {
  if (items.length <= 3) return [];
  return items.slice(1, -2);
}

export function toCollapsedPieces(items: BreadcrumbItemData[]): DisplayPiece[] {
  const n = items.length;
  if (n === 0) return [];
  if (n <= 3) {
    return items.map((item, i) => ({
      kind: "segment" as const,
      item,
      isLast: item.current ?? i === n - 1,
    }));
  }
  return [
    { kind: "segment", item: items[0]!, isLast: false },
    { kind: "ellipsis", hiddenItems: collapsedHiddenItems(items) },
    { kind: "segment", item: items[n - 2]!, isLast: false },
    { kind: "segment", item: items[n - 1]!, isLast: true },
  ];
}

export function toExpandedPieces(items: BreadcrumbItemData[]): DisplayPiece[] {
  return items.map((item, i) => ({
    kind: "segment" as const,
    item,
    isLast: item.current ?? i === items.length - 1,
  }));
}

export function breadcrumbListItemKey(
  piece: DisplayPiece,
  idx: number,
): string {
  if (piece.kind === "ellipsis") return "ellipsis";
  const label = piece.item.label;
  return `segment-${idx}-${typeof label === "string" ? label : idx}`;
}

