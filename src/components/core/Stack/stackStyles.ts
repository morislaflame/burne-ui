import { layoutTargetClass } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import type { StackAlign, StackGap, StackJustify, StackOrientation } from "./stackTypes";

export const STACK_BASE_CLASS = "flex min-w-0";

export const STACK_WRAP_CLASS = "flex-wrap";

export const STACK_ORIENTATION_CLASS = {
  vertical: "flex-col",
  horizontal: "flex-row",
} as const;

export const STACK_GAP_CLASS = {
  xsmall: "gap-xsmall",
  small: "gap-small",
  base: "gap-base",
  mid: "gap-mid",
  large: "gap-large",
  xlarge: "gap-xlarge",
  "2xlarge": "gap-2xlarge",
  "3xlarge": "gap-3xlarge",
} as const satisfies Record<StackGap, string>;

export const STACK_ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const satisfies Record<StackAlign, string>;

export const STACK_JUSTIFY_CLASS = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const satisfies Record<StackJustify, string>;

export function stackRootClass({
  orientation,
  gap,
  align,
  justify,
  wrap,
  slotClass,
  className,
}: {
  orientation: StackOrientation;
  gap: StackGap;
  align: StackAlign;
  justify: StackJustify;
  wrap: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    STACK_BASE_CLASS,
    STACK_ORIENTATION_CLASS[orientation],
    STACK_GAP_CLASS[gap],
    STACK_ALIGN_CLASS[align],
    STACK_JUSTIFY_CLASS[justify],
    wrap && STACK_WRAP_CLASS,
    layoutTargetClass("stack.root"),
    slotClass,
    className,
  );
}
