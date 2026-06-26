import { cn } from "@/utils/cn";

import type { ComponentSize } from "./componentSize";
import { CONTROL_SIZE_LAYOUT } from "./controlSizeLayout";

/** Корень prefix/suffix-слота — растягивается на всю высоту shell (flex + min-height). */
export function affixSlotClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(
    "flex self-stretch shrink-0 items-center text-muted",
    layout.affixPadX,
    layout.affixText,
  );
}

const AFFIX_TOGGLE_MIN_W: Record<ComponentSize, string> = {
  small: "min-w-control-small",
  base: "min-w-control-base",
  mid: "min-w-control-mid",
  large: "min-w-control-large",
};

/** Минимальная ширина кнопки в affix (password toggle и т.п.). */
export function affixToggleMinWClass(size: ComponentSize): string {
  return AFFIX_TOGGLE_MIN_W[size];
}
