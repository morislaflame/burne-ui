import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { TEXT_COLOR_TRANSITION, hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { isFramedVariant, mergeDisclosureSlotClass } from "./disclosureAPI";
import type { DisclosureGroupContextValue, DisclosureSize, DisclosureVariant } from "./disclosureTypes";

export const DISCLOSURE_CONTENT_PAD: Record<DisclosureSize, string> = {
  small: "p-base",
  base: "p-plus",
  mid: "p-mid",
  large: "p-large",
};

const VARIANT_ROOT: Record<DisclosureVariant, string> = {
  default: "flex flex-col",
  outline: "flex flex-col",
  secondary: "flex flex-col",
  card: "overflow-hidden rounded-base border-token bg-surface shadow-token-sm",
  ghost: "flex flex-col",
  gloss: "flex flex-col",
};

const FRAMED_PANEL: Record<DisclosureVariant, string> = {
  default: "bg-surface border-token rounded-mid text-foreground",
  outline: "bg-transparent border-token rounded-mid text-foreground",
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
  "flex w-full select-none items-center gap-small text-left outline-none focus-ring py-base";

export const DISCLOSURE_TRIGGER_DISABLED_CLASS = "cursor-not-allowed opacity-48";

export const DISCLOSURE_TRIGGER_ENABLED_CLASS = "cursor-pointer";

export const DISCLOSURE_TRIGGER_TITLE_LIFT_CLASS =
  "min-w-0 flex-1 origin-center will-change-transform";

export const DISCLOSURE_TRIGGER_TITLE_CLASS = "block font-medium";

export const DISCLOSURE_TRIGGER_CHEVRON_BASE_CLASS =
  "inline-flex shrink-0 origin-center items-center justify-center text-muted";

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
  const layout = CONTROL_SIZE_LAYOUT[size];
  return {
    minH: layout.h.replace(/^h-/, "min-h-"),
    padX: layout.padX,
    text: layout.controlText,
    chevron: layout.chevronIcon,
  };
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

  return mergeDisclosureSlotClass(rootCls, className, slotClass);
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

  return mergeDisclosureSlotClass(
    DISCLOSURE_TRIGGER_BASE_CLASS,
    shell.minH,
    shell.padX,
    VARIANT_TRIGGER[variant],
    disabled
      ? DISCLOSURE_TRIGGER_DISABLED_CLASS
      : DISCLOSURE_TRIGGER_ENABLED_CLASS,
    className,
    slotClass,
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

  return mergeDisclosureSlotClass(
    DISCLOSURE_CONTENT_PAD[size],
    framed && variant === "outline" && FRAMED_PANEL.outline,
    framed && variant === "secondary" && FRAMED_PANEL.secondary,
    variant === "card" && "border-t-token",
    variant === "ghost" && "text-muted",
    variant === "default" && "text-muted",
    className,
    slotClass,
  );
}

export function disclosureGlossContentClass(
  size: DisclosureSize,
  slotClass?: string,
): string {
  return mergeDisclosureSlotClass(
    DISCLOSURE_GLOSS_CONTENT_CLASS,
    DISCLOSURE_CONTENT_PAD[size],
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
  return mergeDisclosureSlotClass(
    "flex w-full flex-col",
    separated && "gap-mid",
    !separated && variant === "default" && "divide-y-token border-t-token border-b-token",
    !separated &&
      variant === "card" &&
      "overflow-hidden rounded-mid border-token bg-surface shadow-token-sm divide-y-token",
    !separated &&
      (variant === "outline" ||
        variant === "secondary" ||
        variant === "ghost" ||
        variant === "gloss") &&
      "gap-small",
    className,
    slotClass,
  );
}

export function disclosureGroupedCardShell(
  groupCtx: DisclosureGroupContextValue | null,
): boolean {
  return groupCtx != null && !groupCtx.separated && groupCtx.variant === "card";
}

export { TEXT_COLOR_TRANSITION };
