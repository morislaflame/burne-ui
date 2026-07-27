import { CONTROL_SIZE_LAYOUT, collapsibleSizeLayout } from "@/components/core/utils/sizeLayout";
import { messageBannerGridClass, type MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import type { ExpandableSize, ExpandableVariant } from "./expandableTypes";

import { cn } from "@/utils/cn";

export const EXPANDABLE_ROOT_BASE_CLASS = "rounded-mid text-left text-foreground";

export const EXPANDABLE_ROOT_SURFACE_CLASS =
  "border-token bg-surface shadow-token-base";

export const EXPANDABLE_ROOT_GLOSS_CLASS = "gloss-panel gloss-deep border-0";

export const EXPANDABLE_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-col";

export const EXPANDABLE_TRIGGER_BASE_CLASS =
  "relative w-full overflow-hidden rounded-[inherit] text-left outline-none focus-ring";

export const EXPANDABLE_TRIGGER_DISABLED_CLASS =
  "cursor-not-allowed opacity-50";

export const EXPANDABLE_TRIGGER_ENABLED_CLASS = "cursor-pointer";

export const EXPANDABLE_TRIGGER_LIFT_BASE_CLASS =
  "relative z-[1] w-full min-w-0 origin-center";

/** Compound slots (`Expandable.Content`, `Expandable.Message`) — pass-through grid children. */
export const EXPANDABLE_COMPOUND_CONTENTS_CLASS = "contents";

export const EXPANDABLE_TRIGGER_CHEVRON_WRAP_CLASS =
  "relative z-[1] flex shrink-0 origin-center self-center";

export const EXPANDABLE_MESSAGE_CLASS = EXPANDABLE_COMPOUND_CONTENTS_CLASS;

export const EXPANDABLE_ICON_BASE_CLASS =
  "shrink-0 text-primary [&_svg]:size-full";

export const EXPANDABLE_CONTENT_CLASS = EXPANDABLE_COMPOUND_CONTENTS_CLASS;

export const EXPANDABLE_DESCRIPTION_CLASS = "text-muted";

export const EXPANDABLE_TITLE_CLASS = "font-w-mid";

export const EXPANDABLE_CHEVRON_WRAP_CLASS = EXPANDABLE_TRIGGER_CHEVRON_WRAP_CLASS;

export const EXPANDABLE_PANEL_SHELL_CLASS = "overflow-hidden";

export const EXPANDABLE_TRIGGER_RIPPLE_OVERLAY_CLASS =
  "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]";

export function expandableRootClass({
  variant,
  className,
  slotClass,
}: {
  variant: ExpandableVariant;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    EXPANDABLE_ROOT_BASE_CLASS,
    variant === "gloss" ? EXPANDABLE_ROOT_GLOSS_CLASS : EXPANDABLE_ROOT_SURFACE_CLASS,
    slotClass,
    className,
  );
}

export function expandableTriggerClass({
  size,
  disabled,
  className,
  slotClass,
}: {
  size: ExpandableSize;
  disabled: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    EXPANDABLE_TRIGGER_BASE_CLASS,
    collapsibleSizeLayout(size).triggerPadding,
    disabled ? EXPANDABLE_TRIGGER_DISABLED_CLASS : EXPANDABLE_TRIGGER_ENABLED_CLASS,
    slotClass,
    className,
  );
}

export function expandableTriggerLiftClass({
  gridSlots,
  slotClass,
}: {
  gridSlots: MessageBannerGridSlots;
  slotClass?: string;
}): string {
  return cn(
    EXPANDABLE_TRIGGER_LIFT_BASE_CLASS,
    messageBannerGridClass(gridSlots),
    slotClass,
  );
}

export function expandableIconClass({
  size,
  className,
  slotClass,
}: {
  size: ExpandableSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    EXPANDABLE_ICON_BASE_CLASS,
    CONTROL_SIZE_LAYOUT[size].icon,
    slotClass,
    className,
  );
}

export function expandablePanelClass({
  size,
  className,
  slotClass,
}: {
  size: ExpandableSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    collapsibleSizeLayout(size).contentPadding,
    "text-left",
    slotClass,
    className,
  );
}

export function expandableChevronIconClass(size: ExpandableSize): string {
  return CONTROL_SIZE_LAYOUT[size].chevronIcon;
}

export function expandableTriggerChevronIconClass(size: ExpandableSize): string {
  return CONTROL_SIZE_LAYOUT[size].chevronIcon;
}

export function expandableTitleVariant(size: ExpandableSize) {
  return collapsibleSizeLayout(size).titleVariant;
}

export function expandableTitleClassName(size: ExpandableSize): string {
  return collapsibleSizeLayout(size).titleClassName;
}

export function expandableDescriptionVariant(size: ExpandableSize) {
  return collapsibleSizeLayout(size).descVariant;
}
