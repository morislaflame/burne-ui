import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import type { TabsOrientation, TabsSize, TabsVariant } from "./tabsTypes";

const LIST_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "",
  outline: "bg-transparent border-token-outline rounded-mid p-xsmall",
  secondary: "bg-secondary border-token rounded-mid p-xsmall",
  gloss: "border-0 p-small",
};

const INDICATOR_VARIANT_CLASS: Record<TabsVariant, string> = {
  default: "bg-primary",
  outline: "bg-secondary",
  secondary: "bg-tertiary",
  gloss: "bg-tertiary",
};

export function tabsRootClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: TabsOrientation;
  slotClass?: string;
  className?: string;
}) {
  return cn(
    "flex min-w-0 text-left",
    orientation === "horizontal" ? "flex-col gap-large" : "flex-row gap-large",
    slotClass,
    className,
  );
}

export function tabsListClass({
  orientation,
  variant,
  slotClass,
  className,
}: {
  orientation: TabsOrientation;
  variant: TabsVariant;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";
  const isSurface = variant === "outline" || variant === "secondary" || variant === "gloss";

  return cn(
    "relative box-border min-w-0 w-fit",
    orientation === "horizontal"
      ? cn(
          "flex flex-row flex-wrap gap-xsmall",
          isSurface ? "items-center" : "items-stretch border-b-token",
        )
      : cn(
          "flex flex-col gap-xsmall",
          isSurface ? "items-start" : "items-stretch border-l-token",
        ),
    isGloss && "gloss-panel rounded-mid text-foreground",
    LIST_VARIANT_CLASS[variant],
    slotClass,
    className,
  );
}

export function tabsIndicatorClass({
  variant,
  slotClass,
}: {
  variant: TabsVariant;
  slotClass?: string;
}) {
  return cn(
    "pointer-events-none absolute z-0 motion-reduce:transition-none",
    variant === "default" ? "rounded-full" : "rounded-mid",
    INDICATOR_VARIANT_CLASS[variant],
    slotClass,
  );
}

export function tabsTabClass({
  size,
  variant,
  isSelected,
  isDisabled,
  slotClass,
  className,
}: {
  size: TabsSize;
  variant: TabsVariant;
  isSelected: boolean;
  isDisabled: boolean | undefined;
  slotClass?: string;
  className?: string;
}) {
  const layout = CONTROL_SIZE_LAYOUT[size];
  const isSurface = variant === "outline" || variant === "secondary" || variant === "gloss";

  return cn(
    "relative z-[1] m-0 inline-flex shrink-0 appearance-none items-center justify-center border-0 bg-transparent outline-none",
    layout.padX,
    layout.padY,
    isSurface && "rounded-mid",
    "focus-ring-inset",
    isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
    isSelected ? "text-primary" : "text-muted hover:text-primary",
    !isSelected && !isDisabled && TEXT_COLOR_TRANSITION,
    slotClass,
    className,
  );
}

export const TABS_TAB_AS_CHILD_CLASS = "relative z-[1] shrink-0";

export function tabsTabTextClass(slotClass?: string) {
  return cn(
    "inline-flex origin-center items-center gap-xsmall",
    slotClass,
  );
}

export function tabTextVariant(size: TabsSize) {
  return CONTROL_SIZE_LAYOUT[size].controlText;
}

export function tabsPanelClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}) {
  return cn("min-w-0 outline-none focus-ring-inset", slotClass, className);
}
