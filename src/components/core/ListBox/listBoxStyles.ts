import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

import type { ListBoxSize } from "./listBoxTypes";

import { cn } from "@/utils/cn";

export const LISTBOX_ROOT_CLASS =
  "flex min-h-0 flex-col gap-xsmall text-left outline-none";

export const LISTBOX_ROOT_GLOSS_CLASS =
  "gloss-panel gloss-deep rounded-mid p-mid text-foreground";

export const LISTBOX_SECTION_CLASS = "flex min-w-0 flex-col gap-xsmall";

export const LISTBOX_HEADER_CLASS = "px-mid text-left";

export const LISTBOX_HEADER_TEXT_CLASS = "text-muted";

export const LISTBOX_SEPARATOR_CLASS =
  "my-xsmall h-0 w-full shrink-0 border-t-token";

export const LISTBOX_EMPTY_CLASS = "px-large py-small text-center text-muted";

export const LISTBOX_ITEM_BASE_CLASS =
  "w-full min-w-0 rounded-mid text-left outline-none";

export const LISTBOX_ITEM_PAD: Record<ListBoxSize, string> = {
  small: cn(CONTROL_SIZE_LAYOUT.small.padX, CONTROL_SIZE_LAYOUT.small.padY),
  base: cn(CONTROL_SIZE_LAYOUT.base.padX, CONTROL_SIZE_LAYOUT.base.padY),
  mid: cn(CONTROL_SIZE_LAYOUT.mid.padX, CONTROL_SIZE_LAYOUT.mid.padY),
  large: cn(CONTROL_SIZE_LAYOUT.large.padX, CONTROL_SIZE_LAYOUT.large.padY),
};

export const LISTBOX_ITEM_INTERACTIVE_CLASS =
  "cursor-pointer text-foreground focus-ring";

export const LISTBOX_ITEM_DISABLED_CLASS =
  "cursor-not-allowed bg-transparent text-muted opacity-45";

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
  return cn(
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
  return cn(LISTBOX_SECTION_CLASS, slotClass, className);
}

export function listBoxHeaderClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(LISTBOX_HEADER_CLASS, slotClass, className);
}

export function listBoxHeaderTextClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(LISTBOX_HEADER_TEXT_CLASS, slotClass, className);
}

export function listBoxSeparatorClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(LISTBOX_SEPARATOR_CLASS, slotClass, className);
}

export function listBoxEmptyClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(LISTBOX_EMPTY_CLASS, slotClass, className);
}

export function listBoxItemClass({
  size,
  disabled,
  isActive,
  slotClass,
  className,
}: {
  size: ListBoxSize;
  disabled: boolean;
  isActive: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    LISTBOX_ITEM_BASE_CLASS,
    LISTBOX_ITEM_PAD[size],
    // Active highlight only via `isActive` (pointerenter / keyboard) — CSS :hover
    // would stick under the cursor and fight aria-activedescendant navigation.
    !disabled &&
      cn(LISTBOX_ITEM_INTERACTIVE_CLASS, SURFACE_COLOR_TRANSITION),
    disabled && LISTBOX_ITEM_DISABLED_CLASS,
    isActive && !disabled && LISTBOX_ITEM_ACTIVE_CLASS,
    slotClass,
    className,
  );
}
