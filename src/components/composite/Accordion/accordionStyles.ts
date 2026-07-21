import { cn } from "@/utils/cn";

export function accordionRootClass(className?: string): string {
  return cn(
    "flex w-full flex-col text-left",
    "[&>[data-accordion-item]:first-child]:!rounded-t-mid",
    "[&>[data-accordion-item]:last-child]:!rounded-b-mid",
    "[&>[data-accordion-item]:not(:first-child)]:-mt-px",
    className,
  );
}

export function accordionItemClass(className?: string): string {
  return cn("relative !rounded-none", className);
}

export function accordionHeadingClass(className?: string): string {
  return cn("m-0 font-[inherit] text-[inherit]", className);
}

export function accordionChevronClass(className?: string): string {
  return cn(
    "relative z-[1] flex shrink-0 origin-center self-center",
    className,
  );
}

export function accordionBodyClass(className?: string): string {
  return cn("text-muted", className);
}

export const ACCORDION_CHEVRON_CLASS = "shrink-0";
