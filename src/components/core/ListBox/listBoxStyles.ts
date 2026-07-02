import { hoverVariant } from "@/components/core/utils/hoverVariant";

import { mergeListBoxSlotClass } from "./listBoxAPI";

export const LISTBOX_ROOT_CLASS =
  "flex min-h-0 flex-col gap-xsmall text-left outline-none";

export const LISTBOX_ROOT_GLOSS_CLASS =
  "gloss-panel gloss-deep rounded-mid p-plus text-foreground";

export const LISTBOX_SECTION_CLASS = "flex min-w-0 flex-col gap-xsmall";

export const LISTBOX_HEADER_CLASS = "px-plus text-left";

export const LISTBOX_HEADER_TEXT_CLASS = "text-muted";

export const LISTBOX_SEPARATOR_CLASS =
  "my-xsmall h-0 w-full shrink-0 border-t-token";

export const LISTBOX_EMPTY_CLASS = "px-mid py-small text-center text-muted";

export const LISTBOX_ITEM_BASE_CLASS =
  "w-full min-w-0 rounded-mid px-plus py-base text-left outline-none";

export const LISTBOX_ITEM_INTERACTIVE_CLASS =
  "cursor-pointer text-foreground focus-ring";

export const LISTBOX_ITEM_DISABLED_CLASS =
  "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent";

export const LISTBOX_ITEM_ACTIVE_CLASS = "bg-default-hover";

export function listBoxRootClass({
  isGloss,
  slotClass,
  className,
}: {
  isGloss: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(
    LISTBOX_ROOT_CLASS,
    isGloss && LISTBOX_ROOT_GLOSS_CLASS,
    slotClass,
    className,
  );
}

export function listBoxSectionClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(LISTBOX_SECTION_CLASS, slotClass, className);
}

export function listBoxHeaderClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(LISTBOX_HEADER_CLASS, slotClass, className);
}

export function listBoxHeaderTextClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(LISTBOX_HEADER_TEXT_CLASS, slotClass, className);
}

export function listBoxSeparatorClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(LISTBOX_SEPARATOR_CLASS, slotClass, className);
}

export function listBoxEmptyClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(LISTBOX_EMPTY_CLASS, slotClass, className);
}

export function listBoxItemClass({
  disabled,
  isActive,
  slotClass,
  className,
}: {
  disabled: boolean;
  isActive: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return mergeListBoxSlotClass(
    LISTBOX_ITEM_BASE_CLASS,
    !disabled && mergeListBoxSlotClass(LISTBOX_ITEM_INTERACTIVE_CLASS, hoverVariant()),
    disabled && LISTBOX_ITEM_DISABLED_CLASS,
    isActive && !disabled && LISTBOX_ITEM_ACTIVE_CLASS,
    slotClass,
    className,
  );
}
