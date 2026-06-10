import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { Text } from "@/components/core/Text";
import {
  SelectionThumb,
} from "@/components/core/SelectionThumb";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  SELECTION_INDICATOR_SIZE_CLASS,
  type SelectionIndicatorSize,
} from "@/components/core/SelectionIndicator/selectionIndicatorTokens";
import { cn } from "@/utils/cn";

import {
  CHECKER_STYLE,
  clampN,
  hsvaToRgba,
  hueToRgbString,
  type HSVA,
} from "./colorUtils";

// ─── types ───────────────────────────────────────────────────────────────────

export type ColorChannel = "hue" | "saturation" | "value" | "alpha" | "red" | "green" | "blue";
export type ColorSliderSize = SelectionIndicatorSize;
export type ColorSliderOrientation = "horizontal" | "vertical";

export type ColorSliderTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  channel: ColorChannel;
  /** Current full HSVA color (provides context for gradient generation). */
  color?: HSVA;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: ColorSliderSize;
  orientation?: ColorSliderOrientation;
  disabled?: boolean;
};

export type ColorSliderRootProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  channel: ColorChannel;
  color?: HSVA;
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: ColorSliderSize;
  orientation?: ColorSliderOrientation;
  disabled?: boolean;
};

// ─── channel config ──────────────────────────────────────────────────────────

const CHANNEL_RANGE: Record<ColorChannel, { min: number; max: number; step: number }> = {
  hue:        { min: 0,   max: 360, step: 1   },
  saturation: { min: 0,   max: 100, step: 1   },
  value:      { min: 0,   max: 100, step: 1   },
  alpha:      { min: 0,   max: 100, step: 1   },
  red:        { min: 0,   max: 255, step: 1   },
  green:      { min: 0,   max: 255, step: 1   },
  blue:       { min: 0,   max: 255, step: 1   },
};

const CHANNEL_DEFAULT: Record<ColorChannel, number> = {
  hue: 0, saturation: 100, value: 100, alpha: 100, red: 255, green: 0, blue: 0,
};

// ─── gradient generation ─────────────────────────────────────────────────────

function channelGradient(channel: ColorChannel, color: HSVA, horizontal: boolean): CSSProperties {
  const dir = horizontal ? "to right" : "to top";
  const { r, g, b } = hsvaToRgba(color);

  switch (channel) {
    case "hue":
      return {
        background: `linear-gradient(${dir}, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
      };
    case "saturation": {
      const desaturated = hsvaToRgba({ ...color, s: 0 });
      const pure        = hueToRgbString(color.h);
      return { background: `linear-gradient(${dir}, rgb(${desaturated.r},${desaturated.g},${desaturated.b}), ${pure})` };
    }
    case "value": {
      const pure = hueToRgbString(color.h);
      return { background: `linear-gradient(${dir}, #000, ${pure})` };
    }
    case "alpha":
      return {
        ...CHECKER_STYLE,
        backgroundImage:
          CHECKER_STYLE.backgroundImage +
          `,linear-gradient(${dir}, rgba(${r},${g},${b},0), rgb(${r},${g},${b}))`,
      };
    case "red":
      return { background: `linear-gradient(${dir}, rgb(0,${g},${b}), rgb(255,${g},${b}))` };
    case "green":
      return { background: `linear-gradient(${dir}, rgb(${r},0,${b}), rgb(${r},255,${b}))` };
    case "blue":
      return { background: `linear-gradient(${dir}, rgb(${r},${g},0), rgb(${r},${g},255))` };
  }
}

// ─── rail height = thumb diameter (from selection-indicator tokens) ──────────

const RAIL_CROSS_CLASS: Record<ColorSliderSize, { h: string; w: string }> = {
  small: { h: "h-[var(--selection-indicator-small)]", w: "w-[var(--selection-indicator-small)]" },
  base:  { h: "h-[var(--selection-indicator-base)]",  w: "w-[var(--selection-indicator-base)]"  },
  mid:   { h: "h-[var(--selection-indicator-mid)]",   w: "w-[var(--selection-indicator-mid)]"   },
  large: { h: "h-[var(--selection-indicator-large)]", w: "w-[var(--selection-indicator-large)]" },
};

// ─── useMergedValue ──────────────────────────────────────────────────────────

function useMergedValue(
  value: number | undefined,
  defaultValue: number | undefined,
  initial: number,
): [number, (next: number) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? initial);
  const merged = isControlled ? value! : internal;
  const set = useCallback(
    (next: number) => { if (!isControlled) setInternal(next); },
    [isControlled],
  );
  return [merged, set];
}

// ─── ColorSliderTrack ────────────────────────────────────────────────────────

export const ColorSliderTrack = forwardRef<HTMLDivElement, ColorSliderTrackProps>(
  function ColorSliderTrack(
    {
      channel,
      color = { h: 0, s: 100, v: 100, a: 100 },
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "base",
      orientation = "horizontal",
      disabled = false,
      className = "",
      ...rest
    },
    ref,
  ) {
    const { min, max, step } = CHANNEL_RANGE[channel];
    const [value, setValueInternal] = useMergedValue(valueProp, defaultValue, CHANNEL_DEFAULT[channel]);
    const dragging = useRef(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLButtonElement>(null);
    const [active, setActive] = useState(false);
    const horizontal = orientation === "horizontal";

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const emit = useCallback(
      (raw: number) => {
        const next = clampN(Math.round(raw / step) * step, min, max);
        setValueInternal(next);
        onValueChange?.(next);
      },
      [min, max, step, setValueInternal, onValueChange],
    );

    const updateFromPointer = useCallback(
      (clientX: number, clientY: number) => {
        const el = trackRef.current;
        if (!el || disabled) return;
        const rect = el.getBoundingClientRect();
        const ratio = horizontal
          ? clampN((clientX - rect.left) / rect.width,  0, 1)
          : clampN(1 - (clientY - rect.top) / rect.height, 0, 1);
        emit(min + ratio * (max - min));
      },
      [disabled, horizontal, min, max, emit],
    );

    useEffect(() => {
      const onMove = (e: globalThis.PointerEvent) => {
        if (!dragging.current) return;
        updateFromPointer(e.clientX, e.clientY);
      };
      const onUp = () => {
        dragging.current = false;
        setActive(false);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    }, [updateFromPointer]);

    const handleTrackDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        dragging.current = true;
        setActive(true);
        updateFromPointer(e.clientX, e.clientY);
        thumbRef.current?.focus();
      },
      [disabled, updateFromPointer],
    );

    const handleThumbDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled || e.button !== 0) return;
        e.stopPropagation();
        dragging.current = true;
        setActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        if (!prefersReducedInteractiveHoverLift()) {
          void animateInteractivePressSqueeze(e.currentTarget);
        }
      },
      [disabled],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        let delta = 0;
        if (horizontal) {
          if (e.key === "ArrowRight") delta = step;
          else if (e.key === "ArrowLeft") delta = -step;
          else if (e.key === "PageUp")   delta = step * 10;
          else if (e.key === "PageDown") delta = -step * 10;
          else if (e.key === "Home")     { emit(min); return; }
          else if (e.key === "End")      { emit(max); return; }
        } else {
          if (e.key === "ArrowUp")   delta = step;
          else if (e.key === "ArrowDown") delta = -step;
          else if (e.key === "Home")      { emit(min); return; }
          else if (e.key === "End")       { emit(max); return; }
        }
        if (delta !== 0) { e.preventDefault(); emit(value + delta); }
      },
      [disabled, horizontal, step, min, max, value, emit],
    );

    const percent = ((value - min) / (max - min)) * 100;
    const thumbStyle: CSSProperties = horizontal
      ? { left: `${percent}%`, top: 0, height: "100%", aspectRatio: "1", transform: "translateX(-50%)" }
      : { bottom: `${percent}%`, left: 0, width: "100%", aspectRatio: "1", transform: "translateY(50%)" };

    const gradientStyle = channelGradient(channel, color, horizontal);
    const cross = RAIL_CROSS_CLASS[size];

    return (
      <div
        ref={setRefs}
        role="presentation"
        className={cn(
          "relative touch-none select-none rounded-full",
          horizontal ? `w-full ${cross.h}` : `h-48 ${cross.w}`,
          disabled && "opacity-48",
          className,
        )}
        style={gradientStyle}
        onPointerDown={handleTrackDown}
        {...rest}
      >
        <button
          ref={thumbRef}
          type="button"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-orientation={orientation}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "absolute z-[2] box-border flex items-center justify-center",
            "m-0 appearance-none border-0 bg-transparent p-0",
            horizontal
              ? "top-0 h-full w-auto -translate-x-1/2"
              : "left-0 w-full h-auto translate-y-1/2",
            "aspect-square origin-center",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
          )}
          style={thumbStyle}
          onPointerDown={handleThumbDown}
          onKeyDown={handleKeyDown}
        >
          <SelectionThumb active={active} size={size} className={SELECTION_INDICATOR_SIZE_CLASS[size]} />
        </button>
      </div>
    );
  },
);

ColorSliderTrack.displayName = "ColorSliderTrack";

// ─── ColorSliderRoot (simple API with optional label + track) ────────────────

export const ColorSliderRoot = forwardRef<HTMLDivElement, ColorSliderRootProps>(
  function ColorSliderRoot(
    { channel, color, label, size = "base", orientation = "horizontal", className = "", children, ...rest },
    ref,
  ) {
    if (!children) {
      return (
        <div ref={ref} className={cn("flex flex-col gap-xsmall", className)}>
          {label && (
            <div className="flex items-center justify-between">
              <Text as="span" variant="small" className="text-muted">{label}</Text>
              <Text as="span" variant="small" className="font-medium text-foreground">
                {rest.value ?? rest.defaultValue ?? CHANNEL_DEFAULT[channel]}
              </Text>
            </div>
          )}
          <ColorSliderTrack channel={channel} color={color} size={size} orientation={orientation} {...rest} />
        </div>
      );
    }
    return (
      <div ref={ref} className={cn("flex flex-col gap-xsmall", className)}>
        {children}
      </div>
    );
  },
);

ColorSliderRoot.displayName = "ColorSliderRoot";

// ─── compound export ──────────────────────────────────────────────────────────

