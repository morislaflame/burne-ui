import { cn } from "@/utils/cn";

import type { ScrollAreaOrientation, ScrollAxis } from "./scrollAreaTypes";

export const SCROLL_AREA_ROOT_CLASS = "relative min-h-0 min-w-0 overflow-hidden";

export const SCROLL_AREA_VIEWPORT_CLASS =
  "size-full min-h-0 min-w-0 overscroll-contain outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export function scrollAreaViewportOverflow(orientation: ScrollAreaOrientation): string {
  if (orientation === "vertical") return "overflow-x-hidden overflow-y-auto";
  if (orientation === "horizontal") return "overflow-x-auto overflow-y-hidden";
  return "overflow-auto";
}

/** Layout wrapper. Not a public slot: `w-max` lets a horizontal row grow past the viewport. */
export function scrollAreaContentClass(orientation: ScrollAreaOrientation): string {
  if (orientation === "vertical") return "w-full";
  return "w-max min-w-full";
}

export const SCROLL_AREA_SCROLLBAR_CLASS =
  "absolute flex touch-none select-none rounded-full bg-border opacity-0 pointer-events-none transition-[opacity] duration-[var(--motion-surface-duration)] ease-[var(--motion-surface-ease)] motion-reduce:transition-none data-[state=active]:pointer-events-auto data-[state=active]:opacity-100";

export function scrollAreaScrollbarAxisClass(axis: ScrollAxis): string {
  if (axis === "vertical") return "top-0 bottom-0 end-0 w-small flex-col";
  return "start-0 end-0 bottom-0 h-small flex-row";
}

export const SCROLL_AREA_THUMB_CLASS = "rounded-full bg-foreground/40";

export function scrollAreaThumbAxisClass(axis: ScrollAxis): string {
  if (axis === "vertical") return "w-full";
  return "h-full";
}

export const SCROLL_AREA_CORNER_CLASS = "absolute end-0 bottom-0 size-small bg-border";

export function scrollAreaRootClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(SCROLL_AREA_ROOT_CLASS, slotClass, className);
}

export function scrollAreaViewportClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: ScrollAreaOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    SCROLL_AREA_VIEWPORT_CLASS,
    scrollAreaViewportOverflow(orientation),
    slotClass,
    className,
  );
}

export function scrollAreaScrollbarClass({
  axis,
  slotClass,
  className,
}: {
  axis: ScrollAxis;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    SCROLL_AREA_SCROLLBAR_CLASS,
    scrollAreaScrollbarAxisClass(axis),
    "outline-none focus-ring-inset",
    slotClass,
    className,
  );
}

export function scrollAreaThumbClass({
  axis,
  slotClass,
  className,
}: {
  axis: ScrollAxis;
  slotClass?: string;
  className?: string;
}): string {
  return cn(SCROLL_AREA_THUMB_CLASS, scrollAreaThumbAxisClass(axis), slotClass, className);
}

export function scrollAreaCornerClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(SCROLL_AREA_CORNER_CLASS, slotClass, className);
}
