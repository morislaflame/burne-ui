import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { Ripple } from "@/components/core/Ripple";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

import "../utils/glossInteractive.css";

import { useButtonAnimations } from "./buttonAnimations";
import { buttonHasCompoundPart, hasButtonCompoundChildren } from "./buttonAPI";
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

function resolveButtonInner({
  children,
  isCompound,
  hasCompoundContent,
  hasCompoundLoader,
  hasCompoundSuccess,
  hasCompoundError,
  icon,
  iconPosition,
  classNames,
  labelLayoutClass,
}: {
  children: ReactNode;
  isCompound: boolean;
  hasCompoundContent: boolean;
  hasCompoundLoader: boolean;
  hasCompoundSuccess: boolean;
  hasCompoundError: boolean;
  icon?: ReactNode;
  iconPosition?: ButtonProps["iconPosition"];
  classNames?: ButtonProps["classNames"];
  labelLayoutClass?: string;
}) {
  if (isCompound) {
    if (hasCompoundContent) return children;
    return (
      <ButtonContent>
        {children}
        {!hasCompoundLoader ? <ButtonLoader /> : null}
        {!hasCompoundSuccess ? <ButtonSuccess /> : null}
        {!hasCompoundError ? <ButtonError /> : null}
      </ButtonContent>
    );
  }

  return (
    <ButtonContent>
      <ButtonLabel className={cn(classNames?.label, labelLayoutClass)}>
        <ButtonSimpleContent icon={icon} iconPosition={iconPosition}>
          {children}
        </ButtonSimpleContent>
      </ButtonLabel>
      <ButtonLoader />
      <ButtonSuccess />
      <ButtonError />
    </ButtonContent>
  );
}

export const ButtonRoot = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    classNames,
    variant,
    status,
    size,
    type,
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
    asChild = false,
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
  const asChildElement =
    asChild && isValidElement(children) && Children.count(children) === 1
      ? (children as ReactElement<{ children?: ReactNode }>)
      : null;
  const contentChildren = asChildElement
    ? asChildElement.props.children
    : children;

  const state = useButtonRootState({
    className,
    classNames,
    variant,
    status,
    size,
    type,
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
    children: contentChildren,
    onClick,
  });

  const animations = useButtonAnimations({
    variant: state.variant,
    status: state.status,
    size: state.size,
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

  const hasCompoundContent = buttonHasCompoundPart(contentChildren, "ButtonContent");
  const hasCompoundLoader = buttonHasCompoundPart(contentChildren, "ButtonLoader");
  const hasCompoundSuccess = buttonHasCompoundPart(contentChildren, "ButtonSuccess");
  const hasCompoundError = buttonHasCompoundPart(contentChildren, "ButtonError");
  const isCompound = hasButtonCompoundChildren(contentChildren);

  const inner = (
    <>
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
      {resolveButtonInner({
        children: contentChildren,
        isCompound,
        hasCompoundContent,
        hasCompoundLoader,
        hasCompoundSuccess,
        hasCompoundError,
        icon: state.icon,
        iconPosition: state.iconPosition,
        classNames: state.classNames,
        labelLayoutClass: state.labelLayoutClass,
      })}
    </>
  );

  return (
    <ButtonContextProvider value={contextValue}>
      <ButtonClassNamesProvider classNames={state.classNames}>
        {asChildElement ? (
          cloneElement(
            asChildElement,
            mergeAsChildProps(
              asChildElement,
              {
                ...rest,
                className: state.buttonClass,
                "aria-busy": state.ariaBusy,
                "aria-disabled": state.blocked || undefined,
                tabIndex: state.blocked
                  ? -1
                  : (rest as { tabIndex?: number }).tabIndex,
                onPointerDown: animations.handlePointerDown,
                onPointerEnter: animations.handlePointerEnter,
                onPointerLeave: animations.handlePointerLeave,
                onMouseDown,
                onClick: (event: MouseEvent<HTMLElement>) => {
                  if (state.blocked) {
                    event.preventDefault();
                    return;
                  }
                  handleClick(event as MouseEvent<HTMLButtonElement>);
                },
                children: inner,
              },
              animations.setRefs,
            ),
          )
        ) : (
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
            {inner}
          </button>
        )}
      </ButtonClassNamesProvider>
    </ButtonContextProvider>
  );
});

ButtonRoot.displayName = "ButtonRoot";
