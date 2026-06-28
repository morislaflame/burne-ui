import { cn } from "@/utils/cn";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

export function controlShellClass(
  size: ComponentSize,
  minW = CONTROL_SIZE_LAYOUT[size].minWButton,
): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.h, minW, layout.padX, layout.padY);
}

export function buttonRootClass(size: ComponentSize, iconOnly = false): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(
    layout.h,
    iconOnly ? "min-w-fit" : layout.minWButton,
    layout.padX,
    layout.padY,
  );
}

export function buttonSpinnerClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.spinnerIcon, layout.spinnerBorder);
}
