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
import { buttonHasCompoundPart } from "./buttonAPI";
import {
  ButtonClassNamesProvider,
  ButtonContextProvider,
  ButtonMotionProvider,
} from "./buttonContext";
import { ButtonContent, ButtonLabel } from "./buttonParts";
import { ButtonSimpleContent } from "./buttonSimpleContent";
import type { ButtonMotion, ButtonProps } from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";
import { cn } from "@/utils/cn";
import { useButtonRootState } from "./useButtonRootState";

export type {
  ButtonProps,
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
  icon,
  iconPosition,
  classNames,
  labelLayoutClass,
}: {
  children: ReactNode;
  isCompound: boolean;
  hasCompoundContent: boolean;
  icon?: ReactNode;
  iconPosition?: ButtonProps["iconPosition"];
  classNames?: ButtonProps["classNames"];
  labelLayoutClass?: string;
}) {
  if (isCompound) {
    if (hasCompoundContent) return children;
    return <ButtonContent>{children}</ButtonContent>;
  }

  return (
    <ButtonContent>
      <ButtonLabel className={cn(classNames?.label, labelLayoutClass)}>
        <ButtonSimpleContent icon={icon} iconPosition={iconPosition}>
          {children}
        </ButtonSimpleContent>
      </ButtonLabel>
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

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (state.blocked) {
        event.preventDefault();
        return;
      }
      state.onClick?.(event);
    };

    const contextValue = {
      size: state.size,
      variant: state.variant,
      status: state.status,
      groupSegment: state.groupSegment,
      loaderTextClass: state.loaderTextClass,
      contentMotionRef: animations.contentMotionRef,
    };

    const hasCompoundContent = useMemo(
      () => buttonHasCompoundPart(contentChildren, "ButtonContent"),
      [contentChildren],
    );

    const inner = (
      <>
        {state.ripple ? (
          <Ripple
            color={state.convergeRippleColor}
            disabled={state.blocked}
            className={state.clipClass}
          />
        ) : null}
        {resolveButtonInner({
          children: contentChildren,
          isCompound: state.isCompound,
          hasCompoundContent,
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
    disabled,
    icon,
    iconPosition,
    ripple,
    iconOnly,
    groupSegment,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
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
      <ButtonMotionProvider
        motion={motion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
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
