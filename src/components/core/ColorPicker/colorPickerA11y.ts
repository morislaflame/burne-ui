export const COLOR_PICKER_AREA_ARIA_LABEL = "Saturation and brightness";

export const COLOR_PICKER_AREA_KEYBOARD_STEP = 1;

export const COLOR_PICKER_AREA_KEYBOARD_STEP_LARGE = 10;

export function colorPickerAreaValueText(
  saturation: number,
  brightness: number,
): string {
  return `${saturation}% saturation, ${brightness}% brightness`;
}

export const COLOR_PICKER_CONTENT_ARIA_LABEL = "Color selection";

export const COLOR_PICKER_HEX_INPUT_ARIA_LABEL = "Hex code of the color";

export const COLOR_PICKER_ALPHA_INPUT_ARIA_LABEL = "Transparency (%)";

export function colorPickerTriggerAriaLabel(hex: string): string {
  return `Selected color: ${hex}`;
}
