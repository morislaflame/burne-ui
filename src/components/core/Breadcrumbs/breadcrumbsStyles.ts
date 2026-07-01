import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

const CRUMB_INTERACTIVE_INNER_CLASS = cn(
  "inline-flex max-w-[min(12rem,46vw)] min-w-0 cursor-pointer truncate rounded-mid px-xsmall py-xsmall text-muted no-underline outline-none",
  TEXT_COLOR_TRANSITION,
  "hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
);

const CRUMB_INTERACTIVE_BUTTON_CLASS = cn(
  CRUMB_INTERACTIVE_INNER_CLASS,
  "border-0 bg-transparent font-[inherit]",
);

const BREADCRUMBS_ELLIPSIS_TRIGGER_CLASS = cn(
  "inline-flex min-w-0 cursor-pointer rounded-mid border-0 bg-transparent px-xsmall py-xsmall font-[inherit] text-muted outline-none",
  TEXT_COLOR_TRANSITION,
  "hover:text-foreground aria-expanded:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
);

export function breadcrumbsListClass(className?: string): string {
  return cn(
    "m-0 flex list-none flex-wrap items-center gap-xsmall gap-y-xsmall p-0 text-left",
    className,
  );
}

export function breadcrumbListItemClass(className?: string): string {
  return cn("flex items-center gap-xsmall", className);
}

export function breadcrumbCurrentClass(className?: string): string {
  return cn(
    "min-w-0 max-w-[min(14rem,50vw)] truncate px-xsmall py-xsmall font-medium text-foreground",
    className,
  );
}

export function breadcrumbStaticClass(className?: string): string {
  return cn("max-w-[min(12rem,46vw)] truncate px-xsmall py-xsmall text-muted", className);
}

export function breadcrumbChevronClass(className?: string): string {
  return cn("shrink-0 text-muted opacity-75 icon-small", className);
}

export function crumbInteractiveInnerClass(className?: string): string {
  return cn(CRUMB_INTERACTIVE_INNER_CLASS, className);
}

export function crumbInteractiveButtonClass(className?: string): string {
  return cn(CRUMB_INTERACTIVE_BUTTON_CLASS, className);
}

export function crumbInteractiveWrapperClass(className?: string): string {
  return cn("inline-flex min-w-0", className);
}

export function crumbInteractiveTextClass(className?: string): string {
  return cn(
    "inline-flex origin-center min-w-0 truncate will-change-transform",
    className,
  );
}

export function breadcrumbsEllipsisTriggerClass(className?: string): string {
  return cn(BREADCRUMBS_ELLIPSIS_TRIGGER_CLASS, className);
}

export function breadcrumbsEllipsisLiftWrapperClass(className?: string): string {
  return cn("inline-flex origin-center will-change-transform", className);
}

export function breadcrumbsEllipsisTextClass(className?: string): string {
  return cn("tabular-nums", className);
}

export function breadcrumbsDropdownItemClass(className?: string): string {
  return cn("text-small", className);
}

export function breadcrumbsEllipsisPopoverBodyClass(className?: string): string {
  return cn("p-small", className);
}

export function breadcrumbsSeparatorClass(className?: string): string {
  return cn("inline-flex", className);
}
