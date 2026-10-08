import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { ColorSwatchShape, ColorSwatchSize } from "./ColorSwatch";
import type { HSVA } from "./colorUtils";
 
export type ColorPickerSize = "small" | "base" | "mid" | "large";
 
export const KIT_COLOR_PICKER_VARIANTS = ["default"] as const;
export type KitColorPickerVariant = (typeof KIT_COLOR_PICKER_VARIANTS)[number];
export type ColorPickerVariant = KitColorPickerVariant | (string & {});
 
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
  change?: MotionValue;
};
 
export type ColorPickerMotion = {
  contentPanel?: ColorPickerPartMotion;
  area?: ColorPickerPartMotion;
  areaThumb?: ColorPickerPartMotion;
  hexInput?: ColorPickerPartMotion;
  alphaInput?: ColorPickerPartMotion;
  presets?: ColorPickerPartMotion;
  hueSlider?: ColorPickerPartMotion;
  alphaSlider?: ColorPickerPartMotion;
  previewSwatch?: ColorPickerPartMotion;
  /** Pass-through to `Popover.Trigger` (nested Popover scope). */
  trigger?: ColorPickerPartMotion;
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
  "aria-invalid"?: boolean;
  /** `aria-invalid` and `data-invalid` on the trigger without a message. Native `aria-invalid` still wins when it is true. */
  invalid?: boolean;
  classNames?: Prettify<ColorPickerClassNames>;
  /**
   * Per-slot motion (`contentPanel`, `area`, `areaThumb`, `hexInput`, `alphaInput`, `presets`, `hueSlider`, `alphaSlider`, `previewSwatch`).
   * Root is a portal-host map (like Dropdown). `contentPanel` / `hexInput` / `alphaInput` / `presets` / `previewSwatch` play opt-in `enter`.
   * `area` plays `change` on hex (not mount `enter` — drag surface). Thumb `left`/`top` is kit-internal.
   * `trigger` is pass-through to Popover. Defaults are empty. Pass `hueSlider` / `alphaSlider` through to ColorSlider (nested scope does not inherit).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<ColorPickerMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Provider lives on Root; slots register when `Content` is open. No `root` slot — use `playSlot("contentPanel")`.
   * Not placed on the DOM. Nested ColorSlider / ColorSwatch keep their own scopes.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type ColorPickerTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> & {
  swatchSize?: ColorSwatchSize;
  /** Pass-through to `Popover.Trigger` (default `true` there). */
  asChild?: boolean;
  children?: ReactNode;
  motion?: Prettify<ColorPickerPartMotion>;
};
 
export type ColorPickerPreviewProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color"
> & {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  motion?: Prettify<ColorPickerPartMotion>;
};
 
export type ColorPickerContentProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  showAlpha?: boolean;
  presets?: string[];
  /**
   * Custom panel body. Default layout: Area, sliders, hex/alpha inputs, presets.
   * Compose with `ColorPicker.Area` / `Preview` / `HexInput` / `AlphaInput` / `Presets`.
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
 
export type ColorPickerAlphaInputProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ColorPickerPartMotion>;
};
 
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
  invalid: boolean;
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
 