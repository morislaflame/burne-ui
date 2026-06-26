import { cn } from "@/utils/cn";

import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

/** Рамка для статичного текста в ButtonGroup — выравнивание по высоте кнопок. */
export function buttonGroupTextFrameClass(size: ComponentSize): string {
  const { h, padX, padY } = CONTROL_SIZE_LAYOUT[size];
  return cn(h, padX, padY);
}

/** @deprecated Используйте `buttonGroupTextFrameClass`. */
export const controlTextFrameClass = buttonGroupTextFrameClass;
