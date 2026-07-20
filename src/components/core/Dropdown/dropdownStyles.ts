import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { optionListItemGridClass } from "@/components/core/utils/optionControlGridLayout";

import type { DropdownItemVariant } from "./dropdownTypes";

import { cn } from "@/utils/cn";

export const DROPDOWN_ROOT_CLASS = "relative inline-flex";

export const DROPDOWN_TRIGGER_CLASS = "inline-flex";

export const DROPDOWN_POPOVER_CLASS = "z-[100]";

export const DROPDOWN_POPOVER_BODY_CLASS =
  "max-h-[min(24rem,70vh)] gap-xsmall overflow-y-auto overflow-x-hidden p-base text-left outline-none";

export const DROPDOWN_GROUP_CLASS =
  "flex min-w-0 flex-col gap-xsmall text-left";

export const DROPDOWN_LABEL_CLASS = "px-base text-left";

export const DROPDOWN_LABEL_TEXT_CLASS = "text-muted";

export const DROPDOWN_SUB_CLASS = "relative min-w-0";

export const DROPDOWN_SUB_TRIGGER_CLASS =
  "flex w-full min-w-0 cursor-pointer items-center gap-base rounded-mid px-base py-small text-left outline-none text-base text-foreground focus-ring";

export const DROPDOWN_SUB_TRIGGER_LABEL_WRAP_CLASS = "min-w-0 flex-1";

export const DROPDOWN_SUB_TRIGGER_CHEVRON_CLASS =
  "shrink-0 text-muted icon-base";

export const DROPDOWN_SUB_CONTENT_BASE_CLASS =
  "fixed z-[110] outline-none will-change-transform";

export const DROPDOWN_SUB_CONTENT_SURFACE_CLASS =
  "flex max-h-[min(22rem,65vh)] flex-col overflow-y-auto overflow-x-hidden rounded-mid border-token bg-surface p-base text-left shadow-token-mid";

export const DROPDOWN_SUB_CONTENT_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex max-h-[min(22rem,65vh)] min-w-0 origin-center flex-col overflow-hidden rounded-mid text-foreground";

export const DROPDOWN_SUB_CONTENT_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-h-0 flex-col overflow-y-auto overflow-x-hidden p-base text-left";

export const DROPDOWN_ITEM_BASE_CLASS =
  "w-full min-w-0 origin-center rounded-mid px-base py-small text-left no-underline outline-none text-base";

export const DROPDOWN_ITEM_DISABLED_CLASS =
  "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent";

const DROPDOWN_ITEM_VARIANT_CLASS: Record<DropdownItemVariant, string> = {
  default: cn(
    "text-foreground",
    hoverVariant(),
    "focus-ring",
  ),
  danger: cn(
    "text-danger",
    hoverVariant("danger"),
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger",
  ),
  warning: cn(
    "text-warning",
    hoverVariant("warning"),
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning",
  ),
  info: cn(
    "text-info",
    hoverVariant("info"),
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info",
  ),
  success: cn(
    "text-success",
    hoverVariant("success"),
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success",
  ),
};

export function dropdownItemRowClass({
  variant,
  disabled,
  hasHint,
  showIndicatorSlot,
  hasIcon,
  className,
  slotClass,
}: {
  variant: DropdownItemVariant;
  disabled: boolean;
  hasHint: boolean;
  showIndicatorSlot: boolean;
  hasIcon: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_ITEM_BASE_CLASS,
    optionListItemGridClass(hasHint, "gap-x-base", showIndicatorSlot, hasIcon),
    !disabled &&
      cn("cursor-pointer", DROPDOWN_ITEM_VARIANT_CLASS[variant]),
    disabled && DROPDOWN_ITEM_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function dropdownSubTriggerRowClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_SUB_TRIGGER_CLASS,
    hoverVariant(),
    slotClass,
    className,
  );
}

export function dropdownSubContentClass({
  isGlossPanel,
  subOpen,
  portalMounted,
  className,
  slotClass,
}: {
  isGlossPanel: boolean;
  subOpen: boolean;
  portalMounted: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DROPDOWN_SUB_CONTENT_BASE_CLASS,
    !isGlossPanel && DROPDOWN_SUB_CONTENT_SURFACE_CLASS,
    !subOpen && portalMounted && "pointer-events-none",
    slotClass,
    className,
  );
}
