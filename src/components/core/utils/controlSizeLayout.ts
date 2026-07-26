import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";

export type ControlSizeLayout = {
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
  rounded: string;
};

export const CONTROL_SIZE_LAYOUT: Record<ComponentSize, ControlSizeLayout> = {
  small: {
    minWButton: "min-w-button-small",
    padX: "px-base",
    padY: "py-xsmall",
    affixPadX: "px-base",
    affixText: "text-base",
    controlPad: "px-base py-xsmall text-small",
    controlText: "small",
    icon: "icon-small",
    chevronIcon: "icon-small",
    spinnerIcon: "icon-small",
    spinnerBorder: "border-2",
    rounded: "rounded-small",
  },
  base: {
    minWButton: "min-w-button-base",
    padX: "px-mid",
    padY: "py-small",
    affixPadX: "px-mid",
    affixText: "text-base",
    controlPad: "px-mid py-small text-base",
    controlText: "base",
    icon: "icon-base",
    chevronIcon: "icon-base",
    spinnerIcon: "icon-base",
    spinnerBorder: "border-2",
    rounded: "rounded-base",
  },
  mid: {
    minWButton: "min-w-button-mid",
    padX: "px-large",
    padY: "py-base",
    affixPadX: "px-large",
    affixText: "text-mid",
    controlPad: "px-large py-base text-mid",
    controlText: "mid",
    icon: "icon-mid",
    chevronIcon: "icon-mid",
    spinnerIcon: "icon-mid",
    spinnerBorder: "border-2",
    rounded: "rounded-mid",
  },
  large: {
    minWButton: "min-w-button-large",
    padX: "px-xlarge",
    padY: "py-mid",
    affixPadX: "px-xlarge",
    affixText: "text-large",
    controlPad: "px-xlarge py-mid text-large",
    controlText: "large",
    icon: "icon-large",
    chevronIcon: "icon-large",
    spinnerIcon: "icon-large",
    spinnerBorder: "border-[2.5px]",
    rounded: "rounded-large",
  },
};
