import type { HTMLAttributes, MouseEvent, OlHTMLAttributes, ReactNode } from "react";

export type BreadcrumbsClassNames = {
  /** Корневой `<nav>`. */
  root?: string;
  /** `<ol>` у `Breadcrumbs.List` и simple-режима. */
  list?: string;
  /** `<li>` в `Breadcrumbs.List`. */
  listItem?: string;
  /** Иконка-chevron между пунктами. */
  separator?: string;
  /** Обёртка `<span>` у `Breadcrumbs.Separator`. */
  separatorWrapper?: string;
  /** Текущая страница (`aria-current="page"`). */
  current?: string;
  /** Ссылка / кнопка внутри интерактивной крошки. */
  link?: string;
  /** Обёртка `<span>` вокруг ссылки-крошки. */
  linkWrapper?: string;
  /** Текст внутри ссылки-крошки (`Text`). */
  linkText?: string;
  /** Некликабельный сегмент. */
  static?: string;
  /** Кнопка «…». */
  ellipsisTrigger?: string;
  /** Обёртка lift внутри trigger «…». */
  ellipsisLiftWrapper?: string;
  /** Текст «…». */
  ellipsisText?: string;
  /** Тело popover меню «…». */
  ellipsisPopover?: string;
  /** Пункты в dropdown скрытых крошек. */
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
  classNames?: BreadcrumbsClassNames;
  /** Simple API: пункты цепочки. Игнорируется при compound (`Breadcrumbs.List`). */
  items?: BreadcrumbItem[];
  children?: ReactNode;
};

export type BreadcrumbsListProps = OlHTMLAttributes<HTMLOListElement> & {
  classNames?: BreadcrumbsClassNames;
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
  classNames?: BreadcrumbsClassNames;
  children: ReactNode;
};
