import { cn } from "@/utils/cn";

import type { SeparatorOrientation } from "./separatorTypes";

export const SEPARATOR_BASE_CLASS = "box-border shrink-0";

export const SEPARATOR_HORIZONTAL_CLASS =
  "my-xsmall h-0 w-full min-w-0 max-w-full border-t-token";

export const SEPARATOR_VERTICAL_CLASS =
  "mx-xsmall min-h-[1.5rem] w-0 self-stretch border-l-token";

export function separatorRootClass(
  orientation: SeparatorOrientation,
  className?: string,
): string {
  return cn(
    SEPARATOR_BASE_CLASS,
    orientation === "horizontal" ? SEPARATOR_HORIZONTAL_CLASS : SEPARATOR_VERTICAL_CLASS,
    className,
  );
}
