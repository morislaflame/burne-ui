import { cn } from "@/utils/cn";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

/** Frame for static text in ButtonGroup — alignment of the buttons height. */
export function buttonGroupTextFrameClass(size: ComponentSize): string {
  const { h, padX, padY } = CONTROL_SIZE_LAYOUT[size];
  return cn(h, padX, padY);
}
