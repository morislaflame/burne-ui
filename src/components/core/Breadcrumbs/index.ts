import {
  BreadcrumbsItem,
  BreadcrumbsList,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from "./Breadcrumbs";

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Separator: BreadcrumbsSeparator,
});

export type {
  BreadcrumbsProps,
  BreadcrumbsListProps,
  BreadcrumbsItemProps,
} from "./Breadcrumbs";
