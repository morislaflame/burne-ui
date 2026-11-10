import { forwardRef, useMemo, useRef, type ButtonHTMLAttributes, type Ref } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
 
import {
  resolveColorSwatchMotionDefaults,
  resolveColorSwatchMotionParams,
  useColorSwatchAnimations,
} from "./colorSwatchAnimations";
import { ColorSwatchMotionProvider } from "./colorSwatchContext";
import { colorSwatchClass } from "./colorSwatchStyles";
import type { ColorSwatchClassNames, ColorSwatchProps, ColorSwatchShape, ColorSwatchSize } from "./colorSwatchTypes";
 
export type {
  ColorSwatchClassNames,
  ColorSwatchMotion,
  ColorSwatchPartMotion,
  ColorSwatchProps,
  ColorSwatchShape,
  ColorSwatchSize,
} from "./colorSwatchTypes";
 
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
      classNames,
      onClick,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
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
          ref={ref as Ref<HTMLSpanElement>}
          aria-hidden
          className={colorSwatchClass({
            size,
            shape,
            selected,
            disabled,
            interactive: false,
            className,
            classNames,
          })}
          style={{ backgroundColor: color }}
          {...dataVariantProps({ size })}
          data-state={selected ? "selected" : undefined}
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
        classNames={classNames}
        onClick={onClick}
        motion={motion}
        motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}
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
  classNames,
  onClick,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
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
  classNames?: ColorSwatchClassNames;
  onClick?: ColorSwatchProps["onClick"];
  motion?: ColorSwatchProps["motion"];
  motionController?: ColorSwatchProps["motionController"];
  motionState?: ColorSwatchProps["motionState"];
  motionPayload?: ColorSwatchProps["motionPayload"];
  playInitialState?: ColorSwatchProps["playInitialState"];
  ariaLabelProp?: string;
  buttonRest: Omit<ColorSwatchProps, "color" | "size" | "shape" | "selected" | "disabled" | "className" | "classNames" | "onClick" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState" | "onPointerEnter" | "onPointerLeave" | "onPointerOver" | "onPointerOut" | "onPointerDown" | "onPointerUp" | "onKeyDown" | "aria-label">;
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
    <ColorSwatchMotionProvider motion={motion} defaults={motionDefaults} params={motionParams} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <ColorSwatchButtonSurface
        color={color}
        size={size}
        shape={shape}
        selected={selected}
        disabled={disabled}
        className={className}
        classNames={classNames}
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
  classNames,
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
  classNames?: ColorSwatchClassNames;
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
      className={colorSwatchClass({
        size,
        shape,
        selected,
        disabled,
        interactive: true,
        className,
        classNames,
      })}
      style={{ backgroundColor: color }}
      {...buttonRest}
      {...dataVariantProps({ size })}
      data-state={selected ? "selected" : undefined}
    />
  );
}
 