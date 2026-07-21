import { forwardRef, useCallback, useState } from "react";

import { Popover } from "@/components/core/Popover";
import { POPOVER_DEFAULT_OFFSET } from "@/components/core/Popover/popoverStyles";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";

import { COLOR_PICKER_ALPHA_INPUT_ARIA_LABEL, COLOR_PICKER_AREA_ARIA_LABEL, COLOR_PICKER_CONTENT_ARIA_LABEL, COLOR_PICKER_HEX_INPUT_ARIA_LABEL, colorPickerTriggerAriaLabel } from "./colorPickerA11y";
import { useColorPickerAreaDrag } from "./colorPickerAnimations";
import { COLOR_PICKER_SLIDER_SIZE_MAP, COLOR_PICKER_SWATCH_SIZE_MAP } from "./colorPickerAPI";
import { useColorPicker, useColorPickerClassNames } from "./colorPickerContext";
import { colorPickerAreaClass, COLOR_PICKER_ALPHA_FIELD_CLASS, COLOR_PICKER_ALPHA_INPUT_CLASS, COLOR_PICKER_ALPHA_SUFFIX_CLASS, COLOR_PICKER_AREA_THUMB_CLASS, COLOR_PICKER_HEX_FIELD_CLASS, COLOR_PICKER_HEX_INPUT_CLASS, COLOR_PICKER_HEX_PREFIX_CLASS, COLOR_PICKER_INPUTS_ROW_CLASS, COLOR_PICKER_PRESETS_CLASS, COLOR_PICKER_SLIDERS_ROW_CLASS, COLOR_PICKER_SLIDERS_STACK_CLASS, colorPickerContentPanelClass } from "./colorPickerStyles";
import { ColorSliderTrack } from "./ColorSlider";
import { ColorSwatch } from "./ColorSwatch";
import { clampN, hexToHsva, hsvaToColorString, hueToRgbString } from "./colorUtils";
import type {
  ColorPickerAlphaInputProps,
  ColorPickerContentProps,
  ColorPickerHexInputProps,
  ColorPickerPresetsProps,
  ColorPickerSize,
  ColorPickerTriggerProps,
} from "./colorPickerTypes";

import { cn } from "@/utils/cn";

function ColorPickerArea({ size }: { size: ColorPickerSize }) {
  const { hsva, setHsva } = useColorPicker();
  const slotClassNames = useColorPickerClassNames();
  const { areaRef, handlePointerDown } = useColorPickerAreaDrag({ hsva, setHsva });

  const hueColor = hueToRgbString(hsva.h);
  const thumbColor = hsvaToColorString(hsva);

  return (
    <div
      ref={areaRef}
      role="group"
      aria-label={COLOR_PICKER_AREA_ARIA_LABEL}
      className={colorPickerAreaClass(size, slotClassNames.area)}
      style={{
        background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
      }}
      onPointerDown={handlePointerDown}
    >
      <div
        aria-hidden
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
      />
    </div>
  );
}

function ColorPickerHexInput({ hex, setHsva }: ColorPickerHexInputProps) {
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
      className={cn(
        COLOR_PICKER_HEX_INPUT_CLASS,
        slotClassNames.hexInput,
      )}
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
        aria-label={COLOR_PICKER_HEX_INPUT_ARIA_LABEL}
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
}

function ColorPickerAlphaInput({ hsva, setHsva }: ColorPickerAlphaInputProps) {
  const slotClassNames = useColorPickerClassNames();

  return (
    <div
      className={cn(
        COLOR_PICKER_ALPHA_INPUT_CLASS,
        slotClassNames.alphaInput,
      )}
    >
      <input
        type="text"
        value={Math.round(hsva.a)}
        aria-label={COLOR_PICKER_ALPHA_INPUT_ARIA_LABEL}
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
}

function ColorPickerPresets({ presets, hex, setHsva, size }: ColorPickerPresetsProps) {
  const slotClassNames = useColorPickerClassNames();

  return (
    <div
      className={cn(
        COLOR_PICKER_PRESETS_CLASS,
        slotClassNames.presets,
      )}
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
}

export const ColorPickerTrigger = forwardRef<HTMLButtonElement, ColorPickerTriggerProps>(
  function ColorPickerTrigger({ swatchSize, className, ...rest }, ref) {
    const { hex, disabled, size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();

    return (
      <Popover.Trigger
        ref={ref}
        className={cn(slotClassNames.trigger, className)}
        {...rest}
      >
        <ColorSwatch
          color={hex}
          size={swatchSize ?? COLOR_PICKER_SWATCH_SIZE_MAP[size]}
          shape="rounded"
          disabled={disabled}
          aria-label={colorPickerTriggerAriaLabel(hex)}
        />
      </Popover.Trigger>
    );
  },
);

ColorPickerTrigger.displayName = "ColorPickerTrigger";

export const ColorPickerContent = forwardRef<HTMLDivElement, ColorPickerContentProps>(
  function ColorPickerContent(
    { showAlpha = false, presets, className, ...rest },
    ref,
  ) {
    const { hsva, setHsva, hex, size } = useColorPicker();
    const slotClassNames = useColorPickerClassNames();
    const sliderSize = COLOR_PICKER_SLIDER_SIZE_MAP[size];

    return (
      <Popover.Content
        ref={ref}
        unstyled
        offset={POPOVER_DEFAULT_OFFSET}
        align="start"
        aria-label={COLOR_PICKER_CONTENT_ARIA_LABEL}
        className={cn(slotClassNames.content, className)}
      >
        <div
          className={colorPickerContentPanelClass(size, slotClassNames.contentPanel)}
          {...rest}
        >
          <ColorPickerArea size={size} />

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
              className={cn(
                "shrink-0",
                slotClassNames.previewSwatch,
              )}
            />

            <div className={COLOR_PICKER_SLIDERS_STACK_CLASS}>
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
            <ColorPickerHexInput hex={hex} setHsva={setHsva} />
            {showAlpha ? (
              <ColorPickerAlphaInput hsva={hsva} setHsva={setHsva} />
            ) : null}
          </div>

          {presets && presets.length > 0 ? (
            <ColorPickerPresets
              presets={presets}
              hex={hex}
              setHsva={setHsva}
              size={size}
            />
          ) : null}
        </div>
      </Popover.Content>
    );
  },
);

ColorPickerContent.displayName = "ColorPickerContent";
