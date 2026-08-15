import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";

import { Ripple } from "@/components/core/Ripple";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";

import "../utils/glossInteractive.css";

import { resolveButtonMotionDefaults, useButtonAnimations } from "./buttonAnimations";
import { buttonHasCompoundPart, hasButtonCompoundChildren } from "./buttonAPI";
import {
  ButtonClassNamesProvider,
  ButtonContextProvider,
  ButtonMotionProvider,
} from "./buttonContext";
import { ButtonContent, ButtonError, ButtonExpandRippleLayer, ButtonLabel, ButtonLoader, ButtonSuccess } from "./buttonParts";
import { ButtonSimpleContent } from "./buttonSimpleContent";
import type { ButtonMotion, ButtonProps } from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";
import { cn } from "@/utils/cn";
import { useButtonRootState } from "./useButtonRootState";

export type {
  ButtonProps,
  ButtonAsyncState,
  ButtonSize,
  ButtonVariant,
  ButtonStatus,
  ButtonClassNames,
  ButtonMotion,
  ButtonPartMotion,
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

type ButtonSurfaceProps = {
  state: ReturnType<typeof useButtonRootState>;
  motion?: ButtonMotion;
  hoverPointerInsideRef: RefObject<boolean>;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  asChildElement: ReactElement<{ children?: ReactNode }> | null;
  contentChildren: ReactNode;
  onPointerEnter?: ButtonProps["onPointerEnter"];
  onPointerLeave?: ButtonProps["onPointerLeave"];
  onPointerOver?: ButtonProps["onPointerOver"];
  onPointerOut?: ButtonProps["onPointerOut"];
  onPointerDown?: ButtonProps["onPointerDown"];
  onPointerUp?: ButtonProps["onPointerUp"];
  onKeyDown?: ButtonProps["onKeyDown"];
  onMouseDown?: ButtonProps["onMouseDown"];
  rest: HTMLAttributes<HTMLButtonElement>;
};

function ButtonSurface({
    state,
    motion,
    hoverPointerInsideRef,
    forwardedRef,
    asChildElement,
    contentChildren,
    onPointerEnter,
    onPointerLeave,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    onKeyDown,
    onMouseDown,
    rest,
  }: ButtonSurfaceProps) {
    const animations = useButtonAnimations({
      variant: state.variant,
      status: state.status,
      size: state.size,
      asyncState: state.asyncState,
      isControlled: state.isControlled,
      blocked: state.blocked,
      groupSegment: state.groupSegment,
      motion,
      hoverPointerInsideRef,
      forwardedRef,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onKeyDown,
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
      asyncMotionReady: animations.asyncMotionReady,
      groupSegment: state.groupSegment,
      loaderTextClass: state.loaderTextClass,
      bindLabelRef: animations.bindLabelRef,
      bindLoaderRef: animations.bindLoaderRef,
      bindSuccessRef: animations.bindSuccessRef,
      bindErrorRef: animations.bindErrorRef,
      contentMotionRef: animations.contentMotionRef,
    };

    const {
      hasCompoundContent,
      hasCompoundLoader,
      hasCompoundSuccess,
      hasCompoundError,
      isCompound,
    } = useMemo(() => {
      return {
        hasCompoundContent: buttonHasCompoundPart(contentChildren, "ButtonContent"),
        hasCompoundLoader: buttonHasCompoundPart(contentChildren, "ButtonLoader"),
        hasCompoundSuccess: buttonHasCompoundPart(contentChildren, "ButtonSuccess"),
        hasCompoundError: buttonHasCompoundPart(contentChildren, "ButtonError"),
        isCompound: hasButtonCompoundChildren(contentChildren),
      };
    }, [contentChildren]);

    const inner = (
      <>
        {state.ripple ? (
          <Ripple
            color={state.convergeRippleColor}
            disabled={state.blocked || state.asyncState !== "idle"}
            className={state.clipClass}
          />
        ) : null}
        <ButtonExpandRippleLayer
          ref={animations.expandRippleLayerRef}
          clipClass={state.clipClass}
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
                onPointerOver: animations.pointerHandlers.onPointerOver,
                onPointerOut: animations.pointerHandlers.onPointerOut,
                onPointerDown: animations.handlePointerDown,
                onPointerUp: animations.handlePointerUp,
                onPointerEnter: animations.handlePointerEnter,
                onPointerLeave: animations.handlePointerLeave,
                onKeyDown: animations.handleKeyDown,
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
            onPointerOver={animations.pointerHandlers.onPointerOver}
            onPointerOut={animations.pointerHandlers.onPointerOut}
            onPointerDown={animations.handlePointerDown}
            onPointerUp={animations.handlePointerUp}
            onPointerEnter={animations.handlePointerEnter}
            onPointerLeave={animations.handlePointerLeave}
            onKeyDown={animations.handleKeyDown}
            onMouseDown={onMouseDown}
            onClick={handleClick}
          >
            {inner}
          </button>
        )}
      </ButtonContextProvider>
    );
  };


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
    motion,
    asChild = false,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerOver,
    onPointerOut,
    onPointerEnter,
    onPointerLeave,
    onKeyDown,
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

  const hoverPointerInsideRef = useRef(false);
  const motionDefaults = useMemo(
    () => resolveButtonMotionDefaults({ variant: state.variant }),
    [state.variant],
  );
  const motionParams = useMemo(
    () => ({
      pointerInside: hoverPointerInsideRef,
      hasHoverShadow:
        BUTTON_VARIANT_HAS_HOVER_SHADOW.has(state.variant) && !state.groupSegment,
      isGloss: state.variant === "gloss",
    }),
    [state.groupSegment, state.variant],
  );

  return (
    <ButtonClassNamesProvider classNames={state.classNames}>
      <ButtonMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <ButtonSurface
          state={state}
          motion={motion}
          hoverPointerInsideRef={hoverPointerInsideRef}
          forwardedRef={ref}
          asChildElement={asChildElement}
          contentChildren={contentChildren}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          rest={rest}
        />
      </ButtonMotionProvider>
    </ButtonClassNamesProvider>
  );
});

ButtonRoot.displayName = "ButtonRoot";
