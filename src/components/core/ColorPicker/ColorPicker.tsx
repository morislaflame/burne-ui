import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";

import { Popover } from "@/components/core/Popover";
import { cn } from "@/utils/cn";

import {
  clampN,
  hexToHsva,
  hsvaToColorString,
  hsvaToHex,
  hueToRgbString,
  type HSVA,
} from "./colorUtils";
import { ColorSliderTrack } from "./ColorSlider";
import { ColorSwatch, type ColorSwatchSize } from "./ColorSwatch";

// ─── types ───────────────────────────────────────────────────────────────────

export type ColorPickerSize = "small" | "base" | "mid";

export type ColorPickerProps = {
  children?: React.ReactNode;
  /** Controlled value (hex string). */
  value?: string;
  /** Uncontrolled default (hex string). */
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ColorPickerSize;
  side?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
};

export type ColorPickerTriggerProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  swatchSize?: ColorSwatchSize;
};

export type ColorPickerContentProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** Show alpha slider. Default false. */
  showAlpha?: boolean;
  /** Preset color strings (hex). */
  presets?: string[];
};

// ─── context ──────────────────────────────────────────────────────────────────

type ColorPickerCtx = {
  hsva: HSVA;
  setHsva: (next: HSVA) => void;
  hex: string;
  disabled: boolean;
  size: ColorPickerSize;
};

const ColorPickerContext = createContext<ColorPickerCtx | null>(null);

function useColorPickerContext(): ColorPickerCtx {
  const ctx = useContext(ColorPickerContext);
  if (!ctx) throw new Error("ColorPicker compound parts must be inside <ColorPicker>.");
  return ctx;
}

// ─── sizes ────────────────────────────────────────────────────────────────────

const PICKER_WIDTH: Record<ColorPickerSize, string> = {
  small: "w-52",
  base:  "w-64",
  mid:   "w-72",
};

const AREA_HEIGHT: Record<ColorPickerSize, string> = {
  small: "h-32",
  base:  "h-40",
  mid:   "h-48",
};

const PICKER_PAD: Record<ColorPickerSize, string> = {
  small: "p-small gap-small",
  base:  "p-plus gap-plus",
  mid:   "p-mid gap-mid",
};

const SWATCH_SIZE_MAP: Record<ColorPickerSize, ColorSwatchSize> = {
  small: "small",
  base:  "base",
  mid:   "mid",
};

const SLIDER_SIZE_MAP: Record<ColorPickerSize, "small" | "base" | "mid"> = {
  small: "small",
  base:  "base",
  mid:   "mid",
};

// ─── Root ────────────────────────────────────────────────────────────────────

export function ColorPickerRoot({
  children,
  value,
  defaultValue = "#3b82f6",
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  size = "base",
  side = "bottom",
  disabled = false,
}: ColorPickerProps) {
  const isControlled = value !== undefined;
  const [internalHsva, setInternalHsva] = useState<HSVA>(
    () => hexToHsva(value ?? defaultValue) ?? { h: 217, s: 90, v: 96, a: 100 },
  );

  // Sync controlled value → HSVA
  useEffect(() => {
    if (!isControlled || value == null) return;
    const next = hexToHsva(value);
    if (next) setInternalHsva(next);
  }, [isControlled, value]);

  const setHsva = useCallback(
    (next: HSVA) => {
      if (!isControlled) setInternalHsva(next);
      onValueChange?.(hsvaToHex(next));
    },
    [isControlled, onValueChange],
  );

  const hex = hsvaToHex(internalHsva);

  const ctx: ColorPickerCtx = useMemo(
    () => ({ hsva: internalHsva, setHsva, hex, disabled, size }),
    [internalHsva, setHsva, hex, disabled, size],
  );

  return (
    <ColorPickerContext.Provider value={ctx}>
      <Popover
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        side={side}
      >
        {children}
      </Popover>
    </ColorPickerContext.Provider>
  );
}

ColorPickerRoot.displayName = "ColorPickerRoot";

// ─── Trigger ─────────────────────────────────────────────────────────────────

export const ColorPickerTrigger = forwardRef<HTMLSpanElement, ColorPickerTriggerProps>(
  function ColorPickerTrigger({ swatchSize, className = "", ...rest }, ref) {
    const { hex, disabled, size } = useColorPickerContext();
    return (
      <Popover.Trigger ref={ref} className={className} {...rest}>
        <ColorSwatch
          color={hex}
          size={swatchSize ?? SWATCH_SIZE_MAP[size]}
          shape="rounded"
          disabled={disabled}
          aria-label={`Выбранный цвет: ${hex}`}
        />
      </Popover.Trigger>
    );
  },
);

ColorPickerTrigger.displayName = "ColorPickerTrigger";

// ─── 2D Saturation × Value area ──────────────────────────────────────────────

export function ColorPickerArea({ size }: { size: ColorPickerSize }) {
  const { hsva, setHsva } = useColorPickerContext();
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = clampN(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const v = clampN(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100);
      setHsva({ ...hsva, s: Math.round(s), v: Math.round(v) });
    },
    [hsva, setHsva],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) update(e.clientX, e.clientY); };
    const onUp   = () => { dragging.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [update]);

  const hueColor  = hueToRgbString(hsva.h);
  const thumbColor = hsvaToColorString(hsva);

  return (
    <div
      ref={areaRef}
      className={cn("relative w-full touch-none select-none rounded-small cursor-crosshair overflow-hidden", AREA_HEIGHT[size])}
      style={{
        background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        dragging.current = true;
        update(e.clientX, e.clientY);
      }}
    >
      {/* Thumb */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left:            `${hsva.s}%`,
          top:             `${100 - hsva.v}%`,
          width:           "14px",
          height:          "14px",
          backgroundColor: thumbColor,
          boxShadow:       "0 0 0 1px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
}

// ─── Hex input ────────────────────────────────────────────────────────────────

export function ColorPickerHexInput() {
  const { hex, setHsva } = useColorPickerContext();
  const [draft, setDraft] = useState(hex.slice(1));

  // Sync from external
  useEffect(() => { setDraft(hex.slice(1)); }, [hex]);

  const commit = useCallback(() => {
    const candidate = `#${draft}`;
    const parsed = hexToHsva(candidate);
    if (parsed) setHsva(parsed);
    else setDraft(hex.slice(1)); // revert
  }, [draft, hex, setHsva]);

  return (
    <div className="flex items-center gap-xsmall rounded-small border border-base bg-surface-secondary px-small py-xsmall">
      <span className="text-small text-muted select-none">#</span>
      <input
        type="text"
        value={draft}
        maxLength={8}
        spellCheck={false}
        aria-label="Hex-код цвета"
        className="min-w-0 flex-1 bg-transparent text-small font-mono uppercase text-foreground outline-none"
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9a-fA-F]/g, "").toUpperCase())}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
      />
    </div>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

export const ColorPickerContent = forwardRef<HTMLDivElement, ColorPickerContentProps>(
  function ColorPickerContent(
    { showAlpha = false, presets, className = "", ...rest },
    ref,
  ) {
    const { hsva, setHsva, hex, size } = useColorPickerContext();
    const sliderSize = SLIDER_SIZE_MAP[size];

    return (
      <Popover.Content
        ref={ref}
        unstyled
        offset={6}
        align="start"
        className={className}
      >
        <div
          className={cn(
            "flex flex-col rounded-mid border border-base bg-surface text-foreground animate-shadow",
            PICKER_WIDTH[size],
            PICKER_PAD[size],
          )}
          {...rest}
        >
          {/* 2D picker area */}
          <ColorPickerArea size={size} />

          {/* Hue + alpha sliders + preview */}
          <div className="flex items-center gap-small">
            {/* Current color swatch preview */}
            <ColorSwatch
              color={hex}
              size="mid"
              shape="circle"
              className="shrink-0"
              showChecker
            />

            <div className="flex min-w-0 flex-1 flex-col gap-xsmall">
              {/* Hue slider */}
              <ColorSliderTrack
                channel="hue"
                color={hsva}
                value={hsva.h}
                size={sliderSize}
                onValueChange={(h) => setHsva({ ...hsva, h })}
              />

              {/* Alpha slider */}
              {showAlpha && (
                <ColorSliderTrack
                  channel="alpha"
                  color={hsva}
                  value={hsva.a}
                  size={sliderSize}
                  onValueChange={(a) => setHsva({ ...hsva, a })}
                />
              )}
            </div>
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-small">
            <ColorPickerHexInput />
            {showAlpha && (
              <div className="flex items-center gap-xsmall rounded-small border border-base bg-surface-secondary px-small py-xsmall">
                <input
                  type="text"
                  value={Math.round(hsva.a)}
                  aria-label="Прозрачность (%)"
                  className="w-8 bg-transparent text-right text-small font-mono text-foreground outline-none"
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n)) setHsva({ ...hsva, a: clampN(n, 0, 100) });
                  }}
                />
                <span className="text-small text-muted select-none">%</span>
              </div>
            )}
          </div>

          {/* Preset swatches */}
          {presets && presets.length > 0 && (
            <div className="flex flex-wrap gap-xsmall border-t border-base pt-small">
              {presets.map((preset) => (
                <ColorSwatch
                  key={preset}
                  color={preset}
                  size={SWATCH_SIZE_MAP[size]}
                  shape="rounded"
                  selected={hex.toLowerCase() === preset.toLowerCase()}
                  showChecker
                  onClick={() => {
                    const parsed = hexToHsva(preset);
                    if (parsed) setHsva(parsed);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Popover.Content>
    );
  },
);

ColorPickerContent.displayName = "ColorPickerContent";

// ─── compound export ──────────────────────────────────────────────────────────

export { useColorPickerContext as useColorPicker };
