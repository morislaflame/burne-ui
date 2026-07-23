import { DEFAULT_BURNE_LABELS, formatBurneLabel, type BurneLabels } from "@/theme/burneLabels";

export const COLOR_PICKER_AREA_KEYBOARD_STEP = 1;

export const COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE = 10;

export function colorPickerAreaAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.colorPickerArea,
): string {
  return label;
}

export function colorPickerAreaValueText(
  saturation: number,
  brightness: number,
  template: string = DEFAULT_BURNE_LABELS.colorPickerAreaValue,
): string {
  return formatBurneLabel(template, { saturation, brightness });
}

export function colorPickerContentAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.colorPickerContent,
): string {
  return label;
}

export function colorPickerHexInputAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.colorPickerHex,
): string {
  return label;
}

export function colorPickerAlphaInputAriaLabel(
  label: string = DEFAULT_BURNE_LABELS.colorPickerAlpha,
): string {
  return label;
}

export function colorPickerTriggerAriaLabel(
  hex: string,
  template: string = DEFAULT_BURNE_LABELS.colorPickerSelected,
): string {
  return formatBurneLabel(template, { hex });
}

export type ColorPickerLabelSource = Pick<
  BurneLabels,
  | "colorPickerArea"
  | "colorPickerAreaValue"
  | "colorPickerContent"
  | "colorPickerHex"
  | "colorPickerAlpha"
  | "colorPickerSelected"
>;
