import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { TabsOrientation, TabsSize, TabsVariant, KitTabsVariant } from "./tabsTypes";
import { KIT_TABS_VARIANTS } from "./tabsTypes";

const LIST_VARIANT_CLASS: Record<KitTabsVariant, string> = {
  default: "",
  outline: "bg-transparent border-token-outline rounded-mid",
  secondary: "bg-secondary border-token rounded-mid",
};

const INDICATOR_VARIANT_CLASS: Record<KitTabsVariant, string> = {
  default: "bg-primary",
  outline: "bg-secondary",
  secondary: "bg-tertiary",
};

/**
 * Inner radius = list radius − frame thickness, so the indicator seats flush in corners.
 * uses `---bw` from `.-panel` (inherits to the indicator).
 */
const SURFACE_INNER_RADIUS_CLASS: Record<"outline" | "secondary", string> = {
  outline: "rounded-[length:calc(max(0px,var(--radius-mid)-var(--border-width-outline)))]",
  secondary: "rounded-[length:calc(max(0px,var(--radius-mid)-var(--border-width)))]",
};

function tabsSurfaceRadiusClass(key: KitTabsVariant): string {
  if (key === "outline") return SURFACE_INNER_RADIUS_CLASS.outline;
  if (key === "secondary") return SURFACE_INNER_RADIUS_CLASS.secondary;
  return "";
}

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
    "flex min-w-0 text-start",
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
  const visual = resolveVariantVisual(variant, KIT_TABS_VARIANTS, "tabs.list");
  const isSurface =
    visual.className !== undefined ||
    visual.key === "outline" ||
    visual.key === "secondary";

  return cn(
    "relative box-border min-w-0 w-fit",
    orientation === "horizontal"
      ? cn(
          "flex flex-row flex-wrap gap-xsmall",
          isSurface ? "items-center" : "items-stretch border-b-token",
        )
      : cn(
          "flex flex-col gap-xsmall",
          isSurface ? "items-start" : "items-stretch border-s-token",
        ),
    visual.className !== undefined
      ? visual.className
      : LIST_VARIANT_CLASS[visual.key],
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
  const visual = resolveVariantVisual(variant, KIT_TABS_VARIANTS, "tabs.indicator");
  return cn(
    "pointer-events-none absolute z-0 motion-reduce:transition-none",
    visual.key === "default" ? "rounded-full" : tabsSurfaceRadiusClass(visual.key),
    visual.className !== undefined
      ? visual.className
      : INDICATOR_VARIANT_CLASS[visual.key],
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
  const visual = resolveVariantVisual(variant, KIT_TABS_VARIANTS, "tabs.tab");
  const isSurface =
    visual.className !== undefined ||
    visual.key === "outline" ||
    visual.key === "secondary";

  return cn(
    "relative z-[1] m-0 inline-flex shrink-0 appearance-none items-center justify-center border-0 bg-transparent outline-none",
    layout.padX,
    layout.padY,
    isSurface && tabsSurfaceRadiusClass(visual.key),
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
