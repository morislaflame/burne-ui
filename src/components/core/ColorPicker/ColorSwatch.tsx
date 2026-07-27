import { forwardRef, type ButtonHTMLAttributes } from "react";

import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";


export type ColorSwatchSize = "small" | "base" | "mid" | "large";
export type ColorSwatchShape = "square" | "circle" | "rounded";

export type ColorSwatchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color?: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  selected?: boolean;
};


const SIZE_CLASS: Record<ColorSwatchSize, string> = {
  small:  "h-5 w-5",
  base:   "h-6 w-6",
  mid:    "h-7 w-7",
  large:  "h-8 w-8",
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
    const {
      setRefs,
      handlePointerEnter,
      handlePointerLeave,
      handlePointerDown,
    } = useFirstLevelInteractiveMotion({
      isGloss: false,
      enabled: !disabled,
      hasHoverShadow: true,
      forwardedRef: ref,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

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
          style={{ backgroundColor: color }}
        />
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
        style={{ backgroundColor: color }}
        {...buttonRest}
      />
    );
  },
);

ColorSwatch.displayName = "ColorSwatch";
