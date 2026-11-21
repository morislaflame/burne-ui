import { forwardRef, useCallback, useState, type HTMLAttributes } from "react";
 
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
import { Field } from "@/components/core/Field";
import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";
 
import {
  colorPickerAlphaInputAriaLabel,
  colorPickerAreaAriaLabel,
  colorPickerAreaValueText,
  colorPickerContentAriaLabel,
  colorPickerHexInputAriaLabel,
  colorPickerTriggerAriaLabel,
} from "./colorPickerA11y";
import {
  useColorPickerAreaChange,
  useColorPickerAreaDrag,
  useColorPickerSlotMotion,
} from "./colorPickerAnimations";
import { COLOR_PICKER_SLIDER_SIZE_MAP, COLOR_PICKER_SWATCH_SIZE_MAP } from "./colorPickerAPI";
import { useColorPicker, useColorPickerClassNames, useOptionalColorPickerMotionScope } from "./colorPickerContext";
import {
  COLOR_PICKER_ALPHA_FIELD_CLASS,
  COLOR_PICKER_ALPHA_INPUT_CLASS,
  COLOR_PICKER_ALPHA_SUFFIX_CLASS,
  COLOR_PICKER_AREA_THUMB_CLASS,
  COLOR_PICKER_HEX_FIELD_CLASS,
  COLOR_PICKER_HEX_INPUT_CLASS,
  COLOR_PICKER_HEX_PREFIX_CLASS,
  COLOR_PICKER_INPUT_DISABLED_CLASS,
  COLOR_PICKER_INPUTS_ROW_CLASS,
  COLOR_PICKER_PRESETS_CLASS,
  COLOR_PICKER_PREVIEW_SWATCH_CLASS,
  COLOR_PICKER_PREVIEW_WRAP_CLASS,
  COLOR_PICKER_SLIDERS_ROW_CLASS,
  COLOR_PICKER_SLIDERS_STACK_CLASS,
  colorPickerAreaClass,
  colorPickerContentPanelClass,
} from "./colorPickerStyles";
import { ColorSliderTrack } from "./ColorSlider";
import { ColorSwatch } from "./ColorSwatch";
import { clampN, hexToHsva, hsvaToColorString, hueToRgbString } from "./colorUtils";
import type {
  ColorPickerAlphaInputProps,
  ColorPickerAreaProps,
  ColorPickerContentProps,
  ColorPickerHexInputProps,
  ColorPickerPresetsProps,
  ColorPickerPreviewProps,
  ColorPickerTriggerProps,
} from "./colorPickerTypes";
 
import { cn } from "@/utils/cn";
 
export const ColorPickerArea = forwardRef<HTMLDivElement, ColorPickerAreaProps>(
  function ColorPickerArea(
    {
      className,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      style,
      motion,
      ...rest
    },
    ref,
  ) {
    const labels = useBurneLabels();
    const { hsva, setHsva, hex, size, disabled, readOnly } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const { areaRef, thumbRef, handlePointerDown, handleThumbKeyDown } =
      useColorPickerAreaDrag({ hsva, setHsva, disabled, readOnly });
    const areaPart = useColorPickerSlotMotion<HTMLDivElement>("area", {
      motion,
      playEnter: false,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const thumbPart = useColorPickerSlotMotion<HTMLButtonElement>("areaThumb", {
      playEnter: false,
      onPointerDown: (e) => {
        e.stopPropagation();
      },
    });
    useColorPickerAreaChange(hex);
 
    const { setRef: setAreaPartRef } = areaPart;
    const { setRef: setThumbPartRef } = thumbPart;
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        areaRef.current = node;
        setAreaPartRef(node);
        mergeForwardedRef(ref, node);
      },
      [areaRef, ref, setAreaPartRef],
    );
    const setThumbRef = useCallback(
      (node: HTMLButtonElement | null) => {
        thumbRef.current = node;
        setThumbPartRef(node);
      },
      [setThumbPartRef, thumbRef],
    );
 
    const hueColor = hueToRgbString(hsva.h);
    const thumbColor = hsvaToColorString(hsva);
 
    return (
      <div
        ref={setRefs}
        role="group"
        aria-disabled={disabled || undefined}
        className={colorPickerAreaClass(
          size,
          cn(slotClassNames.area, className),
          { disabled, readOnly },
        )}
        style={{
          /* HSV area physics: fixed #000/#fff endpoints (not theme tokens). */
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
          ...style,
        }}
        {...rest}
        {...areaPart.pointerHandlers}
        onPointerDown={(e) => {
          areaPart.pointerHandlers.onPointerDown?.(e);
          if (!e.defaultPrevented) handlePointerDown(e);
        }}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        <button
          ref={setThumbRef}
          type="button"
          role="slider"
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          aria-readonly={readOnly || undefined}
          aria-label={colorPickerAreaAriaLabel(labels.colorPickerArea)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hsva.s}
          aria-valuetext={colorPickerAreaValueText(
            hsva.s,
            hsva.v,
            labels.colorPickerAreaValue,
          )}
          className={cn(
            COLOR_PICKER_AREA_THUMB_CLASS,
            slotClassNames.areaThumb,
          )}
          style={{
            left: `${hsva.s}%`,
            top: `${100 - hsva.v}%`,
            backgroundColor: thumbColor,
          }}
          onKeyDown={handleThumbKeyDown}
          {...thumbPart.pointerHandlers}
          onPointerDown={(e) => {
            thumbPart.pointerHandlers.onPointerDown?.(e);
            if (!e.defaultPrevented) handlePointerDown(e);
          }}
          data-disabled={dataFlag(disabled)}
          data-readonly={dataFlag(readOnly)}
        />
      </div>
    );
  },
);
 
ColorPickerArea.displayName = "ColorPicker.Area";
 
export const ColorPickerHexInput = forwardRef<HTMLDivElement, ColorPickerHexInputProps>(
  function ColorPickerHexInput(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const labels = useBurneLabels();
    const { hex, setHsva, disabled, readOnly } = useColorPicker();
    const blocked = disabled || readOnly;
    const slotClassNames = useColorPickerClassNames();
    const part = useColorPickerSlotMotion<HTMLDivElement>("hexInput", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState("");
 
    const commit = useCallback(
      (draft: string) => {
        if (blocked) return;
        const candidate = `#${draft}`;
        const parsed = hexToHsva(candidate);
        if (parsed) setHsva(parsed);
      },
      [blocked, setHsva],
    );
 
    const displayValue = isEditing && !blocked ? editDraft : hex.slice(1);
 
    return (
      <div
        ref={part.setRef}
        className={cn(
          COLOR_PICKER_HEX_INPUT_CLASS,
          disabled && COLOR_PICKER_INPUT_DISABLED_CLASS,
          slotClassNames.hexInput,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        <span
          className={cn(
            COLOR_PICKER_HEX_PREFIX_CLASS,
            slotClassNames.hexPrefix,
          )}
        >
          #
        </span>
        <input
          type="text"
          value={displayValue}
          maxLength={8}
          disabled={disabled}
          readOnly={readOnly}
          spellCheck={false}
          aria-label={colorPickerHexInputAriaLabel(labels.colorPickerHex)}
          className={cn(
            COLOR_PICKER_HEX_FIELD_CLASS,
            slotClassNames.hexInputField,
            FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
          )}
          onFocus={() => {
            if (blocked) return;
            setIsEditing(true);
            setEditDraft(hex.slice(1));
          }}
          onChange={(e) => {
            if (blocked) return;
            setEditDraft(e.target.value.replace(/[^0-9a-fA-F]/g, "").toUpperCase());
          }}
          onBlur={() => {
            if (!blocked) commit(editDraft);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!blocked) commit(editDraft);
              setIsEditing(false);
            }
          }}
          data-disabled={dataFlag(disabled)}
          data-readonly={dataFlag(readOnly)}
        />
      </div>
    );
  },
);
 
ColorPickerHexInput.displayName = "ColorPicker.HexInput";
 
export const ColorPickerAlphaInput = forwardRef<HTMLDivElement, ColorPickerAlphaInputProps>(
  function ColorPickerAlphaInput(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const labels = useBurneLabels();
    const { hsva, setHsva, disabled, readOnly } = useColorPicker();
    const blocked = disabled || readOnly;
    const slotClassNames = useColorPickerClassNames();
    const part = useColorPickerSlotMotion<HTMLDivElement>("alphaInput", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState("");
 
    const commitAlpha = useCallback(
      (draft: string) => {
        if (blocked || draft === "") return;
        const n = parseInt(draft, 10);
        if (!Number.isNaN(n)) {
          setHsva({ ...hsva, a: clampN(n, 0, 100) });
        }
      },
      [blocked, hsva, setHsva],
    );
 
    const displayValue = isEditing && !blocked ? editDraft : String(Math.round(hsva.a));
 
    return (
      <div
        ref={part.setRef}
        className={cn(
          COLOR_PICKER_ALPHA_INPUT_CLASS,
          disabled && COLOR_PICKER_INPUT_DISABLED_CLASS,
          slotClassNames.alphaInput,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          disabled={disabled}
          readOnly={readOnly}
          value={displayValue}
          aria-label={colorPickerAlphaInputAriaLabel(labels.colorPickerAlpha)}
          className={cn(
            COLOR_PICKER_ALPHA_FIELD_CLASS,
            slotClassNames.alphaInputField,
            FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
          )}
          onFocus={() => {
            if (blocked) return;
            setIsEditing(true);
            setEditDraft(String(Math.round(hsva.a)));
          }}
          onChange={(e) => {
            if (blocked) return;
            const digits = e.target.value.replace(/[^0-9]/g, "");
            setEditDraft(digits);
            if (digits !== "") {
              const n = parseInt(digits, 10);
              if (!Number.isNaN(n)) {
                setHsva({ ...hsva, a: clampN(n, 0, 100) });
              }
            }
          }}
          onBlur={() => {
            commitAlpha(editDraft);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitAlpha(editDraft);
              setIsEditing(false);
            }
          }}
          data-disabled={dataFlag(disabled)}
          data-readonly={dataFlag(readOnly)}
        />
        <span
          className={cn(
            COLOR_PICKER_ALPHA_SUFFIX_CLASS,
            slotClassNames.alphaSuffix,
          )}
        >
          %
        </span>
      </div>
    );
  },
);
 
ColorPickerAlphaInput.displayName = "ColorPicker.AlphaInput";
 
export const ColorPickerPresets = forwardRef<HTMLDivElement, ColorPickerPresetsProps>(
  function ColorPickerPresets(
    {
      presets,
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const { hex, setHsva, size, disabled, readOnly } = useColorPicker();
    const blocked = disabled || readOnly;
    const slotClassNames = useColorPickerClassNames();
    const part = useColorPickerSlotMotion<HTMLDivElement>("presets", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <div
        ref={part.setRef}
        className={cn(
          COLOR_PICKER_PRESETS_CLASS,
          slotClassNames.presets,
          className,
        )}
        {...rest}
        {...part.pointerHandlers}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(readOnly)}
      >
        {presets.map((preset) => (
          <ColorSwatch
            key={preset}
            color={preset}
            size={COLOR_PICKER_SWATCH_SIZE_MAP[size]}
            shape="rounded"
            disabled={disabled}
            aria-disabled={readOnly || undefined}
            selected={hex.toLowerCase() === preset.toLowerCase()}
            className={slotClassNames.presetSwatch}
            onClick={() => {
              if (blocked) return;
              const parsed = hexToHsva(preset);
              if (parsed) setHsva(parsed);
            }}
          />
        ))}
      </div>
    );
  },
);
 
ColorPickerPresets.displayName = "ColorPicker.Presets";
 
export const ColorPickerPreview = forwardRef<HTMLSpanElement, ColorPickerPreviewProps>(
  function ColorPickerPreview(
    {
      className,
      color,
      size = "mid",
      shape = "circle",
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const { hex } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const part = useColorPickerSlotMotion<HTMLSpanElement>("previewSwatch", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <span
        ref={part.setRef}
        className={cn(COLOR_PICKER_PREVIEW_WRAP_CLASS, slotClassNames.previewSwatch, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        <ColorSwatch
          color={color ?? hex}
          size={size}
          shape={shape}
          className={cn(COLOR_PICKER_PREVIEW_SWATCH_CLASS, slotClassNames.previewSwatch)}
        />
      </span>
    );
  },
);
 
ColorPickerPreview.displayName = "ColorPicker.Preview";
 
function ColorPickerDefaultLayout({
  showAlpha,
  presets,
}: {
  showAlpha: boolean;
  presets?: string[];
}) {
  const { hsva, setHsva, size, disabled, readOnly } = useColorPicker();
  const slotClassNames = useColorPickerClassNames();
  const sliderSize = COLOR_PICKER_SLIDER_SIZE_MAP[size];
  const pickerMotion = useOptionalColorPickerMotionScope()?.getRootMotion();
 
  return (
    <>
      <ColorPickerArea />
 
      <div
        className={cn(
          COLOR_PICKER_SLIDERS_ROW_CLASS,
          slotClassNames.slidersRow,
        )}
      >
        <ColorPickerPreview />
 
        <div
          className={cn(
            COLOR_PICKER_SLIDERS_STACK_CLASS,
            slotClassNames.slidersStack,
          )}
        >
          <ColorSliderTrack
            channel="hue"
            color={hsva}
            value={hsva.h}
            size={sliderSize}
            disabled={disabled}
            readOnly={readOnly}
            className={slotClassNames.hueSlider}
            motion={pickerMotion?.hueSlider}
            onValueChange={(h) => setHsva({ ...hsva, h })}
          />
 
          {showAlpha ? (
            <ColorSliderTrack
              channel="alpha"
              color={hsva}
              value={hsva.a}
              size={sliderSize}
              disabled={disabled}
              readOnly={readOnly}
              className={slotClassNames.alphaSlider}
              motion={pickerMotion?.alphaSlider}
              onValueChange={(a) => setHsva({ ...hsva, a })}
            />
          ) : null}
        </div>
      </div>
 
      <div
        className={cn(
          COLOR_PICKER_INPUTS_ROW_CLASS,
          slotClassNames.inputsRow,
        )}
      >
        <ColorPickerHexInput />
        {showAlpha ? <ColorPickerAlphaInput /> : null}
      </div>
 
      {presets && presets.length > 0 ? (
        <ColorPickerPresets presets={presets} />
      ) : null}
    </>
  );
}
 
export const ColorPickerTrigger = forwardRef<HTMLButtonElement, ColorPickerTriggerProps>(
  function ColorPickerTrigger(
    { swatchSize, className, children, asChild = true, motion, autoFocus, tabIndex, onBlur, onClick, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
    const field = useColorPicker();
    const { hex, disabled, size, invalid } = field;
    const slotClassNames = useColorPickerClassNames();
 
    return (
      <Popover.Trigger
        ref={mergeRefs(ref, field.registerTriggerRef)}
        id={field.triggerId}
        asChild={asChild}
        disabled={disabled}
        motion={motion}
        className={cn(slotClassNames.trigger, className)}
        onBlur={(e) => {
          onBlur?.(e);
          field.onTriggerBlur?.();
        }}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        {...rest}
        {...((autoFocus ?? field.autoFocus) ? { autoFocus: true } : {})}
        {...dataVariantProps({ size })}
        tabIndex={disabled ? -1 : (tabIndex ?? field.tabIndex)}
        aria-invalid={invalid ? true : undefined}
        aria-readonly={field.readOnly || undefined}
        aria-required={field.required || undefined}
        data-disabled={dataFlag(disabled)}
        data-readonly={dataFlag(field.readOnly)}
        data-invalid={dataFlag(invalid)}
        data-required={dataFlag(field.required)}
      >
        {children ?? (
          <ColorSwatch
            color={hex}
            size={swatchSize ?? COLOR_PICKER_SWATCH_SIZE_MAP[size]}
            shape="rounded"
            disabled={disabled}
            aria-label={colorPickerTriggerAriaLabel(hex, labels.colorPickerSelected)}
          />
        )}
      </Popover.Trigger>
    );
  },
);
 
ColorPickerTrigger.displayName = "ColorPicker.Trigger";

export const ColorPickerLabel = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function ColorPickerLabel({ children, className, id, ...rest }, ref) {
    const field = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    return (
      <Field.Label
        ref={ref}
        id={id ?? field.labelId}
        className={cn(slotClassNames.label, className)}
        {...rest}
      >
        {children ?? field.label}
      </Field.Label>
    );
  },
);
ColorPickerLabel.displayName = "ColorPicker.Label";

export const ColorPickerHint = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function ColorPickerHint({ children, className, ...rest }, ref) {
    const field = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    return (
      <Field.Hint ref={ref} className={cn(slotClassNames.hint, className)} {...rest}>
        {children ?? field.hint}
      </Field.Hint>
    );
  },
);
ColorPickerHint.displayName = "ColorPicker.Hint";

export const ColorPickerError = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function ColorPickerError({ children, className, ...rest }, ref) {
    const field = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    return (
      <Field.Error ref={ref} className={cn(slotClassNames.error, className)} {...rest}>
        {children ?? field.error}
      </Field.Error>
    );
  },
);
ColorPickerError.displayName = "ColorPicker.Error";
 
export const ColorPickerContent = forwardRef<HTMLDivElement, ColorPickerContentProps>(
  function ColorPickerContent(
    { showAlpha = false, presets, className, children, motion, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
    const { size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const panelPart = useColorPickerSlotMotion<HTMLDivElement>("contentPanel", {
      motion,
    });
 
    return (
      <Popover.Content
        ref={ref}
        unstyled
        offset={POPOVER_DEFAULT_OFFSET}
        align="start"
        aria-label={colorPickerContentAriaLabel(labels.colorPickerContent)}
        className={cn(slotClassNames.content, className)}
        {...rest}
      >
        <div
          ref={panelPart.setRef}
          className={colorPickerContentPanelClass(
            size,
            slotClassNames.contentPanel,
          )}
          {...panelPart.pointerHandlers}
        >
          {children ?? (
            <ColorPickerDefaultLayout showAlpha={showAlpha} presets={presets} />
          )}
        </div>
      </Popover.Content>
    );
  },
);
 
ColorPickerContent.displayName = "ColorPicker.Content";
 