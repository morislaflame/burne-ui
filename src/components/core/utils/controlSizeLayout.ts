import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";

export type ControlSizeLayout = {
  /** Фиксированная высота контрола (совпадает с `--control-height-*`). */
  h: string;
  minWButton: string;
  padX: string;
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
  /** Множитель `--size` для SSR-fallback (SearchInput и т.п.). */
  heightScale: number;
  defaultExpandedSearchWidth: number;
};

export const CONTROL_SIZE_LAYOUT: Record<ComponentSize, ControlSizeLayout> = {
  small: {
    h: "h-control-small",
    minWButton: "min-w-button-small",
    padX: "px-base",
    affixPadX: "px-base",
    affixText: "text-base",
    controlPad: "h-full px-base py-0 text-base",
    controlText: "small",
    icon: "icon-small",
    chevronIcon: "icon-small",
    spinnerIcon: "icon-small",
    spinnerBorder: "border-2",
    toggleBox: "h-control-small w-control-small",
    toggleIcon: "icon-small",
    togglePad: "px-xsmall",
    heightScale: 1.75,
    defaultExpandedSearchWidth: 240,
  },
  base: {
    h: "h-control-base",
    minWButton: "min-w-button-base",
    padX: "px-plus",
    affixPadX: "px-plus",
    affixText: "text-base",
    controlPad: "h-full px-plus py-0 text-base",
    controlText: "base",
    icon: "icon-base",
    chevronIcon: "icon-base",
    spinnerIcon: "icon-base",
    spinnerBorder: "border-2",
    toggleBox: "h-control-base w-control-base",
    toggleIcon: "icon-base",
    togglePad: "px-small",
    heightScale: 2.2,
    defaultExpandedSearchWidth: 280,
  },
  mid: {
    h: "h-control-mid",
    minWButton: "min-w-button-mid",
    padX: "px-plus",
    affixPadX: "px-mid",
    affixText: "text-mid",
    controlPad: "h-full px-mid py-0 text-mid",
    controlText: "mid",
    icon: "icon-large",
    chevronIcon: "icon-large",
    spinnerIcon: "icon-large",
    spinnerBorder: "border-2",
    toggleBox: "h-control-mid w-control-mid",
    toggleIcon: "icon-large",
    togglePad: "px-base",
    heightScale: 2.5,
    defaultExpandedSearchWidth: 320,
  },
  large: {
    h: "h-control-large",
    minWButton: "min-w-button-large",
    padX: "px-large",
    affixPadX: "px-large",
    affixText: "text-mid",
    controlPad: "h-full px-large py-0 text-mid",
    controlText: "mid",
    icon: "icon-large",
    chevronIcon: "icon-large",
    spinnerIcon: "icon-large",
    spinnerBorder: "border-[2.5px]",
    toggleBox: "h-control-large w-control-large",
    toggleIcon: "icon-large",
    togglePad: "px-plus",
    heightScale: 3,
    defaultExpandedSearchWidth: 360,
  },
};

export function controlShellClass(size: ComponentSize, minWButton: string): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return `${layout.h} ${minWButton} ${layout.padX}`;
}

const CONTROL_HEIGHT_VAR: Record<ComponentSize, string> = {
  small: "--control-height-small",
  base: "--control-height-base",
  mid: "--control-height-mid",
  large: "--control-height-large",
};

/** Высота контрола в px — читает `--control-height-*` с `:root`. */
export function readControlHeightPx(size: ComponentSize, rootPx = 16): number {
  if (typeof document !== "undefined") {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(CONTROL_HEIGHT_VAR[size])
      .trim();
    const remMatch = /^([\d.]+)rem$/i.exec(raw);
    if (remMatch) return Number.parseFloat(remMatch[1]!) * rootPx;
    const pxMatch = /^([\d.]+)px$/i.exec(raw);
    if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  }
  return rootPx * CONTROL_SIZE_LAYOUT[size].heightScale;
}
