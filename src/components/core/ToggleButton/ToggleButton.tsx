import { forwardRef, useMemo, useRef } from "react";

import "@/components/core/utils/glossInteractive.css";

import { resolveToggleButtonMotionDefaults, useToggleButtonAnimations } from "./toggleButtonAnimations";
import { toggleButtonHasCompoundPart } from "./toggleButtonAPI";
import {
  ToggleButtonClassNamesProvider,
  ToggleButtonContextProvider,
  ToggleButtonMotionProvider,
} from "./toggleButtonContext";
import { ToggleButtonContent, ToggleButtonFill } from "./toggleButtonParts";
import { ToggleButtonSimpleContent } from "./toggleButtonSimpleContent";
import { toggleButtonRootClass } from "./toggleButtonStyles";
import type { ToggleButtonMotion, ToggleButtonProps } from "./toggleButtonTypes";
import { cn } from "@/utils/cn";
import { useToggleButtonRootState } from "./useToggleButtonRootState";

export type {
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
  ToggleButtonClassNames,
  ToggleButtonMotion,
  ToggleButtonPartMotion,
  ToggleButtonPointerMotion,
  ToggleButtonCheckMotion,
  ToggleButtonFillProps,
  ToggleButtonContentProps,
  ToggleButtonLabelProps,
  ToggleButtonIconStartProps,
  ToggleButtonIconEndProps,
  ToggleButtonTextProps,
} from "./toggleButtonTypes";

export {
  ToggleButtonContent,
  ToggleButtonFill,
  ToggleButtonLabel,
  ToggleButtonIconStart,
  ToggleButtonIconEnd,
  ToggleButtonText,
} from "./toggleButtonParts";

type ToggleButtonSurfaceProps = {
  state: ReturnType<typeof useToggleButtonRootState>;
  motion?: ToggleButtonMotion;
  type: ToggleButtonProps["type"];
  icon: ToggleButtonProps["icon"];
  iconPosition: ToggleButtonProps["iconPosition"];
  className: ToggleButtonProps["className"];
  children: ToggleButtonProps["children"];
  rest: Omit<
    ToggleButtonProps,
    | "className"
    | "classNames"
    | "value"
    | "groupSegment"
    | "pressed"
    | "defaultPressed"
    | "onPressedChange"
    | "onFillStart"
    | "variant"
    | "fillColor"
    | "size"
    | "type"
    | "icon"
    | "iconPosition"
    | "disabled"
    | "children"
    | "motion"
    | "onClick"
    | "onFocus"
    | "onPointerDown"
    | "onPointerUp"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerEnter"
    | "onPointerLeave"
    | "onKeyDown"
  >;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  hoverPointerInsideRef: React.RefObject<boolean>;
  onReleaseStartRef: React.RefObject<(() => void) | undefined>;
  onPointerDown: ToggleButtonProps["onPointerDown"];
  onPointerUp: ToggleButtonProps["onPointerUp"];
  onPointerOver: ToggleButtonProps["onPointerOver"];
  onPointerOut: ToggleButtonProps["onPointerOut"];
  onPointerEnter: ToggleButtonProps["onPointerEnter"];
  onPointerLeave: ToggleButtonProps["onPointerLeave"];
  onKeyDown: ToggleButtonProps["onKeyDown"];
};

function ToggleButtonSurface({
  state,
  motion,
  type = "button",
  icon,
  iconPosition,
  className,
  children,
  rest,
  forwardedRef,
  hoverPointerInsideRef,
  onReleaseStartRef,
  onPointerDown,
  onPointerUp,
  onPointerOver,
  onPointerOut,
  onPointerEnter,
  onPointerLeave,
  onKeyDown,
}: ToggleButtonSurfaceProps) {
  const animations = useToggleButtonAnimations({
    disabled: state.disabled,
    variant: state.variant,
    groupSegment: state.groupSegment,
    pressed: state.pressed,
    motion,
    hoverPointerInsideRef,
    onReleaseStartRef,
    onFillStart: state.onFillStart,
    forwardedRef,
    onPointerEnter,
    onPointerLeave,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    onKeyDown,
  });

  const buttonClass = toggleButtonRootClass({
    variant: state.variant,
    pressed: animations.displayPressed,
    disabled: state.disabled,
    size: state.size,
    groupSegment: state.groupSegment,
    slotClass: state.classNames?.root,
    className,
  });

  const contextValue = {
    size: state.size,
    variant: state.variant,
    groupSegment: state.groupSegment,
    contentMotionRef: animations.contentMotionRef,
    bindFillRef: animations.bindFillRef,
    fillColor: state.fillColor,
    pressed: animations.displayPressed,
    roundingClass: state.roundingClass,
  };

  const { hasCompoundFill, hasCompoundContent } = useMemo(
    () => ({
      hasCompoundFill: toggleButtonHasCompoundPart(children, "ToggleButtonFill"),
      hasCompoundContent: toggleButtonHasCompoundPart(children, "ToggleButtonContent"),
    }),
    [children],
  );

  return (
    <ToggleButtonContextProvider value={contextValue}>
      <button
        ref={animations.setRefs}
        type={type}
        disabled={state.disabled}
        data-toggle-button-value={state.itemValue}
        role={state.role}
        aria-pressed={state.ariaPressed}
        aria-checked={state.ariaChecked}
        tabIndex={state.tabIndex}
        className={buttonClass}
        {...rest}
        onPointerOver={animations.pointerHandlers.onPointerOver}
        onPointerOut={animations.pointerHandlers.onPointerOut}
        onPointerEnter={animations.handlePointerEnter}
        onPointerLeave={animations.handlePointerLeave}
        onPointerDown={animations.handlePointerDown}
        onPointerUp={animations.handlePointerUp}
        onKeyDown={animations.handleKeyDown}
        onClick={(e) => state.handleClick(e, animations.queueFillOnClick)}
        onFocus={state.handleFocus}
      >
        {!hasCompoundFill ? <ToggleButtonFill /> : null}
        {state.isCompound ? (
          hasCompoundContent ? (
            children
          ) : (
            <ToggleButtonContent>{children}</ToggleButtonContent>
          )
        ) : (
          <ToggleButtonContent
            className={cn(state.classNames?.content, state.contentLayoutClass)}
          >
            <ToggleButtonSimpleContent icon={icon} iconPosition={iconPosition}>
              {state.children}
            </ToggleButtonSimpleContent>
          </ToggleButtonContent>
        )}
      </button>
    </ToggleButtonContextProvider>
  );
}

export const ToggleButtonRoot = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      className,
      classNames,
      value: itemValue,
      groupSegment,
      pressed,
      defaultPressed,
      onPressedChange,
      onFillStart,
      variant,
      fillColor,
      size,
      type = "button",
      icon,
      iconPosition,
      disabled,
      children,
      motion,
      onClick,
      onFocus,
      onPointerDown,
      onPointerUp,
      onPointerOver,
      onPointerOut,
      onPointerEnter,
      onPointerLeave,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const state = useToggleButtonRootState({
      value: itemValue,
      groupSegment,
      pressed,
      defaultPressed,
      onPressedChange,
      onFillStart,
      variant,
      fillColor,
      size,
      disabled,
      className,
      classNames,
      children,
      onClick,
      onFocus,
    });

    const hoverPointerInsideRef = useRef(false);
    const onReleaseStartRef = useRef<(() => void) | undefined>(undefined);
    const motionDefaults = useMemo(
      () => resolveToggleButtonMotionDefaults({ variant: state.variant }),
      [state.variant],
    );
    const motionParams = useMemo(
      () => ({
        pointerInside: hoverPointerInsideRef,
        hasHoverShadow: state.variant !== "gloss" && !state.groupSegment,
        isGloss: state.variant === "gloss",
        onReleaseStart: () => onReleaseStartRef.current?.(),
      }),
      [state.groupSegment, state.variant],
    );

    return (
      <ToggleButtonClassNamesProvider classNames={state.classNames}>
        <ToggleButtonMotionProvider
          motion={motion}
          defaults={motionDefaults}
          params={motionParams}
        >
          <ToggleButtonSurface
            state={state}
            motion={motion}
            type={type}
            icon={icon}
            iconPosition={iconPosition}
            className={className}
            rest={rest}
            forwardedRef={ref}
            hoverPointerInsideRef={hoverPointerInsideRef}
            onReleaseStartRef={onReleaseStartRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onKeyDown={onKeyDown}
          >
            {children}
          </ToggleButtonSurface>
        </ToggleButtonMotionProvider>
      </ToggleButtonClassNamesProvider>
    );
  },
);

ToggleButtonRoot.displayName = "ToggleButtonRoot";
