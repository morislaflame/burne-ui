import { hoverVariant } from "@/components/core/utils/hoverVariant";

import { mergePaginationSlotClass } from "./paginationAPI";

export const PAGINATION_ROOT_CLASS =
  "flex w-full min-w-0 flex-wrap items-center justify-between gap-xsmall gap-y-xsmall text-left";

export const PAGINATION_SUMMARY_CLASS = "flex min-w-0 flex-1 basis-[12rem]";

export const PAGINATION_SUMMARY_TEXT_CLASS = "min-w-0 truncate text-muted";

export const PAGINATION_CONTENT_CLASS =
  "m-0 ms-auto flex max-w-full min-w-0 list-none flex-wrap items-center justify-start gap-xsmall p-0";

export const PAGINATION_ITEM_CLASS = "flex shrink-0 items-center";

export const PAGINATION_INTERACTIVE_BUTTON_CLASS =
  "inline-flex min-w-0 origin-center cursor-pointer items-center justify-center gap-xsmall rounded-mid border-0 bg-transparent px-xsmall py-xsmall font-[inherit] text-muted no-underline outline-none hover:text-foreground focus-ring disabled:cursor-not-allowed disabled:opacity-48 disabled:hover:text-muted disabled:hover:bg-transparent motion-reduce:animate-none";

export const PAGINATION_PAGE_ACTIVE_CLASS =
  "inline-flex min-w-[1.75rem] items-center justify-center px-xsmall py-xsmall font-w-mid text-foreground tabular-nums text-base";

export const PAGINATION_PAGE_TEXT_CLASS = "min-w-[1.75rem] tabular-nums";

export const PAGINATION_ELLIPSIS_CLASS =
  "inline-flex min-w-[1.75rem] items-center justify-center px-xsmall py-xsmall text-muted tabular-nums";

export const PAGINATION_NAV_TEXT_CLASS = "";

export const PAGINATION_PREVIOUS_ICON_CLASS = "shrink-0 icon-small opacity-75";

export const PAGINATION_NEXT_ICON_CLASS = "shrink-0 icon-small opacity-75";

export function paginationRootClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(PAGINATION_ROOT_CLASS, slotClass, className);
}

export function paginationSummaryClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(PAGINATION_SUMMARY_CLASS, slotClass, className);
}

export function paginationSummaryTextClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_SUMMARY_TEXT_CLASS,
    slotClass,
    className,
  );
}

export function paginationContentClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(PAGINATION_CONTENT_CLASS, slotClass, className);
}

export function paginationItemClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(PAGINATION_ITEM_CLASS, slotClass, className);
}

export function paginationInteractiveButtonClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_INTERACTIVE_BUTTON_CLASS,
    hoverVariant(),
    slotClass,
    className,
  );
}

export function paginationPageActiveClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_PAGE_ACTIVE_CLASS,
    slotClass,
    className,
  );
}

export function paginationPageTextClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_PAGE_TEXT_CLASS,
    slotClass,
    className,
  );
}

export function paginationEllipsisClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_ELLIPSIS_CLASS,
    slotClass,
    className,
  );
}

export function paginationNavTextClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_NAV_TEXT_CLASS,
    slotClass,
    className,
  );
}

export function paginationPreviousIconClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_PREVIOUS_ICON_CLASS,
    slotClass,
    className,
  );
}

export function paginationNextIconClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergePaginationSlotClass(
    PAGINATION_NEXT_ICON_CLASS,
    slotClass,
    className,
  );
}
