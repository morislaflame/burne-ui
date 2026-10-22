import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { ContainerMaxWidth, ContainerPadding } from "./containerTypes";

export const CONTAINER_BASE_CLASS = "mx-auto w-full min-w-0";

export const CONTAINER_MAX_WIDTH_CLASS = {
  xsmall: "max-w-page-xsmall",
  small: "max-w-page-small",
  base: "max-w-page-base",
  mid: "max-w-page-mid",
  large: "max-w-page-large",
  xlarge: "max-w-page-xlarge",
  "2xlarge": "max-w-page-2xlarge",
} as const satisfies Record<ContainerMaxWidth, string>;

export const CONTAINER_PADDING_CLASS = {
  xsmall: "px-xsmall",
  small: "px-small",
  base: "px-base",
  mid: "px-mid",
  large: "px-large",
  xlarge: "px-xlarge",
  "2xlarge": "px-2xlarge",
  "3xlarge": "px-3xlarge",
} as const satisfies Record<ContainerPadding, string>;

export function containerRootClass({
  maxWidth,
  padding,
  slotClass,
  className,
}: {
  maxWidth: ContainerMaxWidth;
  padding: ContainerPadding;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    CONTAINER_BASE_CLASS,
    CONTAINER_MAX_WIDTH_CLASS[maxWidth],
    CONTAINER_PADDING_CLASS[padding],
    layoutTargetClass("container.root"),
    slotClass,
    className,
  );
}
