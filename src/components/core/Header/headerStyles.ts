import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const HEADER_BASE_CLASS =
  "flex min-h-control-base w-full min-w-0 items-center gap-mid border-b-token bg-surface px-large text-foreground";

export const HEADER_STICKY_CLASS = "sticky top-0 z-sticky";

export function headerRootClass({
  sticky,
  skinVariant,
  slotClass,
  className,
}: {
  sticky: boolean;
  skinVariant?: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    HEADER_BASE_CLASS,
    sticky && HEADER_STICKY_CLASS,
    layoutTargetClass("header.root", skinVariant),
    slotClass,
    className,
  );
}
