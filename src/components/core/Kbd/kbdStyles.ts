import type { TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
 
import type { KitKbdVariant, KbdSize, KbdVariant } from "./kbdTypes";
import { KIT_KBD_VARIANTS } from "./kbdTypes";
 
export const KBD_VARIANT_SURFACE: Record<KitKbdVariant, string> = {
  default: "bg-surface border-token text-foreground",
  primary: "bg-primary border border-transparent text-primary-foreground",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};
 
export const KBD_TEXT_VARIANT: Record<KbdSize, TextVariant> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "mid",
};
 
/** Same tight line-box as Badge / panel titles (`leading-none`). */
export const KBD_TEXT_CLASS = "leading-none";
 
export const KBD_LAYOUT: Record<KbdSize, string> = {
  small: "px-[length:var(--chip-px-small)] py-[length:var(--chip-py-small)]",
  base: "px-[length:var(--chip-px-base)] py-[length:var(--chip-py-base)]",
  mid: "px-[length:var(--chip-px-mid)] py-[length:var(--chip-py-mid)]",
  large: "px-[length:var(--chip-px-large)] py-[length:var(--chip-py-large)]",
};
 
export const KBD_ROOT_BASE_CLASS =
  "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center whitespace-nowrap rounded-small font-mono motion-reduce:transition-none";
 
export const KBD_GROUP_BASE_CLASS = "inline-flex items-center gap-xsmall";
 
export const KBD_GROUP_SEPARATOR_CLASS = "select-none text-muted text-xsmall leading-none";
 
export function kbdSurfaceClass(variant: KbdVariant): string {
  const visual = resolveVariantVisual(variant, KIT_KBD_VARIANTS, "kbd.root");
  if (visual.className !== undefined) return visual.className;
  return KBD_VARIANT_SURFACE[visual.key];
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
  return cn(
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
