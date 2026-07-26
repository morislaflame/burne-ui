import { Popover } from "@/components/core/Popover";

import { ColorPickerClassNamesProvider, ColorPickerProvider } from "./colorPickerContext";
import {
  ColorPickerAlphaInput,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerHexInput,
  ColorPickerPresets,
  ColorPickerTrigger,
} from "./colorPickerParts";
import type { ColorPickerProps } from "./colorPickerTypes";
import { useColorPickerRootState } from "./useColorPickerRootState";

export type {
  ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerContentProps,
  ColorPickerAreaProps,
  ColorPickerHexInputProps,
  ColorPickerAlphaInputProps,
  ColorPickerPresetsProps,
  ColorPickerSize,
  ColorPickerVariant,
  ColorPickerClassNames,
} from "./colorPickerTypes";

export { useColorPicker } from "./colorPickerContext";

export function ColorPickerRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  size = "base",
  variant = "default",
  side = "bottom",
  disabled = false,
  classNames,
}: ColorPickerProps) {
  const { contextValue } = useColorPickerRootState({
    value,
    defaultValue,
    onValueChange,
    size,
    disabled,
  });

  return (
    <ColorPickerProvider value={contextValue}>
      <ColorPickerClassNamesProvider classNames={classNames}>
        <Popover
          open={openProp}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          size={size}
          side={side}
          variant={variant === "gloss" ? "gloss" : "default"}
        >
          {children}
        </Popover>
      </ColorPickerClassNamesProvider>
    </ColorPickerProvider>
  );
}

ColorPickerRoot.displayName = "ColorPicker";

export {
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerHexInput,
  ColorPickerAlphaInput,
  ColorPickerPresets,
};
