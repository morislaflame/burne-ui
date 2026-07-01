import { mergeAccordionSlotClass } from "./accordionAPI";

export function accordionRootClass(className?: string): string {
  return mergeAccordionSlotClass(
    "flex w-full flex-col text-left",
    "[&>[data-accordion-item]:first-child]:!rounded-t-mid",
    "[&>[data-accordion-item]:last-child]:!rounded-b-mid",
    "[&>[data-accordion-item]:not(:first-child)]:-mt-px",
    className,
  );
}

export function accordionItemClass(className?: string): string {
  return mergeAccordionSlotClass("relative !rounded-none", className);
}

export function accordionHeadingClass(className?: string): string {
  return mergeAccordionSlotClass("m-0 font-[inherit] text-[inherit]", className);
}

export function accordionIndicatorClass(className?: string): string {
  return mergeAccordionSlotClass(
    "relative z-[1] flex shrink-0 origin-center self-center",
    className,
  );
}

export function accordionBodyClass(className?: string): string {
  return mergeAccordionSlotClass("text-muted", className);
}

export const ACCORDION_CHEVRON_CLASS = "shrink-0";
