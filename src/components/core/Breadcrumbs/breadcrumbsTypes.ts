import type { HTMLAttributes, MouseEvent, OlHTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
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
  itemActive?: string;
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
 
export type BreadcrumbsPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
};
 
export type BreadcrumbsMotion = {
  list?: BreadcrumbsPartMotion;
  separator?: BreadcrumbsPartMotion;
  itemLink?: BreadcrumbsPartMotion;
  itemLinkText?: BreadcrumbsPartMotion;
  ellipsisLiftWrapper?: BreadcrumbsPartMotion;
};
 
export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
  className?: string;
  motion?: Prettify<BreadcrumbsPartMotion>;
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
  /**
   * Per-slot motion (`list`, `separator`, `itemLink`, `itemLinkText`, `ellipsisLiftWrapper`).
   * `Breadcrumbs.Item` is data-only (not a slot).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * There is no `root` slot — `play()` skips; use `playSlot("list")` / `playAll`.
   */
  motion?: Prettify<MotionMapWithEvents<BreadcrumbsMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this breadcrumbs chrome scope (`list` / `separator`).
   * Nested crumbs are separate scopes — pass a handle on `Breadcrumbs.Item`.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type BreadcrumbsListProps = OlHTMLAttributes<HTMLOListElement> & {
  classNames?: Prettify<BreadcrumbsClassNames>;
  children?: ReactNode;
  motion?: Prettify<BreadcrumbsPartMotion>;
};
 
export type BreadcrumbsItemProps = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  current?: boolean;
  className?: string;
  children?: ReactNode;
  motion?: Prettify<BreadcrumbsPartMotion>;
  /**
   * Handle for this crumb's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("itemLink")`. Current/static segments have no scope.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type InteractiveCrumbProps = {
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  textClassName?: string;
  "aria-current"?: "page" | undefined;
  motion?: Prettify<BreadcrumbsPartMotion>;
  motionController?: MotionController;
} & MotionStateHostProps;
 
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
  motion?: Prettify<BreadcrumbsPartMotion>;
};
 
export type BreadcrumbListItemProps = {
  piece: DisplayPiece;
  showSeparator: boolean;
};
 
export type BreadcrumbsSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  iconClassName?: string;
  motion?: Prettify<BreadcrumbsPartMotion>;
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
 