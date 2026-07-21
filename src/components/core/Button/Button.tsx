import { forwardRef } from "react";

import { Ripple } from "@/components/core/Ripple";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

import "../utils/glossInteractive.css";

import { useButtonAnimations } from "./buttonAnimations";
import { buttonHasCompoundPart } from "./buttonAPI";
import { ButtonClassNamesProvider, ButtonContextProvider } from "./buttonContext";
import { ButtonContent, ButtonError, ButtonExpandRippleLayer, ButtonLabel, ButtonLoader, ButtonSuccess } from "./buttonParts";
import { ButtonSimpleContent } from "./buttonSimpleContent";
import type { ButtonProps } from "./buttonTypes";
import { cn } from "@/utils/cn";
import { useButtonRootState } from "./useButtonRootState";

export type {
  ButtonProps,
  ButtonAsyncState,
  ButtonSize,
  ButtonVariant,
  ButtonStatus,
  ButtonClassNames,
  ButtonContentProps,
  ButtonLabelProps,
  ButtonIconProps,
  ButtonTextProps,
  ButtonLoaderProps,
  ButtonSuccessProps,
  ButtonErrorProps,
} from "./buttonTypes";

export {
  ButtonContent,
  ButtonLabel,
  ButtonIcon,
  ButtonText,
  ButtonLoader,
  ButtonSuccess,
  ButtonError,
} from "./buttonParts";

export const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    classNames,
    variant,
    status,
    size,
    type,
    animated,
    asyncState,
    onAsyncStateChange,
    onAsyncClick,
    asyncFeedbackMs,
    disabled,
    icon,
    iconPosition,
    ripple,
    iconOnly,
    groupSegment,
    children,
    onClick,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
    onMouseDown,
    ...rest
  },
  ref,
) {
  const state = useButtonRootState({
    className,
    classNames,
    variant,
    status,
    size,
    type,
    animated,
    asyncState,
    onAsyncStateChange,
    onAsyncClick,
    asyncFeedbackMs,
    disabled,
    icon,
    iconPosition,
    ripple,
    iconOnly,
    groupSegment,
    children,
    onClick,
  });

  const animations = useButtonAnimations({
    variant: state.variant,
    status: state.status,
    size: state.size,
    animated: state.animated,
    asyncState: state.asyncState,
    isControlled: state.isControlled,
    blocked: state.blocked,
    groupSegment: state.groupSegment,
    forwardedRef: ref,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  });

  const handleClick = animations.createAsyncClickHandler(
    state.onClick,
    state.onAsyncClick,
    state.isControlled,
    state.internalAsync,
    state.setUncontrolledAsync,
    state.scheduleAsyncIdleReset,
  );

  const contextValue = {
    size: state.size,
    variant: state.variant,
    status: state.status,
    asyncState: state.asyncState,
    groupSegment: state.groupSegment,
    loaderTextClass: state.loaderTextClass,
    bindLabelRef: animations.bindLabelRef,
    bindLoaderRef: animations.bindLoaderRef,
    bindSuccessRef: animations.bindSuccessRef,
    bindErrorRef: animations.bindErrorRef,
    contentMotionRef: animations.contentMotionRef,
  };

  const hasCompoundContent = buttonHasCompoundPart(children, "ButtonContent");
  const hasCompoundLoader = buttonHasCompoundPart(children, "ButtonLoader");
  const hasCompoundSuccess = buttonHasCompoundPart(children, "ButtonSuccess");
  const hasCompoundError = buttonHasCompoundPart(children, "ButtonError");

  return (
    <ButtonContextProvider value={contextValue}>
      <ButtonClassNamesProvider classNames={state.classNames}>
        <button
          ref={animations.setRefs}
          {...rest}
          type={state.type}
          disabled={state.blocked}
          aria-busy={state.ariaBusy}
          className={state.buttonClass}
          onPointerDown={animations.handlePointerDown}
          onPointerEnter={animations.handlePointerEnter}
          onPointerLeave={animations.handlePointerLeave}
          onMouseDown={onMouseDown}
          onClick={handleClick}
        >
          {state.ripple ? (
            <Ripple
              color={state.convergeRippleColor}
              disabled={state.blocked || state.asyncState !== "idle"}
              duration={getMotionConfig().rippleDefaultDuration}
              className={state.clipClass}
            />
          ) : null}
          <ButtonExpandRippleLayer
            clipClass={state.clipClass}
            expandRipples={animations.expandRipples}
            onDismiss={animations.dismissExpand}
          />
          {state.isCompound ? (
            hasCompoundContent ? (
              children
            ) : (
              <ButtonContent>
                {children}
                {!hasCompoundLoader ? <ButtonLoader /> : null}
                {!hasCompoundSuccess ? <ButtonSuccess /> : null}
                {!hasCompoundError ? <ButtonError /> : null}
              </ButtonContent>
            )
          ) : (
            <ButtonContent>
              <ButtonLabel className={cn(state.classNames?.label, state.labelLayoutClass)}>
                <ButtonSimpleContent icon={state.icon} iconPosition={state.iconPosition}>
                  {state.children}
                </ButtonSimpleContent>
              </ButtonLabel>
              <ButtonLoader />
              <ButtonSuccess />
              <ButtonError />
            </ButtonContent>
          )}
        </button>
      </ButtonClassNamesProvider>
    </ButtonContextProvider>
  );
});

ButtonRoot.displayName = "ButtonRoot";
