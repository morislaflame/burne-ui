import {
  forwardRef,
  useCallback,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  colorPickerAlphaInputAriaLabel,
  colorPickerAreaAriaLabel,
  colorPickerAreaValueText,
  colorPickerContentAriaLabel,
  colorPickerHexInputAriaLabel,
  colorPickerTriggerAriaLabel,
} from "./colorPickerA11y";
import { useColorPickerAreaDrag } from "./colorPickerAnimations";
import { COLOR_PICKER_SLIDER_SIZE_MAP, COLOR_PICKER_SWATCH_SIZE_MAP } from "./colorPickerAPI";
import { useColorPicker, useColorPickerClassNames } from "./colorPickerContext";
import {
  COLOR_PICKER_ALPHA_FIELD_CLASS,
  COLOR_PICKER_ALPHA_INPUT_CLASS,
  COLOR_PICKER_ALPHA_SUFFIX_CLASS,
  COLOR_PICKER_AREA_THUMB_CLASS,
  COLOR_PICKER_HEX_FIELD_CLASS,
  COLOR_PICKER_HEX_INPUT_CLASS,
  COLOR_PICKER_HEX_PREFIX_CLASS,
  COLOR_PICKER_INPUTS_ROW_CLASS,
  COLOR_PICKER_PRESETS_CLASS,
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
  ColorPickerTriggerProps,
} from "./colorPickerTypes";

import { cn } from "@/utils/cn";

export const ColorPickerArea = forwardRef<HTMLDivElement, ColorPickerAreaProps>(
  function ColorPickerArea({ className, onPointerDown, style, ...rest }, ref) {
    const labels = useBurneLabels();
    const { hsva, setHsva, size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const { areaRef, thumbRef, handlePointerDown, handleThumbKeyDown } =
      useColorPickerAreaDrag({ hsva, setHsva });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        areaRef.current = node;
        mergeForwardedRef(ref, node);
      },
      [areaRef, ref],
    );

    const hueColor = hueToRgbString(hsva.h);
    const thumbColor = hsvaToColorString(hsva);

    return (
      <div
        ref={setRefs}
        role="group"
        className={colorPickerAreaClass(
          size,
          cn(slotClassNames.area, className),
        )}
        style={{
          /* HSV area physics: fixed #000/#fff endpoints (not theme tokens). */
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
          ...style,
        }}
        onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => {
          onPointerDown?.(e);
          if (!e.defaultPrevented) handlePointerDown(e);
        }}
        {...rest}
      >
        <button
          ref={thumbRef}
          type="button"
          role="slider"
          tabIndex={0}
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
            width: "14px",
            height: "14px",
            backgroundColor: thumbColor,
          }}
          onKeyDown={handleThumbKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation();
            handlePointerDown(e);
          }}
        />
      </div>
    );
  },
);

ColorPickerArea.displayName = "ColorPicker.Area";

export const ColorPickerHexInput = forwardRef<HTMLDivElement, ColorPickerHexInputProps>(
  function ColorPickerHexInput({ className, ...rest }, ref) {
    const labels = useBurneLabels();
    const { hex, setHsva } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState("");

    const commit = useCallback(
      (draft: string) => {
        const candidate = `#${draft}`;
        const parsed = hexToHsva(candidate);
        if (parsed) setHsva(parsed);
      },
      [setHsva],
    );

    const displayValue = isEditing ? editDraft : hex.slice(1);

    return (
      <div
        ref={ref}
        className={cn(
          COLOR_PICKER_HEX_INPUT_CLASS,
          slotClassNames.hexInput,
          className,
        )}
        {...rest}
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
          spellCheck={false}
          aria-label={colorPickerHexInputAriaLabel(labels.colorPickerHex)}
          className={cn(
            COLOR_PICKER_HEX_FIELD_CLASS,
            slotClassNames.hexInputField,
            FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
          )}
          onFocus={() => {
            setIsEditing(true);
            setEditDraft(hex.slice(1));
          }}
          onChange={(e) =>
            setEditDraft(e.target.value.replace(/[^0-9a-fA-F]/g, "").toUpperCase())
          }
          onBlur={() => {
            commit(editDraft);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit(editDraft);
              setIsEditing(false);
            }
          }}
        />
      </div>
    );
  },
);

ColorPickerHexInput.displayName = "ColorPicker.HexInput";

export const ColorPickerAlphaInput = forwardRef<HTMLDivElement, ColorPickerAlphaInputProps>(
  function ColorPickerAlphaInput({ className, ...rest }, ref) {
    const labels = useBurneLabels();
    const { hsva, setHsva } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();

    return (
      <div
        ref={ref}
        className={cn(
          COLOR_PICKER_ALPHA_INPUT_CLASS,
          slotClassNames.alphaInput,
          className,
        )}
        {...rest}
      >
        <input
          type="text"
          value={Math.round(hsva.a)}
          aria-label={colorPickerAlphaInputAriaLabel(labels.colorPickerAlpha)}
          className={cn(
            COLOR_PICKER_ALPHA_FIELD_CLASS,
            slotClassNames.alphaInputField,
            FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
          )}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) setHsva({ ...hsva, a: clampN(n, 0, 100) });
          }}
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
  function ColorPickerPresets({ presets, className, ...rest }, ref) {
    const { hex, setHsva, size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();

    return (
      <div
        ref={ref}
        className={cn(
          COLOR_PICKER_PRESETS_CLASS,
          slotClassNames.presets,
          className,
        )}
        {...rest}
      >
        {presets.map((preset) => (
          <ColorSwatch
            key={preset}
            color={preset}
            size={COLOR_PICKER_SWATCH_SIZE_MAP[size]}
            shape="rounded"
            selected={hex.toLowerCase() === preset.toLowerCase()}
            className={slotClassNames.presetSwatch}
            onClick={() => {
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

function ColorPickerDefaultLayout({
  showAlpha,
  presets,
}: {
  showAlpha: boolean;
  presets?: string[];
}) {
  const { hsva, setHsva, hex, size } = useColorPicker();
  const slotClassNames = useColorPickerClassNames();
  const sliderSize = COLOR_PICKER_SLIDER_SIZE_MAP[size];

  return (
    <>
      <ColorPickerArea />

      <div
        className={cn(
          COLOR_PICKER_SLIDERS_ROW_CLASS,
          slotClassNames.slidersRow,
        )}
      >
        <ColorSwatch
          color={hex}
          size="mid"
          shape="circle"
          className={cn("shrink-0", slotClassNames.previewSwatch)}
        />

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
            className={slotClassNames.hueSlider}
            onValueChange={(h) => setHsva({ ...hsva, h })}
          />

          {showAlpha ? (
            <ColorSliderTrack
              channel="alpha"
              color={hsva}
              value={hsva.a}
              size={sliderSize}
              className={slotClassNames.alphaSlider}
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
    { swatchSize, className, children, asChild, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
    const { hex, disabled, size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();

    return (
      <Popover.Trigger
        ref={ref}
        asChild={asChild}
        className={cn(slotClassNames.trigger, className)}
        {...rest}
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

export const ColorPickerContent = forwardRef<HTMLDivElement, ColorPickerContentProps>(
  function ColorPickerContent(
    { showAlpha = false, presets, className, children, ...rest },
    ref,
  ) {
    const labels = useBurneLabels();
    const { size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();

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
          className={colorPickerContentPanelClass(
            size,
            slotClassNames.contentPanel,
          )}
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
