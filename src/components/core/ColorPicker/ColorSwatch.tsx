import { forwardRef, useMemo, useRef, type ButtonHTMLAttributes } from "react";

import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import {
  resolveColorSwatchMotionDefaults,
  resolveColorSwatchMotionParams,
  useColorSwatchAnimations,
} from "./colorSwatchAnimations";
import { ColorSwatchMotionProvider } from "./colorSwatchContext";
import type { ColorSwatchProps, ColorSwatchShape, ColorSwatchSize } from "./colorSwatchTypes";

export type {
  ColorSwatchMotion,
  ColorSwatchPartMotion,
  ColorSwatchProps,
  ColorSwatchShape,
  ColorSwatchSize,
} from "./colorSwatchTypes";

const SIZE_CLASS: Record<ColorSwatchSize, string> = {
  small: "h-5 w-5",
  base: "h-6 w-6",
  mid: "h-7 w-7",
  large: "h-8 w-8",
};

const SHAPE_CLASS: Record<ColorSwatchShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-small",
  square: "rounded-none",
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
  function ColorSwatch(props, ref) {
    const {
      color = "transparent",
      size = "base",
      shape = "rounded",
      selected = false,
      disabled = false,
      className = "",
      onClick,
      motion,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onKeyDown,
      ...rest
    } = props;
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

    return (
      <ColorSwatchButton
        color={color}
        size={size}
        shape={shape}
        selected={selected}
        disabled={disabled}
        className={className}
        onClick={onClick}
        motion={motion}
        ariaLabelProp={ariaLabelProp}
        buttonRest={buttonRest}
        forwardedRef={ref}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      />
    );
  },
);

ColorSwatch.displayName = "ColorSwatch";

function ColorSwatchButton({
  color,
  size,
  shape,
  selected,
  disabled,
  className,
  onClick,
  motion,
  ariaLabelProp,
  buttonRest,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: {
  color: string;
  size: ColorSwatchSize;
  shape: ColorSwatchShape;
  selected: boolean;
  disabled: boolean;
  className: string;
  onClick?: ColorSwatchProps["onClick"];
  motion?: ColorSwatchProps["motion"];
  ariaLabelProp?: string;
  buttonRest: Omit<ColorSwatchProps, "color" | "size" | "shape" | "selected" | "disabled" | "className" | "onClick" | "motion" | "onPointerEnter" | "onPointerLeave" | "onPointerOver" | "onPointerOut" | "onPointerDown" | "onPointerUp" | "onKeyDown" | "aria-label">;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerEnter?: ColorSwatchProps["onPointerEnter"];
  onPointerLeave?: ColorSwatchProps["onPointerLeave"];
  onPointerOver?: ColorSwatchProps["onPointerOver"];
  onPointerOut?: ColorSwatchProps["onPointerOut"];
  onPointerDown?: ColorSwatchProps["onPointerDown"];
  onPointerUp?: ColorSwatchProps["onPointerUp"];
  onKeyDown?: ColorSwatchProps["onKeyDown"];
}) {
  const hoverPointerInsideRef = useRef(false);
  const motionDefaults = useMemo(
    () => resolveColorSwatchMotionDefaults({ disabled }),
    [disabled],
  );
  const motionParams = useMemo(
    () =>
      resolveColorSwatchMotionParams({
        disabled,
        pointerInside: hoverPointerInsideRef,
      }),
    [disabled],
  );

  return (
    <ColorSwatchMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
      <ColorSwatchButtonSurface
        color={color}
        size={size}
        shape={shape}
        selected={selected}
        disabled={disabled}
        className={className}
        onClick={onClick}
        motion={motion}
        ariaLabelProp={ariaLabelProp}
        buttonRest={buttonRest}
        forwardedRef={forwardedRef}
        hoverPointerInsideRef={hoverPointerInsideRef}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      />
    </ColorSwatchMotionProvider>
  );
}

function ColorSwatchButtonSurface({
  color,
  size,
  shape,
  selected,
  disabled,
  className,
  onClick,
  motion,
  ariaLabelProp,
  buttonRest,
  forwardedRef,
  hoverPointerInsideRef,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: {
  color: string;
  size: ColorSwatchSize;
  shape: ColorSwatchShape;
  selected: boolean;
  disabled: boolean;
  className: string;
  onClick?: ColorSwatchProps["onClick"];
  motion?: ColorSwatchProps["motion"];
  ariaLabelProp?: string;
  buttonRest: Record<string, unknown>;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  hoverPointerInsideRef: React.MutableRefObject<boolean>;
  onPointerEnter?: ColorSwatchProps["onPointerEnter"];
  onPointerLeave?: ColorSwatchProps["onPointerLeave"];
  onPointerOver?: ColorSwatchProps["onPointerOver"];
  onPointerOut?: ColorSwatchProps["onPointerOut"];
  onPointerDown?: ColorSwatchProps["onPointerDown"];
  onPointerUp?: ColorSwatchProps["onPointerUp"];
  onKeyDown?: ColorSwatchProps["onKeyDown"];
}) {
  const {
    setRefs,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
    pointerHandlers,
  } = useColorSwatchAnimations({
    disabled,
    forwardedRef,
    motion,
    hoverPointerInsideRef,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    onPointerOver,
    onPointerOut,
    onKeyDown,
  });

  const ariaLabel =
    ariaLabelProp ??
    (onClick
      ? swatchAccessibleName(color, { "aria-label": ariaLabelProp, ...buttonRest })
      : undefined);

  return (
    <button
      ref={setRefs}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerOver={pointerHandlers.onPointerOver}
      onPointerOut={pointerHandlers.onPointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={cn(
        "relative shrink-0 origin-center overflow-hidden",
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
}
