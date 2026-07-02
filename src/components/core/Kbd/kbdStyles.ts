import type { TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { mergeKbdSlotClass } from "./kbdAPI";
import type { KbdSize, KbdVariant } from "./kbdTypes";

export const KBD_VARIANT_SURFACE: Record<Exclude<KbdVariant, "gloss">, string> = {
  default: "bg-surface border-token text-foreground",
  primary: "bg-primary border border-transparent text-primary-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

export const KBD_TEXT_VARIANT: Record<KbdSize, TextVariant> = {
  small: "tools",
  base: "tools",
  mid: "small",
  large: "base",
};

export const KBD_LAYOUT: Record<KbdSize, string> = {
  small: "min-h-4 px-xsmall py-0.5",
  base: "min-h-4 px-small py-xsmall",
  mid: "min-h-5 px-base py-xsmall",
  large: "min-h-5 px-base py-xsmall",
};

export const KBD_ROOT_BASE_CLASS =
  "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center whitespace-nowrap rounded-small font-mono motion-reduce:transition-none";

export const KBD_GROUP_BASE_CLASS = "inline-flex items-center gap-xsmall";

export const KBD_GROUP_SEPARATOR_CLASS = "select-none text-muted text-tools";

export function kbdSurfaceClass(variant: KbdVariant): string {
  if (variant === "gloss") {
    return "gloss-panel gloss-deep border-0 text-foreground";
  }
  return KBD_VARIANT_SURFACE[variant];
}

export function kbdRootClass({
  variant,
  size,
  motionClass,
  slotRoot,
  className,
}: {
  variant: KbdVariant;
  size: KbdSize;
  motionClass?: string;
  slotRoot?: string;
  className?: string;
}): string {
  return mergeKbdSlotClass(
    KBD_ROOT_BASE_CLASS,
    kbdSurfaceClass(variant),
    KBD_LAYOUT[size],
    motionClass,
    slotRoot,
    className,
  );
}

export function kbdGroupClass(className?: string, slotGroup?: string): string {
  return cn(KBD_GROUP_BASE_CLASS, slotGroup, className);
}

export function kbdGroupSeparatorClass(slotSeparator?: string): string {
  return cn(KBD_GROUP_SEPARATOR_CLASS, slotSeparator);
}
