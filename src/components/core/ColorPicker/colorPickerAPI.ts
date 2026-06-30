import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

import type { ColorSwatchSize } from "./ColorSwatch";
import type { ColorSliderSize } from "./ColorSlider";
import { hexToHsva, type HSVA } from "./colorUtils";
import type { ColorPickerSize } from "./colorPickerTypes";

export function mergeColorPickerSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export const COLOR_PICKER_DEFAULT_HEX = "#3b82f6";

export const COLOR_PICKER_FALLBACK_HSVA: HSVA = { h: 217, s: 90, v: 96, a: 100 };

export function colorPickerInitialHsva(value?: string, defaultValue?: string): HSVA {
  return hexToHsva(value ?? defaultValue ?? COLOR_PICKER_DEFAULT_HEX) ?? COLOR_PICKER_FALLBACK_HSVA;
}

export const COLOR_PICKER_SWATCH_SIZE_MAP: Record<ColorPickerSize, ColorSwatchSize> = {
  small: "small",
  base: "base",
  mid: "mid",
};

export const COLOR_PICKER_SLIDER_SIZE_MAP: Record<ColorPickerSize, ColorSliderSize> = {
  small: "small",
  base: "base",
  mid: "mid",
};
