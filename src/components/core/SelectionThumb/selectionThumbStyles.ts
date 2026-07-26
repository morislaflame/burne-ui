import { cn } from "@/utils/cn";

import {
  SELECTION_INDICATOR_ICON_CLASS,
  SELECTION_INDICATOR_RADIUS_CLASS,
  SELECTION_INDICATOR_SHELL_CLASS,
  type SelectionIndicatorSize,
} from "../SelectionIndicator/selectionIndicatorTokens";

export const SELECTION_THUMB_SHELL_GLOSS_CLASS =
  "gloss-indicator size-full min-h-0 min-w-0 origin-center border-0";

export const SELECTION_THUMB_SHELL_DEFAULT_CLASS =
  "size-full min-h-0 min-w-0 origin-center border border-primary bg-surface";

export const SELECTION_THUMB_ICON_WRAP_CLASS =
  "pointer-events-none z-[2] flex items-center justify-center";

export const SELECTION_THUMB_ICON_INNER_CLASS =
  "inline-flex shrink-0 items-center justify-center [&_svg]:size-full";

export function selectionThumbShellClass({
  gloss,
  size,
  className,
  slotRoot,
}: {
  gloss: boolean;
  size: SelectionIndicatorSize;
  className?: string;
  slotRoot?: string;
}): string {
  return gloss
    ? cn(
        SELECTION_INDICATOR_SHELL_CLASS,
        SELECTION_INDICATOR_RADIUS_CLASS[size],
        SELECTION_THUMB_SHELL_GLOSS_CLASS,
        slotRoot,
        className,
      )
    : cn(
        SELECTION_INDICATOR_SHELL_CLASS,
        SELECTION_INDICATOR_RADIUS_CLASS[size],
        SELECTION_THUMB_SHELL_DEFAULT_CLASS,
        slotRoot,
        className,
      );
}

/** Icon color is stable (no on/off / active tint swap). */
export function selectionThumbIconColorClass(gloss: boolean): string {
  return gloss ? "text-foreground" : "text-primary";
}

export function selectionThumbIconRootClass({
  gloss,
  className,
  slotRoot,
}: {
  gloss: boolean;
  className?: string;
  slotRoot?: string;
}): string {
  return cn(
    SELECTION_THUMB_ICON_WRAP_CLASS,
    selectionThumbIconColorClass(gloss),
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
