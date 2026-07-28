import type { HTMLAttributes, MouseEvent, OlHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

export type BreadcrumbsClassNames = {
  /** Root `<nav>`. */
  root?: string;
  /** `<ol>` on `Breadcrumbs.List` and simple mode. */
  list?: string;
  /** `<li>` for each `Breadcrumbs.Item` / simple item. */
  item?: string;
  /** Chevron icon between items. */
  separator?: string;
  /** `<span>` wrapper on `Breadcrumbs.Separator`. */
  separatorWrapper?: string;
  /** Current page content (`aria-current="page"`) — Item sub-slot. */
  itemCurrent?: string;
  /** Link / button inside interactive crumb — Item sub-slot. */
  itemLink?: string;
  /** `<span>` wrapper around crumb link — Item sub-slot. */
  itemLinkWrapper?: string;
  /** Text inside crumb link — Item sub-slot. */
  itemLinkText?: string;
  /** Non-clickable segment — Item sub-slot. */
  itemStatic?: string;
  /** "…" button. */
  ellipsisTrigger?: string;
  /** Lift wrapper inside "…" trigger. */
  ellipsisLiftWrapper?: string;
  /** "…" text. */
  ellipsisText?: string;
  /** Popover body of "…" menu. */
  ellipsisPopover?: string;
  /** Items in hidden crumbs dropdown. */
  dropdownItem?: string;
};

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
  className?: string;
};

/** @internal */
export type BreadcrumbItemData = BreadcrumbItem;

export type DisplayPiece =
  | { kind: "segment"; item: BreadcrumbItemData; isLast: boolean }
  | { kind: "ellipsis"; hiddenItems: BreadcrumbItemData[] };

export type BreadcrumbSegmentPiece = Extract<DisplayPiece, { kind: "segment" }>;

export type BreadcrumbsProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  collapse?: boolean;
  classNames?: Prettify<BreadcrumbsClassNames>;
  /** Simple API: chain items. Ignored in compound mode (`Breadcrumbs.List`). */
  items?: BreadcrumbItem[];
  children?: ReactNode;
};

export type BreadcrumbsListProps = OlHTMLAttributes<HTMLOListElement> & {
  classNames?: Prettify<BreadcrumbsClassNames>;
  children?: ReactNode;
};

export type BreadcrumbsItemProps = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
  className?: string;
  children?: ReactNode;
};

export type InteractiveCrumbProps = {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  textClassName?: string;
  "aria-current"?: "page" | undefined;
};

export type BreadcrumbsEllipsisMenuProps = {
  hiddenItems: BreadcrumbItemData[];
};

export type BreadcrumbsSimpleContentProps = Omit<
  OlHTMLAttributes<HTMLOListElement>,
  "children"
> & {
  items: BreadcrumbItem[];
};

export type BreadcrumbsPiecesListProps = OlHTMLAttributes<HTMLOListElement> & {
  pieces: DisplayPiece[];
};

export type BreadcrumbListItemProps = {
  piece: DisplayPiece;
  showSeparator: boolean;
};

export type BreadcrumbsSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  iconClassName?: string;
};

export type BreadcrumbSegmentProps = {
  piece: BreadcrumbSegmentPiece;
};

export type BreadcrumbsEllipsisDropdownItemProps = {
  item: BreadcrumbItemData;
  className?: string;
};

export type BreadcrumbsCollapseProviderProps = {
  collapse: boolean;
  children: ReactNode;
};

export type BreadcrumbsClassNamesProviderProps = {
  classNames?: Prettify<BreadcrumbsClassNames>;
  children: ReactNode;
};
