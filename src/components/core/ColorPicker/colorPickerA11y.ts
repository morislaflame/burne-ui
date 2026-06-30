export const COLOR_PICKER_AREA_ARIA_LABEL = "Saturation and brightness";

export const COLOR_PICKER_CONTENT_ARIA_LABEL = "Color selection";

export const COLOR_PICKER_HEX_INPUT_ARIA_LABEL = "Hex code of the color";

export const COLOR_PICKER_ALPHA_INPUT_ARIA_LABEL = "Transparency (%)";

export function colorPickerTriggerAriaLabel(hex: string): string {
  return `Выбранный цвет: ${hex}`;
}
