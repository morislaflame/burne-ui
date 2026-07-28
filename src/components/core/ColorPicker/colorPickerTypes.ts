import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

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
};

export type ColorPickerAreaProps = HTMLAttributes<HTMLDivElement>;

export type ColorPickerHexInputProps = HTMLAttributes<HTMLDivElement>;

export type ColorPickerAlphaInputProps = HTMLAttributes<HTMLDivElement>;

export type ColorPickerPresetsProps = HTMLAttributes<HTMLDivElement> & {
  presets: string[];
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
