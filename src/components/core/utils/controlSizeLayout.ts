import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";

export type ControlSizeLayout = {
  /** Фиксированная высота контрола (совпадает с `--control-height-*`). */
  h: string;
  minWButton: string;
  padX: string;
  padY: string;
  affixPadX: string;
  affixText: string;
  controlPad: string;
  controlText: TextVariant;
  icon: string;
  chevronIcon: string;
  spinnerIcon: string;
  spinnerBorder: string;
  toggleBox: string;
  toggleIcon: string;
  togglePad: string;
};

export const CONTROL_SIZE_LAYOUT: Record<ComponentSize, ControlSizeLayout> = {
  small: {
    h: "h-control-small",
    minWButton: "min-w-button-small",
    padX: "px-base",
    padY: "py-xsmall",
    affixPadX: "px-base",
    affixText: "text-base",
    controlPad: "px-base py-xsmall text-base",
    controlText: "small",
    icon: "icon-small",
    chevronIcon: "icon-small",
    spinnerIcon: "icon-small",
    spinnerBorder: "border-2",
    toggleBox: "h-control-small w-control-small",
    toggleIcon: "icon-small",
    togglePad: "px-xsmall",
  },
  base: {
    h: "h-control-base",
    minWButton: "min-w-button-base",
    padX: "px-plus",
    padY: "py-small",
    affixPadX: "px-plus",
    affixText: "text-base",
    controlPad: "px-plus py-small text-base",
    controlText: "base",
    icon: "icon-base",
    chevronIcon: "icon-base",
    spinnerIcon: "icon-base",
    spinnerBorder: "border-2",
    toggleBox: "h-control-base w-control-base",
    toggleIcon: "icon-base",
    togglePad: "px-small",
  },
  mid: {
    h: "h-control-mid",
    minWButton: "min-w-button-mid",
    padX: "px-plus",
    padY: "py-base",
    affixPadX: "px-mid",
    affixText: "text-mid",
    controlPad: "px-mid py-base text-mid",
    controlText: "mid",
    icon: "icon-large",
    chevronIcon: "icon-large",
    spinnerIcon: "icon-large",
    spinnerBorder: "border-2",
    toggleBox: "h-control-mid w-control-mid",
    toggleIcon: "icon-large",
    togglePad: "px-base",
  },
  large: {
    h: "h-control-large",
    minWButton: "min-w-button-large",
    padX: "px-large",
    padY: "py-plus",
    affixPadX: "px-large",
    affixText: "text-mid",
    controlPad: "px-large py-plus text-mid",
    controlText: "mid",
    icon: "icon-large",
    chevronIcon: "icon-large",
    spinnerIcon: "icon-large",
    spinnerBorder: "border-[2.5px]",
    toggleBox: "h-control-large w-control-large",
    toggleIcon: "icon-large",
    togglePad: "px-plus",
  },
};
