import { cn } from "@/utils/cn";

export function accordionRootClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    "flex w-full flex-col text-left",
    "[&>[data-accordion-item]:first-child]:!rounded-t-mid",
    "[&>[data-accordion-item]:last-child]:!rounded-b-mid",
    "[&>[data-accordion-item]:not(:first-child)]:-mt-px",
    slotClass,
    className,
  );
}

/** `item` slot is applied on the wrapped `Expandable` via `classNames.root`, not here. */
export function accordionItemClass(className?: string): string {
  return cn("relative !rounded-none", className);
}

export function accordionHeadingClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return cn("m-0 font-[inherit] text-[inherit]", slotClass, className);
}

export function accordionChevronClass({
  className,
  slotClass,
}: {
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    "relative z-[1] flex shrink-0 origin-center self-center",
    slotClass,
    className,
  );
}

export function accordionBodyClass(className?: string): string {
  return cn("text-muted", className);
}

export const ACCORDION_CHEVRON_CLASS = "shrink-0";
