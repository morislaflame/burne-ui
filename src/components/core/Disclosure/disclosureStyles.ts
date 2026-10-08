import { CONTROL_SIZE_LAYOUT, collapsibleSizeLayout, iconSlotSizeClass } from "@/components/core/utils/sizeLayout";
import { TEXT_COLOR_TRANSITION, hoverVariant } from "@/components/core/utils/hoverVariant";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { DisclosureGroupContextValue, DisclosureSize, DisclosureVariant, KitDisclosureVariant } from "./disclosureTypes";
import { KIT_DISCLOSURE_VARIANTS } from "./disclosureTypes";

export function isFramedVariant(key: KitDisclosureVariant): boolean {
  return key === "outline" || key === "secondary" || key === "default";
}

const VARIANT_ROOT: Record<KitDisclosureVariant, string> = {
  default: "flex flex-col",
  outline: "flex flex-col",
  secondary: "flex flex-col",
  card: "rounded-base border-token bg-surface",
  ghost: "flex flex-col",
};

const FRAMED_PANEL: Record<KitDisclosureVariant, string> = {
  default: "bg-surface border-token rounded-mid text-foreground",
  outline: "bg-transparent border-token-outline rounded-mid text-foreground",
  secondary: "bg-secondary border-token rounded-mid text-secondary-foreground",
  card: "bg-surface border-token rounded-mid text-foreground",
  ghost: "bg-transparent border-token rounded-mid text-foreground",
};

const TRIGGER_INTERACTIVE = cn("bg-transparent text-foreground", hoverVariant());

const VARIANT_TRIGGER: Record<KitDisclosureVariant, string> = {
  default: cn("rounded-mid", TRIGGER_INTERACTIVE),
  outline: cn("rounded-mid", TRIGGER_INTERACTIVE),
  secondary: cn("rounded-mid", TRIGGER_INTERACTIVE),
  card: TRIGGER_INTERACTIVE,
  ghost: cn("rounded-mid", TRIGGER_INTERACTIVE),
};

export const DISCLOSURE_TRIGGER_BASE_CLASS =
  "flex w-full select-none items-center gap-small text-start outline-none focus-ring";

export const DISCLOSURE_TRIGGER_DISABLED_CLASS = "cursor-not-allowed opacity-48";

export const DISCLOSURE_TRIGGER_ENABLED_CLASS = "cursor-pointer";

export const DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS =
  "min-w-0 flex-1 origin-center";

export const DISCLOSURE_TRIGGER_TITLE_CLASS = "block";

export function disclosureTriggerTitleToneClass(open: boolean): string {
  return open ? "text-primary" : "text-foreground";
}

export const DISCLOSURE_TRIGGER_ICON_BASE_CLASS =
  "icon-slot inline-flex shrink-0 text-primary";

export const DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS =
  "inline-flex shrink-0 origin-center items-center justify-center text-muted";

export const DISCLOSURE_TRIGGER_CHEVRON_ICON_CLASS = "size-full";

export const DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS = "text-primary";

export const DISCLOSURE_CONTENT_SHELL_CLASS = "overflow-hidden";

/**
 * Clips the card face to the radius. Lives inside the shadow host so
 * `overflow-hidden` does not crop the hover fade layers.
 */
export const DISCLOSURE_CARD_CLIP_CLASS = "overflow-hidden rounded-[inherit]";

/** Same clip for an unseparated card group; dividers stay on this face. */
export const DISCLOSURE_GROUP_CARD_CLIP_CLASS =
  "flex w-full flex-col overflow-hidden rounded-[inherit] divide-y-token";

export const DISCLOSURE_HANDLE_BASE_CLASS =
  "flex touch-none select-none shrink-0 cursor-grab items-center justify-center border-t-token py-xsmall active:cursor-grabbing";

export const DISCLOSURE_HANDLE_DISABLED_CLASS = "pointer-events-none opacity-48";

export const DISCLOSURE_HANDLE_GRIP_CLASS = "h-1 w-10 rounded-full bg-tertiary";

export function disclosureTriggerShell(size: DisclosureSize) {
  const collapsible = collapsibleSizeLayout(size);
  return {
    pad: collapsible.triggerPadding,
    text: collapsible.titleVariant,
    titleClassName: collapsible.titleClassName,
    icon: iconSlotSizeClass(size),
    chevron: CONTROL_SIZE_LAYOUT[size].chevronIcon,
  };
}

export function disclosureTriggerIconClass({
  size,
  className,
  slotClass,
}: {
  size: DisclosureSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DISCLOSURE_TRIGGER_ICON_BASE_CLASS,
    disclosureTriggerShell(size).icon,
    slotClass,
    className,
  );
}

export function disclosureRootClass({
  variant,
  groupedCardShell,
  className,
  slotClass,
}: {
  variant: DisclosureVariant;
  groupedCardShell: boolean;
  className?: string;
  slotClass?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_DISCLOSURE_VARIANTS, "disclosure.root");
  const rootCls =
    visual.key === "card" && groupedCardShell
      ? ""
      : visual.className !== undefined
        ? visual.className
        : VARIANT_ROOT[visual.key];

  return cn(rootCls, slotClass, className);
}

export function disclosureTriggerClass({
  variant,
  size,
  disabled,
  className,
  slotClass,
}: {
  variant: DisclosureVariant;
  size: DisclosureSize;
  disabled: boolean;
  className?: string;
  slotClass?: string;
}): string {
  const shell = disclosureTriggerShell(size);
  const visual = resolveVariantVisual(variant, KIT_DISCLOSURE_VARIANTS, "disclosure.trigger");

  return cn(
    DISCLOSURE_TRIGGER_BASE_CLASS,
    shell.pad,
    visual.className !== undefined ? visual.className : VARIANT_TRIGGER[visual.key],
    disabled
      ? DISCLOSURE_TRIGGER_DISABLED_CLASS
      : DISCLOSURE_TRIGGER_ENABLED_CLASS,
    slotClass,
    className,
  );
}

export function disclosureContentWrapClass(variant: DisclosureVariant): string | undefined {
  const visual = resolveVariantVisual(variant, KIT_DISCLOSURE_VARIANTS, "disclosure.contentWrap");
  if (visual.key === "outline" || visual.key === "secondary") {
    return "pt-xsmall";
  }
  return undefined;
}

export function disclosureContentPanelClass({
  variant,
  size,
  className,
  slotClass,
}: {
  variant: DisclosureVariant;
  size: DisclosureSize;
  className?: string;
  slotClass?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_DISCLOSURE_VARIANTS, "disclosure.contentPanel");
  if (visual.className !== undefined) {
    return cn(
      collapsibleSizeLayout(size).contentPadding,
      visual.className,
      slotClass,
      className,
    );
  }

  const key = visual.key;
  const framed = isFramedVariant(key);

  return cn(
    collapsibleSizeLayout(size).contentPadding,
    framed && key === "outline" && FRAMED_PANEL.outline,
    framed && key === "secondary" && FRAMED_PANEL.secondary,
    key === "card" && "border-t-token",
    key === "ghost" && "text-muted",
    key === "default" && "text-muted",
    slotClass,
    className,
  );
}

export function disclosureGroupClass({
  separated,
  variant,
  className,
  slotClass,
}: {
  separated: boolean;
  variant: DisclosureVariant;
  className?: string;
  slotClass?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_DISCLOSURE_VARIANTS, "disclosure.group");
  const key = visual.key;
  return cn(
    "flex w-full flex-col",
    separated && "gap-large",
    !separated && key === "default" && "divide-y-token border-t-token border-b-token",
    !separated &&
      key === "card" &&
      "rounded-mid border-token bg-surface",
    !separated &&
      (key === "outline" || key === "secondary" || key === "ghost") &&
      "gap-small",
    visual.className,
    slotClass,
    className,
  );
}

export function disclosureGroupedCardShell(
  groupCtx: DisclosureGroupContextValue | null,
): boolean {
  return groupCtx != null && !groupCtx.separated && groupCtx.variant === "card";
}

export { TEXT_COLOR_TRANSITION };
