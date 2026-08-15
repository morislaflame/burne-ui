import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { ColorSwatchSize } from "./ColorSwatch";
import type { HSVA } from "./colorUtils";

export type ColorPickerSize = "small" | "base" | "mid" | "large";

export type ColorPickerVariant = "default" | "gloss";

export type ColorPickerClassNames = {
  content?: string;
  contentPanel?: string;
  trigger?: string;
  area?: string;
  areaThumb?: string;
  slidersRow?: string;
  /** Hue / alpha slider column wrapper. */
  slidersStack?: string;
  previewSwatch?: string;
  hueSlider?: string;
  alphaSlider?: string;
  inputsRow?: string;
  hexInput?: string;
  hexPrefix?: string;
  hexInputField?: string;
  alphaInput?: string;
  alphaInputField?: string;
  alphaSuffix?: string;
  presets?: string;
  presetSwatch?: string;
};

export type ColorPickerPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};

export type ColorPickerMotion = {
  contentPanel?: ColorPickerPartMotion;
  area?: ColorPickerPartMotion;
  areaThumb?: ColorPickerPartMotion;
  hexInput?: ColorPickerPartMotion;
  presets?: ColorPickerPartMotion;
  hueSlider?: ColorPickerPartMotion;
  alphaSlider?: ColorPickerPartMotion;
};

export type ColorPickerProps = {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  side?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  classNames?: Prettify<ColorPickerClassNames>;
  /**
   * Per-slot motion (`contentPanel`, `area`, `areaThumb`, `hexInput`, `presets`, `hueSlider`, `alphaSlider`).
   * Root is a portal-host map (like Dropdown). Thumb drag `left`/`top` is kit-internal.
   * Defaults are empty. Pass `hueSlider` / `alphaSlider` through to ColorSlider (nested scope does not inherit).
   */
  motion?: Prettify<ColorPickerMotion>;
};

export type ColorPickerTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  swatchSize?: ColorSwatchSize;
  /** Pass-through to `Popover.Trigger` (default `true` there). */
  asChild?: boolean;
  children?: ReactNode;
};

export type ColorPickerContentProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  showAlpha?: boolean;
  presets?: string[];
  /**
   * Custom panel body. Default layout: Area, sliders, hex/alpha inputs, presets.
   * Compose with `ColorPicker.Area` / `HexInput` / `AlphaInput` / `Presets`.
   */
  children?: ReactNode;
  motion?: Prettify<ColorPickerPartMotion>;
};

export type ColorPickerAreaProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ColorPickerPartMotion>;
};

export type ColorPickerHexInputProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ColorPickerPartMotion>;
};

export type ColorPickerAlphaInputProps = HTMLAttributes<HTMLDivElement>;

export type ColorPickerPresetsProps = HTMLAttributes<HTMLDivElement> & {
  presets: string[];
  motion?: Prettify<ColorPickerPartMotion>;
};

export type ColorPickerContextValue = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
  hex: string;
  disabled: boolean;
  size: ColorPickerSize;
};

export type ColorPickerClassNamesProviderProps = {
  classNames?: Prettify<ColorPickerClassNames>;
  children: ReactNode;
};

export type UseColorPickerRootStateProps = ColorPickerProps;

export type UseColorPickerAreaDragProps = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
};
