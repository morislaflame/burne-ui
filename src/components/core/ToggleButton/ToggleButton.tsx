import { forwardRef } from "react";

import "@/components/core/utils/glossInteractive.css";

import { useToggleButtonAnimations } from "./toggleButtonAnimations";
import {
  ToggleButtonContent,
  ToggleButtonFill,
} from "./toggleButtonParts";
import type { ToggleButtonProps } from "./toggleButtonTypes";
import { useToggleButtonRootState } from "./useToggleButtonRootState";

export type {
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
  ToggleButtonClassNames,
} from "./toggleButtonTypes";

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
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
      leftIcon,
      rightIcon,
      animated,
      disabled,
      children,
      onClick,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
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
      animated,
      disabled,
      className,
      classNames,
      onClick,
    });

    const animations = useToggleButtonAnimations({
      animated: state.animated,
      disabled: state.disabled,
      variant: state.variant,
      groupSegment: state.groupSegment,
      pressed: state.pressed,
      onFillStart: state.onFillStart,
      forwardedRef: ref,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

    return (
      <button
        ref={animations.setRefs}
        type={type}
        disabled={state.disabled}
        data-toggle-button-value={state.itemValue}
        role={state.role}
        aria-pressed={state.ariaPressed}
        aria-checked={state.ariaChecked}
        tabIndex={state.tabIndex}
        className={state.buttonClass}
        onPointerEnter={animations.handlePointerEnter}
        onPointerLeave={animations.handlePointerLeave}
        onPointerDown={animations.handlePointerDown}
        onClick={(e) => state.handleClick(e, animations.queueFillOnClick)}
        {...rest}
      >
        <ToggleButtonFill
          bindFillRef={animations.bindFillRef}
          fillColor={state.fillColor}
          pressed={state.pressed}
          roundingClass={state.roundingClass}
          className={state.classNames?.fill}
        />
        <ToggleButtonContent
          size={state.size}
          groupSegment={state.groupSegment}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          contentMotionRef={animations.contentMotionRef}
          classNames={state.classNames}
        >
          {children}
        </ToggleButtonContent>
      </button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";
