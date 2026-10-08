import { Popover } from "@/components/core/Popover";
import { useMemo } from "react";
 
import { resolveColorPickerMotionDefaults } from "./colorPickerAnimations";
import { ColorPickerClassNamesProvider, ColorPickerMotionProvider, ColorPickerProvider } from "./colorPickerContext";
import {
  ColorPickerAlphaInput,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerHexInput,
  ColorPickerPresets,
  ColorPickerPreview,
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
  ColorPickerPreviewProps,
  ColorPickerSize,
  ColorPickerVariant,
  ColorPickerClassNames,
  ColorPickerMotion,
  ColorPickerPartMotion,
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
  variant,
  side = "bottom",
  disabled = false,
  "aria-invalid": ariaInvalid,
  invalid,
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: ColorPickerProps) {
  const { contextValue } = useColorPickerRootState({
    value,
    defaultValue,
    onValueChange,
    size,
    disabled,
    invalid,
    "aria-invalid": ariaInvalid,
  });
  const motionDefaults = useMemo(() => resolveColorPickerMotionDefaults(), []);
 
  return (
    <ColorPickerProvider value={contextValue}>
      <ColorPickerClassNamesProvider classNames={classNames}>
        <ColorPickerMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <Popover
            open={openProp}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            size={size}
            side={side}
            variant={variant}
            motion={{ trigger: motion?.trigger }}
          >
            {children}
          </Popover>
        </ColorPickerMotionProvider>
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
  ColorPickerPreview,
};
 