import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";

import type { ColorPickerSize } from "./colorPickerTypes";

import { cn } from "@/utils/cn";

export const COLOR_PICKER_WIDTH: Record<ColorPickerSize, string> = {
  small: "w-52",
  base: "w-64",
  mid: "w-72",
  large: "w-80",
};

export const COLOR_PICKER_AREA_HEIGHT: Record<ColorPickerSize, string> = {
  small: "h-32",
  base: "h-40",
  mid: "h-48",
  large: "h-56",
};

export const COLOR_PICKER_PAD: Record<ColorPickerSize, string> = {
  small: "p-small gap-small",
  base: "p-mid gap-mid",
  mid: "p-large gap-large",
  large: "p-xlarge gap-xlarge",
};

export const COLOR_PICKER_AREA_CLASS =
  "relative w-full touch-none select-none rounded-small cursor-crosshair overflow-hidden";

export const COLOR_PICKER_AREA_THUMB_CLASS =
  "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-token-mid focus-ring";

export const COLOR_PICKER_SLIDERS_ROW_CLASS = "flex items-center gap-small";

export const COLOR_PICKER_SLIDERS_STACK_CLASS = "flex min-w-0 flex-1 flex-col gap-xsmall";

export const COLOR_PICKER_INPUTS_ROW_CLASS = "flex min-w-0 items-center gap-small";

export const COLOR_PICKER_HEX_INPUT_CLASS =
  "flex min-w-0 shrink items-center gap-xsmall rounded-small border-token bg-secondary px-small py-xsmall focus-within-ring";

export const COLOR_PICKER_HEX_PREFIX_CLASS = "text-small text-muted select-none";

export const COLOR_PICKER_HEX_FIELD_CLASS =
  `w-[8ch] bg-transparent text-small font-mono uppercase text-foreground outline-none ${FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS}`;

export const COLOR_PICKER_ALPHA_INPUT_CLASS =
  "flex shrink-0 items-center gap-xsmall rounded-small border-token bg-secondary px-small py-xsmall focus-within-ring";

export const COLOR_PICKER_ALPHA_FIELD_CLASS =
  `w-8 bg-transparent text-right text-small font-mono text-foreground outline-none ${FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS}`;

export const COLOR_PICKER_ALPHA_SUFFIX_CLASS = "text-small text-muted select-none";

export const COLOR_PICKER_PRESETS_CLASS =
  "flex flex-wrap gap-xsmall border-t-token pt-small";

export const COLOR_PICKER_CONTENT_PANEL_CLASS = "flex flex-col rounded-mid text-foreground";

export function colorPickerContentPanelClass(
  size: ColorPickerSize,
  slotPanel?: string,
): string {
  return cn(
    COLOR_PICKER_CONTENT_PANEL_CLASS,
    COLOR_PICKER_WIDTH[size],
    COLOR_PICKER_PAD[size],
    slotPanel,
  );
}

export function colorPickerAreaClass(size: ColorPickerSize, slotArea?: string): string {
  return cn(
    COLOR_PICKER_AREA_CLASS,
    COLOR_PICKER_AREA_HEIGHT[size],
    slotArea,
  );
}
