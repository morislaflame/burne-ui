import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { ResizableOrientation } from "./resizableTypes";

export const RESIZABLE_ROOT_CLASS = "flex min-h-0 w-full min-w-0";

export const RESIZABLE_ORIENTATION_CLASS = {
  horizontal: "flex-row",
  vertical: "flex-col",
} as const satisfies Record<ResizableOrientation, string>;

export const RESIZABLE_PANEL_CLASS = "min-h-0 min-w-0 overflow-auto";

export const RESIZABLE_PANEL_FLEX_CLASS = "flex-1";

export const RESIZABLE_PANEL_FIXED_CLASS = "shrink-0 grow-0";

export const RESIZABLE_HANDLE_CLASS =
  "relative flex shrink-0 touch-none items-center justify-center bg-transparent focus-ring";

export const RESIZABLE_HANDLE_AXIS_CLASS = {
  horizontal: "w-small cursor-col-resize self-stretch border-s-token",
  vertical: "h-small cursor-row-resize self-stretch border-t-token",
} as const satisfies Record<ResizableOrientation, string>;

export function resizableRootClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: ResizableOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    RESIZABLE_ROOT_CLASS,
    RESIZABLE_ORIENTATION_CLASS[orientation],
    layoutTargetClass("resizable.root"),
    slotClass,
    className,
  );
}

export function resizablePanelClass({
  fixed,
  slotClass,
  className,
}: {
  fixed: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    RESIZABLE_PANEL_CLASS,
    fixed ? RESIZABLE_PANEL_FIXED_CLASS : RESIZABLE_PANEL_FLEX_CLASS,
    slotClass,
    className,
  );
}

export function resizableHandleClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: ResizableOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    RESIZABLE_HANDLE_CLASS,
    RESIZABLE_HANDLE_AXIS_CLASS[orientation],
    slotClass,
    className,
  );
}
