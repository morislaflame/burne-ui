import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { SidebarSide, SidebarWidth } from "./sidebarTypes";

export const SIDEBAR_BASE_CLASS =
  "flex min-h-0 shrink-0 flex-col gap-small bg-surface p-mid";

export const SIDEBAR_WIDTH_CLASS = {
  xsmall: "w-page-xsmall",
  small: "w-page-small",
  base: "w-page-base",
  mid: "w-page-mid",
  large: "w-page-large",
  xlarge: "w-page-xlarge",
  "2xlarge": "w-page-2xlarge",
} as const satisfies Record<SidebarWidth, string>;

export const SIDEBAR_EDGE_CLASS = {
  start: "border-e-token",
  end: "border-s-token",
} as const satisfies Record<SidebarSide, string>;

export function sidebarRootClass({
  width,
  side,
  slotClass,
  className,
}: {
  width: SidebarWidth;
  side: SidebarSide;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    SIDEBAR_BASE_CLASS,
    SIDEBAR_WIDTH_CLASS[width],
    SIDEBAR_EDGE_CLASS[side],
    layoutTargetClass("sidebar.root"),
    slotClass,
    className,
  );
}
