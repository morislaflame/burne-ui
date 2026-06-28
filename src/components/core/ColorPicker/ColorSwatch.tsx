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
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow, SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { CHECKER_STYLE } from "./colorUtils";


export type ColorSwatchSize = "xsmall" | "small" | "base" | "mid" | "large" | "xlarge";
export type ColorSwatchShape = "square" | "circle" | "rounded";

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
  showChecker?: boolean;
};


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


function swatchAccessibleName(
  color: string,
  props: ButtonHTMLAttributes<HTMLButtonElement>,
): string | undefined {
  if (typeof props["aria-label"] === "string") return props["aria-label"];
  if (typeof props["aria-labelledby"] === "string") return undefined;
  return `Select color ${color}`;
}

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
    const shadow = useMemo(() => firstLevelHoverShadow(), []);

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

    const { "aria-label": ariaLabelProp, ...buttonRest } = rest;
    const isInteractive = Boolean(onClick);
    const hasExplicitName =
      typeof ariaLabelProp === "string" || typeof buttonRest["aria-labelledby"] === "string";

    if (!isInteractive && !hasExplicitName) {
      return (
        <span
          aria-hidden
          className={cn(
            "relative shrink-0 overflow-hidden",
            SIZE_CLASS[size],
            SHAPE_CLASS[shape],
            className,
          )}
          style={checkerStyle}
        >
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: color }}
          />
        </span>
      );
    }

    const ariaLabel =
      ariaLabelProp ?? (isInteractive ? swatchAccessibleName(color, rest) : undefined);

    return (
      <button
        ref={setRefs}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        aria-label={ariaLabel}
        className={cn(
          "relative shrink-0 origin-center overflow-hidden will-change-transform",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          SHADOW_LIFT_MOTION_CLASS,
          SIZE_CLASS[size],
          SHAPE_CLASS[shape],
          selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          disabled ? "cursor-not-allowed opacity-40" : onClick ? "cursor-pointer" : "cursor-default",
          className,
        )}
        style={checkerStyle}
        {...buttonRest}
      >
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
