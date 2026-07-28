import { forwardRef, useMemo } from "react";

import "@/components/core/utils/glossInteractive.css";

import { useToggleButtonAnimations } from "./toggleButtonAnimations";
import { toggleButtonHasCompoundPart } from "./toggleButtonAPI";
import { ToggleButtonClassNamesProvider, ToggleButtonContextProvider } from "./toggleButtonContext";
import { ToggleButtonContent, ToggleButtonFill } from "./toggleButtonParts";
import { ToggleButtonSimpleContent } from "./toggleButtonSimpleContent";
import { toggleButtonRootClass } from "./toggleButtonStyles";
import type { ToggleButtonProps } from "./toggleButtonTypes";
import { cn } from "@/utils/cn";
import { useToggleButtonRootState } from "./useToggleButtonRootState";

export type {
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
  ToggleButtonClassNames,
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
      disabled,
      className,
      classNames,
      children,
      onClick,
    });

    const animations = useToggleButtonAnimations({
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
        <ToggleButtonClassNamesProvider classNames={state.classNames}>
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
            onPointerEnter={animations.handlePointerEnter}
            onPointerLeave={animations.handlePointerLeave}
            onPointerDown={animations.handlePointerDown}
            onClick={(e) => state.handleClick(e, animations.queueFillOnClick)}
            {...rest}
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
        </ToggleButtonClassNamesProvider>
      </ToggleButtonContextProvider>
    );
  },
);

ToggleButtonRoot.displayName = "ToggleButtonRoot";
