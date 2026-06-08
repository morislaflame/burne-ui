import { cn } from "@/utils/cn";

import type { ScaleOrientation } from "./scaleFieldParts";

export function scaleFieldRootClassName(
  orientation: ScaleOrientation,
  className?: string,
) {
  return cn(
    orientation === "horizontal" ? "w-full" : "w-auto items-center",
    className,
  );
}
