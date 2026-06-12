import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
  shadowSm,
} from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

import { CHECKER_STYLE } from "./colorUtils";

// ─── types ───────────────────────────────────────────────────────────────────

export type ColorSwatchSize = "xsmall" | "small" | "base" | "mid" | "large" | "xlarge";
export type ColorSwatchShape = "square" | "circle" | "rounded";

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  /** CSS color string to display. */
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  /** Highlighted ring indicating current selection. */
  selected?: boolean;
  /** Show a checkerboard background (useful for semi-transparent colors). */
  showChecker?: boolean;
};

// ─── size / shape maps ───────────────────────────────────────────────────────

const SIZE_CLASS: Record<ColorSwatchSize, string> = {
  xsmall: "h-4 w-4",
  small:  "h-5 w-5",
  base:   "h-6 w-6",
  mid:    "h-7 w-7",
  large:  "h-8 w-8",
  xlarge: "h-10 w-10",
};

const SHAPE_CLASS: Record<ColorSwatchShape, string> = {
  circle:  "rounded-full",
  rounded: "rounded-small",
  square:  "rounded-none",
};

// ─── component ───────────────────────────────────────────────────────────────

export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(
  function ColorSwatch(
    {
      color = "transparent",
      size = "base",
      shape = "rounded",
      selected = false,
      showChecker = true,
      disabled = false,
      className = "",
      onClick,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const hoverInsideRef = useRef(false);
    const shadow = useMemo(() => ({ hover: shadowSm() }), []);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (disabled || e.defaultPrevented || shouldSkipInteractiveHoverLift()) return;
        hoverInsideRef.current = true;
        const el = btnRef.current;
        if (!el) return;
        animateInteractiveHoverLift(el, true, undefined, shadow);
      },
      [disabled, onPointerEnter, shadow],
    );

    const handlePointerLeave = useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverInsideRef.current = false;
        const el = btnRef.current;
        if (!el || shouldSkipInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, false, undefined, shadow);
      },
      [onPointerLeave, shadow],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (disabled || e.defaultPrevented || shouldSkipInteractiveHoverLift()) return;
        const el = btnRef.current;
        if (!el) return;
        void animateInteractivePressSqueeze(el).then(() => {
          if (btnRef.current && hoverInsideRef.current && !shouldSkipInteractiveHoverLift()) {
            animateInteractiveHoverLift(btnRef.current, true, undefined, shadow);
          }
        });
      },
      [disabled, onPointerDown, shadow],
    );

    const checkerStyle: CSSProperties = showChecker ? CHECKER_STYLE : {};

    return (
      <button
        ref={setRefs}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className={cn(
          "relative shrink-0 origin-center overflow-hidden will-change-transform",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "animate-shadow",
          SIZE_CLASS[size],
          SHAPE_CLASS[shape],
          selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          disabled ? "cursor-not-allowed opacity-40" : onClick ? "cursor-pointer" : "cursor-default",
          className,
        )}
        style={checkerStyle}
        {...rest}
      >
        {/* Color overlay */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: color }}
        />
      </button>
    );
  },
);

ColorSwatch.displayName = "ColorSwatch";
