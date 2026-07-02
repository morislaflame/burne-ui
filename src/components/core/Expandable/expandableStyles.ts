import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import {
  messageBannerGridClass,
  type MessageBannerGridSlots,
} from "@/components/core/utils/messageBannerGridLayout";

import { mergeExpandableSlotClass } from "./expandableAPI";
import type { ExpandableSize, ExpandableVariant } from "./expandableTypes";

export const EXPANDABLE_DESCRIPTION_VARIANT = {
  small: "small",
  base: "small",
  mid: "base",
  large: "base",
} as const satisfies Record<ExpandableSize, "small" | "base">;

const EXPANDABLE_PANEL_PAD: Record<ExpandableSize, string> = {
  small: "px-base pb-base pt-small",
  base: "px-plus pb-plus pt-small",
  mid: "px-mid pb-mid pt-base",
  large: "px-large pb-large pt-base",
};

export const EXPANDABLE_ROOT_BASE_CLASS = "rounded-mid text-left text-foreground";

export const EXPANDABLE_ROOT_SURFACE_CLASS =
  "border-token bg-surface shadow-token-base";

export const EXPANDABLE_ROOT_GLOSS_CLASS = "gloss-panel gloss-deep border-0";

export const EXPANDABLE_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-col";

export const EXPANDABLE_TRIGGER_BASE_CLASS =
  "relative w-full overflow-hidden py-base text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2";

export const EXPANDABLE_TRIGGER_DISABLED_CLASS =
  "cursor-not-allowed opacity-50";

export const EXPANDABLE_TRIGGER_ENABLED_CLASS = "cursor-pointer";

export const EXPANDABLE_TRIGGER_LIFT_BASE_CLASS =
  "relative z-[1] w-full min-w-0 origin-center will-change-transform";

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

export function expandableControlMinHeightClass(size: ExpandableSize): string {
  return CONTROL_SIZE_LAYOUT[size].h.replace(/^h-/, "min-h-");
}

export function expandableRootClass({
  variant,
  className,
  slotClass,
}: {
  variant: ExpandableVariant;
  className?: string;
  slotClass?: string;
}): string {
  return mergeExpandableSlotClass(
    EXPANDABLE_ROOT_BASE_CLASS,
    variant === "gloss" ? EXPANDABLE_ROOT_GLOSS_CLASS : EXPANDABLE_ROOT_SURFACE_CLASS,
    className,
    slotClass,
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
  const layout = CONTROL_SIZE_LAYOUT[size];

  return mergeExpandableSlotClass(
    EXPANDABLE_TRIGGER_BASE_CLASS,
    expandableControlMinHeightClass(size),
    layout.padX,
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
  return mergeExpandableSlotClass(
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
  return mergeExpandableSlotClass(
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
  return mergeExpandableSlotClass(
    EXPANDABLE_PANEL_PAD[size],
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
  return CONTROL_SIZE_LAYOUT[size].controlText;
}

export { CONTROL_SIZE_LAYOUT };
