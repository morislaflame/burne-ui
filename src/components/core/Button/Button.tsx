import { forwardRef } from "react";

import { Ripple } from "@/components/core/Ripple";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

import "../utils/glossInteractive.css";

import { useButtonAnimations } from "./buttonAnimations";
import { ButtonContent, ButtonExpandRippleLayer } from "./buttonParts";
import type { ButtonProps } from "./buttonTypes";
import { useButtonRootState } from "./useButtonRootState";

export type {
  ButtonProps,
  ButtonAsyncState,
  ButtonSize,
  ButtonVariant,
  ButtonStatus,
} from "./buttonTypes";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
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
    leftIcon,
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
    leftIcon,
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
    userDisabled: state.userDisabled,
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

  return (
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
      <ButtonContent
        size={state.size}
        variant={state.variant}
        status={state.status}
        asyncState={state.asyncState}
        groupSegment={state.groupSegment}
        leftIcon={state.leftIcon}
        bindLabelRef={animations.bindLabelRef}
        bindLoaderRef={animations.bindLoaderRef}
        bindSuccessRef={animations.bindSuccessRef}
        bindErrorRef={animations.bindErrorRef}
        contentMotionRef={animations.contentMotionRef}
        loaderTextClass={state.loaderTextClass}
      >
        {state.children}
      </ButtonContent>
    </button>
  );
});
