import type { TextVariant } from "@/components/core/Text";
import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { TOOLTIP_ARROW_SHELL_PAD } from "@/components/core/Tooltip/tooltipPosition";

import type {
  PopoverContentGap,
  PopoverDescriptionVariantMap,
  PopoverSide,
  PopoverSize,
  PopoverTitleVariantMap,
} from "./popoverTypes";

import { cn } from "@/utils/cn";

export const POPOVER_DEFAULT_OFFSET = 6;

export const POPOVER_TITLE_VARIANT: PopoverTitleVariantMap = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

export const POPOVER_DESCRIPTION_VARIANT: PopoverDescriptionVariantMap = {
  small: "xsmall",
  base: "small",
  mid: "small",
  large: "base",
};

export const POPOVER_MIN_WIDTH_CLASS: Record<PopoverSize, string> = {
  small: "min-w-component-xsmall",
  base: "min-w-component-small",
  mid: "min-w-component-small",
  large: "min-w-component-base",
};

export const POPOVER_MAX_WIDTH_CLASS: Record<PopoverSize, string> = {
  small: "max-w-component-small",
  base: "max-w-component-base",
  mid: "max-w-component-mid",
  large: "max-w-component-large",
};

export const POPOVER_PADDING_CLASS: Record<PopoverSize, string> = {
  small: "px-small py-xsmall",
  base: "px-mid py-base",
  mid: "px-large py-mid",
  large: "px-xlarge py-large",
};

export const POPOVER_GAP_CLASS: Record<PopoverContentGap, string> = {
  small: "gap-small",
  base: "gap-base",
  mid: "gap-mid",
  large: "gap-large",
};

export const POPOVER_DEFAULT_GAP: Record<PopoverSize, PopoverContentGap> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

export const POPOVER_TRIGGER_CLASS =
  "inline-flex shrink-0 border-0 bg-transparent p-0 outline-none focus-ring";

export const POPOVER_CONTENT_CLASS =
  "pointer-events-auto z-popover w-max min-w-0 overflow-visible text-left outline-none will-change-transform";

export const POPOVER_PANEL_RELATIVE_CLASS = "relative overflow-visible";

export const POPOVER_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep relative z-[1] flex min-w-0 origin-center flex-col overflow-hidden rounded-mid text-foreground";

export const POPOVER_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-col";

export const POPOVER_DEFAULT_PANEL_CLASS =
  "relative z-[1] flex min-w-0 flex-col overflow-hidden rounded-mid border-token bg-surface text-foreground animate-shadow";

export const POPOVER_ARROW_BASE_CLASS =
  "pointer-events-none absolute z-0 size-2 rotate-45";

export const POPOVER_ARROW_GLOSS_CLASS =
  "border-0 bg-[var(--color-surface)]";

export const POPOVER_ARROW_DEFAULT_CLASS = "border-token bg-surface";

export const POPOVER_HEADER_CLASS =
  "flex shrink-0 flex-col gap-xsmall text-left";

export const POPOVER_LABEL_CLASS = "min-w-0 font-w-mid";

export const POPOVER_BODY_CLASS = "min-h-0 min-w-0 text-left";

export function popoverTriggerClass({
  rootSlot,
  slotClass,
  className,
}: {
  rootSlot?: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_TRIGGER_CLASS, rootSlot, slotClass, className);
}

export function popoverContentClass({
  resolvedSide,
  showArrow,
  slotClass,
  className,
}: {
  resolvedSide: PopoverSide;
  showArrow: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_CONTENT_CLASS,
    showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
    slotClass,
    className,
  );
}

export function popoverGlossPanelClass({
  size,
  unstyled,
  contentGap,
  slotClass,
}: {
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  slotClass?: string;
}): string {
  return cn(
    POPOVER_GLOSS_PANEL_CLASS,
    GLOSS_INTERACTIVE_MOTION_CLASS,
    !unstyled && POPOVER_MIN_WIDTH_CLASS[size],
    !unstyled && POPOVER_MAX_WIDTH_CLASS[size],
    !unstyled && POPOVER_PADDING_CLASS[size],
    !unstyled && POPOVER_GAP_CLASS[contentGap],
    slotClass,
  );
}

export function popoverGlossContentClass(slotClass?: string): string {
  return cn(POPOVER_GLOSS_CONTENT_CLASS, slotClass);
}

export function popoverDefaultPanelClass({
  size,
  unstyled,
  contentGap,
  slotClass,
}: {
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  slotClass?: string;
}): string {
  return cn(
    POPOVER_DEFAULT_PANEL_CLASS,
    !unstyled && POPOVER_MIN_WIDTH_CLASS[size],
    !unstyled && POPOVER_MAX_WIDTH_CLASS[size],
    !unstyled && POPOVER_PADDING_CLASS[size],
    !unstyled && POPOVER_GAP_CLASS[contentGap],
    slotClass,
  );
}

export function popoverArrowClass({
  isGloss,
  arrowSideClass,
  slotClass,
  className,
}: {
  isGloss: boolean;
  resolvedSide: PopoverSide;
  arrowSideClass: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_ARROW_BASE_CLASS,
    isGloss ? POPOVER_ARROW_GLOSS_CLASS : POPOVER_ARROW_DEFAULT_CLASS,
    arrowSideClass,
    slotClass,
    className,
  );
}

export function popoverHeaderClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_HEADER_CLASS, slotClass, className);
}

export function popoverTitleClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_LABEL_CLASS, slotClass, className);
}

export function popoverBodyClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_BODY_CLASS, slotClass, className);
}

export function popoverTitleVariant(size: PopoverSize): TextVariant {
  return POPOVER_TITLE_VARIANT[size];
}

export function popoverDescriptionVariant(size: PopoverSize): TextVariant {
  return POPOVER_DESCRIPTION_VARIANT[size];
}
