import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_ICON_CLASS,
  SELECTION_INDICATOR_RADIUS_CLASS,
  SELECTION_INDICATOR_SHELL_CLASS,
} from "../SelectionIndicator/selectionIndicatorStyles";
import type { SelectionIndicatorSize } from "../SelectionIndicator/selectionIndicatorTypes";
import {
  KIT_SELECTION_THUMB_VARIANTS,
  type SelectionThumbVariant,
} from "./selectionThumbTypes";

export const SELECTION_THUMB_SHELL_DEFAULT_CLASS =
  "size-full min-h-0 min-w-0 origin-center border border-primary bg-surface";

export const SELECTION_THUMB_SHELL_LAYOUT_CLASS =
  "size-full min-h-0 min-w-0 origin-center";

export const SELECTION_THUMB_ICON_WRAP_CLASS =
  "pointer-events-none z-[2] flex items-center justify-center";

export const SELECTION_THUMB_ICON_INNER_CLASS =
  "icon-slot inline-flex shrink-0 items-center justify-center";

export function selectionThumbShellClass({
  variant = "default",
  size,
  className,
  slotRoot,
}: {
  variant?: SelectionThumbVariant;
  size: SelectionIndicatorSize;
  className?: string;
  slotRoot?: string;
}): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SELECTION_THUMB_VARIANTS,
    "selectionIndicator.root",
  );
  const surface =
    visual.className !== undefined
      ? cn(SELECTION_THUMB_SHELL_LAYOUT_CLASS, visual.className)
      : SELECTION_THUMB_SHELL_DEFAULT_CLASS;

  return cn(
    SELECTION_INDICATOR_SHELL_CLASS,
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    surface,
    slotRoot,
    className,
  );
}

/** Icon color is stable (no on/off / active tint swap). */
export function selectionThumbIconColorClass(
  variant: SelectionThumbVariant = "default",
): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SELECTION_THUMB_VARIANTS,
    "selectionThumbIcon.root",
  );
  if (visual.className !== undefined) return visual.className;
  return "text-primary";
}

export function selectionThumbIconRootClass({
  variant = "default",
  className,
  slotRoot,
}: {
  variant?: SelectionThumbVariant;
  className?: string;
  slotRoot?: string;
}): string {
  return cn(
    SELECTION_THUMB_ICON_WRAP_CLASS,
    selectionThumbIconColorClass(variant),
    slotRoot,
    className,
  );
}

export function selectionThumbIconInnerClass(
  size: SelectionIndicatorSize,
  slotIcon?: string,
): string {
  return cn(
    SELECTION_THUMB_ICON_INNER_CLASS,
    SELECTION_INDICATOR_ICON_CLASS[size],
    slotIcon,
  );
}
