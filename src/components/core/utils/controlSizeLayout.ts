import type { TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

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
  /** Множитель `--size` для SSR-fallback (SearchInput и т.п.). */
  heightScale: number;
  defaultExpandedSearchWidth: number;
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
    heightScale: 1.75,
    defaultExpandedSearchWidth: 240,
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
    heightScale: 2.2,
    defaultExpandedSearchWidth: 280,
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
    heightScale: 2.5,
    defaultExpandedSearchWidth: 320,
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
    heightScale: 3,
    defaultExpandedSearchWidth: 360,
  },
};

/** Shell контрола: min-height, min-width, горизонтальные и вертикальные отступы. */
export function controlShellClass(
  size: ComponentSize,
  minW = CONTROL_SIZE_LAYOUT[size].minWButton,
): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.h, minW, layout.padX, layout.padY);
}

/** Корневые классы кнопки (Button, ToggleButton с `min-w-fit`). */
export function buttonRootClass(size: ComponentSize, iconOnly = false): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(
    layout.h,
    iconOnly ? "min-w-fit" : layout.minWButton,
    layout.padX,
    layout.padY,
  );
}

/** Рамка для статичного текста в ButtonGroup — выравнивание по высоте кнопок. */
export function controlTextFrameClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.h, layout.padX, layout.padY);
}

export function buttonSpinnerClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.spinnerIcon, layout.spinnerBorder);
}

/** Корень prefix/suffix-слота — растягивается на всю высоту shell (flex + min-height). */
export function affixSlotClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(
    "flex self-stretch shrink-0 items-center text-muted",
    layout.affixPadX,
    layout.affixText,
  );
}

/** Минимальная ширина кнопки в affix (password toggle и т.п.). */
const AFFIX_TOGGLE_MIN_W: Record<ComponentSize, string> = {
  small: "min-w-control-small",
  base: "min-w-control-base",
  mid: "min-w-control-mid",
  large: "min-w-control-large",
};

export function affixToggleMinWClass(size: ComponentSize): string {
  return AFFIX_TOGGLE_MIN_W[size];
}

const CONTROL_HEIGHT_VAR: Record<ComponentSize, string> = {
  small: "--control-height-small",
  base: "--control-height-base",
  mid: "--control-height-mid",
  large: "--control-height-large",
};

const controlHeightPxCache = new Map<ComponentSize, number>();

function measureControlHeightPx(size: ComponentSize): number | null {
  if (typeof document === "undefined") return null;

  const cached = controlHeightPxCache.get(size);
  if (cached != null) return cached;

  try {
    const dummy = document.createElement("div");
    dummy.style.position = "absolute";
    dummy.style.visibility = "hidden";
    dummy.style.height = `var(${CONTROL_HEIGHT_VAR[size]})`;
    document.body.appendChild(dummy);
    const computedHeight = dummy.getBoundingClientRect().height;
    document.body.removeChild(dummy);
    if (computedHeight > 0) {
      controlHeightPxCache.set(size, computedHeight);
      return computedHeight;
    }
  } catch {
    // fallback ниже
  }

  return null;
}

/** Высота контрола в px — читает `--control-height-*` с `:root`. */
export function readControlHeightPx(size: ComponentSize, rootPx = 16): number {
  return measureControlHeightPx(size) ?? rootPx * CONTROL_SIZE_LAYOUT[size].heightScale;
}
