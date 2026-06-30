import type { HTMLAttributes, ReactNode } from "react";

import type { ColorSwatchSize } from "./ColorSwatch";
import type { HSVA } from "./colorUtils";

export type ColorPickerSize = "small" | "base" | "mid";

export type ColorPickerVariant = "default" | "gloss";

export type ColorPickerClassNames = {
  content?: string;
  contentPanel?: string;
  trigger?: string;
  area?: string;
  areaThumb?: string;
  slidersRow?: string;
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
  classNames?: ColorPickerClassNames;
};

export type ColorPickerTriggerProps = Omit<HTMLAttributes<HTMLButtonElement>, "children"> & {
  swatchSize?: ColorSwatchSize;
};

export type ColorPickerContentProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  showAlpha?: boolean;
  presets?: string[];
};

export type ColorPickerContextValue = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
  hex: string;
  disabled: boolean;
  size: ColorPickerSize;
};

export type ColorPickerClassNamesProviderProps = {
  classNames?: ColorPickerClassNames;
  children: ReactNode;
};

export type UseColorPickerRootStateProps = ColorPickerProps;

export type UseColorPickerAreaDragProps = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
};

export type ColorPickerHexInputProps = {
  hex: string;
  setHsva: (next: HSVA) => void;
};

export type ColorPickerAlphaInputProps = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
};

export type ColorPickerPresetsProps = {
  presets: string[];
  hex: string;
  setHsva: (next: HSVA) => void;
  size: ColorPickerSize;
};
