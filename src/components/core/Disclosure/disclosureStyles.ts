import { CONTROL_SIZE_LAYOUT, collapsibleSizeLayout } from "@/components/core/utils/sizeLayout";
import { TEXT_COLOR_TRANSITION, hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { isFramedVariant } from "./disclosureAPI";
import type { DisclosureGroupContextValue, DisclosureSize, DisclosureVariant } from "./disclosureTypes";

const VARIANT_ROOT: Record<DisclosureVariant, string> = {
  default: "flex flex-col",
  outline: "flex flex-col",
  secondary: "flex flex-col",
  card: "overflow-hidden rounded-base border-token bg-surface shadow-token-base",
  ghost: "flex flex-col",
  gloss: "flex flex-col",
};

const FRAMED_PANEL: Record<DisclosureVariant, string> = {
  default: "bg-surface border-token rounded-mid text-foreground",
  outline: "bg-transparent border-token-outline rounded-mid text-foreground",
  secondary: "bg-secondary border-token rounded-mid text-secondary-foreground",
  card: "bg-surface border-token rounded-mid text-foreground",
  ghost: "bg-transparent border-token rounded-mid text-foreground",
  gloss: "bg-transparent border-0 text-foreground",
};

const TRIGGER_INTERACTIVE = cn("bg-transparent text-foreground", hoverVariant());

const VARIANT_TRIGGER: Record<DisclosureVariant, string> = {
  default: cn("rounded-mid", TRIGGER_INTERACTIVE),
  outline: cn("rounded-mid", TRIGGER_INTERACTIVE),
  secondary: cn("rounded-mid", TRIGGER_INTERACTIVE),
  card: TRIGGER_INTERACTIVE,
  ghost: cn("rounded-mid", TRIGGER_INTERACTIVE),
  gloss: cn("rounded-mid", TRIGGER_INTERACTIVE),
};

export const DISCLOSURE_TRIGGER_BASE_CLASS =
  "flex w-full select-none items-center gap-small text-left outline-none focus-ring";

export const DISCLOSURE_TRIGGER_DISABLED_CLASS = "cursor-not-allowed opacity-48";

export const DISCLOSURE_TRIGGER_ENABLED_CLASS = "cursor-pointer";

export const DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS =
  "min-w-0 flex-1 origin-center";

export const DISCLOSURE_TRIGGER_TITLE_CLASS = "block";

export const DISCLOSURE_TRIGGER_ICON_BASE_CLASS =
  "inline-flex shrink-0 text-primary [&_svg]:size-full";

export const DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS =
  "inline-flex shrink-0 origin-center items-center justify-center text-muted";

export const DISCLOSURE_TRIGGER_CHEVRON_ICON_CLASS = "size-full";

export const DISCLOSURE_TRIGGER_CHEVRON_OPEN_CLASS = "text-primary";

export const DISCLOSURE_CONTENT_SHELL_CLASS = "overflow-hidden";

export const DISCLOSURE_HANDLE_BASE_CLASS =
  "flex touch-none select-none shrink-0 cursor-grab items-center justify-center border-t-token py-xsmall active:cursor-grabbing";

export const DISCLOSURE_HANDLE_DISABLED_CLASS = "pointer-events-none opacity-48";

export const DISCLOSURE_HANDLE_GRIP_CLASS = "h-1 w-10 rounded-full bg-tertiary";

export const DISCLOSURE_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep rounded-mid text-foreground";

export const DISCLOSURE_GLOSS_CONTENT_CLASS = "gloss-content text-muted";

export function disclosureTriggerShell(size: DisclosureSize) {
  const collapsible = collapsibleSizeLayout(size);
  return {
    pad: collapsible.triggerPadding,
    text: collapsible.titleVariant,
    titleClassName: collapsible.titleClassName,
    icon: CONTROL_SIZE_LAYOUT[size].icon,
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
  const rootCls =
    variant === "card" && groupedCardShell ? "" : VARIANT_ROOT[variant];

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

  return cn(
    DISCLOSURE_TRIGGER_BASE_CLASS,
    shell.pad,
    VARIANT_TRIGGER[variant],
    disabled
      ? DISCLOSURE_TRIGGER_DISABLED_CLASS
      : DISCLOSURE_TRIGGER_ENABLED_CLASS,
    slotClass,
    className,
  );
}

export function disclosureContentWrapClass(variant: DisclosureVariant): string | undefined {
  if (variant === "outline" || variant === "secondary" || variant === "gloss") {
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
  const framed = isFramedVariant(variant);

  return cn(
    collapsibleSizeLayout(size).contentPadding,
    framed && variant === "outline" && FRAMED_PANEL.outline,
    framed && variant === "secondary" && FRAMED_PANEL.secondary,
    variant === "card" && "border-t-token",
    variant === "ghost" && "text-muted",
    variant === "default" && "text-muted",
    slotClass,
    className,
  );
}

export function disclosureGlossContentClass(
  size: DisclosureSize,
  slotClass?: string,
): string {
  return cn(
    DISCLOSURE_GLOSS_CONTENT_CLASS,
    collapsibleSizeLayout(size).contentPadding,
    slotClass,
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
  return cn(
    "flex w-full flex-col",
    separated && "gap-large",
    !separated && variant === "default" && "divide-y-token border-t-token border-b-token",
    !separated &&
      variant === "card" &&
      "overflow-hidden rounded-mid border-token bg-surface shadow-token-base divide-y-token",
    !separated &&
      (variant === "outline" ||
        variant === "secondary" ||
        variant === "ghost" ||
        variant === "gloss") &&
      "gap-small",
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
