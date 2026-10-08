import { cn } from "@/utils/cn";

import type { StepperOrientation, StepperSize } from "./stepperTypes";

const INDICATOR_SIZE: Record<StepperSize, string> = {
  small: "w-control-small min-h-control-small text-xsmall",
  base: "w-control-base min-h-control-base text-small",
  mid: "w-control-mid min-h-control-mid text-base",
  large: "w-control-large min-h-control-large text-mid",
};

const ICON_SIZE: Record<StepperSize, string> = {
  small: "icon-slot icon-slot-xsmall",
  base: "icon-slot icon-slot-small",
  mid: "icon-slot icon-slot-base",
  large: "icon-slot icon-slot-mid",
};

const TITLE_SIZE: Record<StepperSize, string> = {
  small: "text-xsmall",
  base: "text-small",
  mid: "text-base",
  large: "text-mid",
};

/** Half the mark, so the connector meets the indicator center. Full literals so Tailwind sees them. */
const SEPARATOR_OFFSET: Record<StepperOrientation, Record<StepperSize, string>> = {
  horizontal: {
    small: "mt-[calc((var(--control-size-small)-1px)/2)]",
    base: "mt-[calc((var(--control-size-base)-1px)/2)]",
    mid: "mt-[calc((var(--control-size-mid)-1px)/2)]",
    large: "mt-[calc((var(--control-size-large)-1px)/2)]",
  },
  vertical: {
    small: "ms-[calc((var(--control-size-small)-1px)/2)]",
    base: "ms-[calc((var(--control-size-base)-1px)/2)]",
    mid: "ms-[calc((var(--control-size-mid)-1px)/2)]",
    large: "ms-[calc((var(--control-size-large)-1px)/2)]",
  },
};

export function stepperRootClass(orientation: StepperOrientation, slotClass?: string, className?: string): string {
  return cn(
    "flex w-full min-w-0 list-none p-0",
    orientation === "vertical" ? "flex-col" : "items-start",
    slotClass,
    className,
  );
}

export function stepperItemClass(
  orientation: StepperOrientation,
  isLast: boolean,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    "group flex min-w-0",
    orientation === "vertical" ? "flex-col" : "items-start",
    orientation === "horizontal" && (isLast ? "shrink-0" : "flex-1"),
    slotClass,
    className,
  );
}

export function stepperTriggerClass(orientation: StepperOrientation): string {
  return cn(
    "m-0 min-w-0 cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit outline-none focus-ring rounded-mid disabled:cursor-not-allowed",
    orientation === "vertical"
      ? "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-small gap-y-xsmall text-start"
      : "flex max-w-component-xsmall flex-col items-center gap-xsmall text-center",
  );
}

export function stepperIndicatorClass(
  orientation: StepperOrientation,
  size: StepperSize,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    "relative z-[1] inline-flex shrink-0 items-center justify-center rounded-full border-token bg-surface font-w-mid text-foreground surface-color-transition",
    "group-data-[state=active]:border-transparent group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
    "group-data-[state=checked]:border-token-primary group-data-[state=checked]:text-primary",
    "group-data-[state=inactive]:text-muted-foreground",
    INDICATOR_SIZE[size],
    orientation === "vertical" && "col-start-1 row-start-1 row-span-2 self-center",
    slotClass,
    className,
  );
}

export function stepperIconClass(size: StepperSize): string {
  return ICON_SIZE[size];
}

export function stepperTitleClass(
  orientation: StepperOrientation,
  size: StepperSize,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    "min-w-0 font-w-mid text-foreground",
    "group-data-[state=inactive]:text-muted-foreground",
    TITLE_SIZE[size],
    orientation === "vertical" && "col-start-2 row-start-1",
    slotClass,
    className,
  );
}

export function stepperDescriptionClass(
  orientation: StepperOrientation,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    "min-w-0 text-xsmall text-muted",
    orientation === "vertical" && "col-start-2 row-start-2",
    slotClass,
    className,
  );
}

export function stepperSeparatorClass(
  orientation: StepperOrientation,
  size: StepperSize,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    "bg-border group-data-[state=checked]:bg-primary",
    orientation === "vertical" ? "min-h-base w-px flex-none my-xsmall" : "mx-small h-px min-w-small flex-1",
    SEPARATOR_OFFSET[orientation][size],
    slotClass,
    className,
  );
}
