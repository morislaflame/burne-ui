import { cn } from "@/utils/cn";

import { CONTROL_SIZE_LAYOUT, type ComponentSize } from "@/components/core/utils/sizeLayout";

/** Prefix/suffix slot root — stretches to full shell height (flex + min-height). */
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

/** Minimum button width in affix (password toggle, etc.). */
export function affixToggleMinWClass(size: ComponentSize): string {
  return AFFIX_TOGGLE_MIN_W[size];
}
