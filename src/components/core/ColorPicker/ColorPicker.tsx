import { forwardRef, useCallback, useMemo, useRef, type ForwardedRef } from "react";

import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { Popover } from "@/components/core/Popover";
import { dataFlag } from "@/components/core/utils/dataContract";
import { FieldHiddenValues, readOnlyData, useFieldControlFocus, useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { cn } from "@/utils/cn";
 
import { resolveColorPickerMotionDefaults } from "./colorPickerAnimations";
import { ColorPickerClassNamesProvider, ColorPickerMotionProvider, ColorPickerProvider } from "./colorPickerContext";
import {
  ColorPickerAlphaInput,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerError,
  ColorPickerHexInput,
  ColorPickerHint,
  ColorPickerLabel,
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
 
export const ColorPickerRoot = forwardRef(function ColorPickerRoot({
  children,
  label,
  hint,
  error,
  id,
  name,
  required,
  readOnly,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  size = "base",
  variant,
  side = "bottom",
  align,
  offset,
  collisionPadding,
  avoidCollisions,
  portalContainer,
  disabled: disabledProp,
  autoFocus,
  tabIndex,
  "aria-invalid": ariaInvalid,
  invalid,
  className,
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: ColorPickerProps, ref: ForwardedRef<HTMLDivElement>) {
  const { contextValue, isCompound, isControlled, resetToDefault } = useColorPickerRootState({
    children,
    label,
    hint,
    error,
    id,
    name,
    required,
    readOnly,
    value,
    defaultValue,
    onValueChange,
    size,
    disabled: disabledProp,
    autoFocus,
    tabIndex,
    invalid,
    "aria-invalid": ariaInvalid,
  });
  const [openState, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: Boolean(defaultOpen),
  });
  const effectiveOpen = contextValue.disabled ? false : openState;
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (contextValue.disabled && nextOpen) return;
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [contextValue.disabled, onOpenChange, setOpenState],
  );
  const motionDefaults = useMemo(() => resolveColorPickerMotionDefaults(), []);
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  useNativeFormReset(focusRef, resetToDefault, !isControlled);
  const fieldLabel = useMemo(
    () => ({
      controlId: contextValue.triggerId,
      labelId: contextValue.labelId,
      required: contextValue.required,
    }),
    [contextValue.labelId, contextValue.required, contextValue.triggerId],
  );
 
  return (
    <ColorPickerProvider value={contextValue}>
      <ColorPickerClassNamesProvider classNames={classNames}>
        <ColorPickerMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <FieldLabelContext.Provider value={fieldLabel}>
            <Field
              ref={mergeRefs(ref, focusRef)}
              invalid={contextValue.invalid}
              className={cn(classNames?.root, className)}
              {...rest}
              data-disabled={dataFlag(contextValue.disabled)}
              data-readonly={readOnlyData(contextValue.readOnly)}
              data-invalid={dataFlag(contextValue.invalid)}
              data-required={dataFlag(contextValue.required)}
            >
              <Popover
                open={effectiveOpen}
                onOpenChange={handleOpenChange}
                size={size}
                side={side}
                align={align}
                offset={offset}
                collisionPadding={collisionPadding}
                avoidCollisions={avoidCollisions}
                portalContainer={portalContainer}
                variant={variant}
                classNames={{
                  panel: classNames?.panel,
                  panelRelative: classNames?.panelRelative,
                }}
                motion={{ trigger: motion?.trigger }}
              >
                {isCompound ? (
                  children
                ) : (
                  <>
                    {contextValue.label != null ? <ColorPickerLabel /> : null}
                    <ColorPickerTrigger />
                    <ColorPickerContent />
                    {contextValue.hint != null ? <ColorPickerHint /> : null}
                    {contextValue.error != null ? <ColorPickerError /> : null}
                  </>
                )}
                <FieldHiddenValues name={contextValue.name} value={contextValue.hex} />
              </Popover>
            </Field>
          </FieldLabelContext.Provider>
        </ColorPickerMotionProvider>
      </ColorPickerClassNamesProvider>
    </ColorPickerProvider>
  );
});
 
ColorPickerRoot.displayName = "ColorPicker";
 
export {
  ColorPickerTrigger,
  ColorPickerLabel,
  ColorPickerHint,
  ColorPickerError,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerHexInput,
  ColorPickerAlphaInput,
  ColorPickerPresets,
  ColorPickerPreview,
};
 