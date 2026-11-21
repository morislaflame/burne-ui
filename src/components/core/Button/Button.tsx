import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject } from "react";
 
import { Ripple } from "@/components/core/Ripple";
import { dataFlag, dataGroupSegment, dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";
 
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
import { mergeSkinSurfaceStyle, useSkinRegistryRevision } from "@/skins/skinContext";
import { usesKitElevationMember } from "@/skins/resolveVariantVisual";
import { KIT_BUTTON_VARIANTS } from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";
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
}: {
  children: ReactNode;
  isCompound: boolean;
  hasCompoundContent: boolean;
  icon?: ReactNode;
  iconPosition?: ButtonProps["iconPosition"];
}) {
  if (isCompound) {
    if (hasCompoundContent) return children;
    return <ButtonContent>{children}</ButtonContent>;
  }
 
  return (
    <ButtonContent>
      <ButtonLabel>
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
  motionState?: ButtonProps["motionState"];
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
    motionState,
  }: ButtonSurfaceProps) {
    const animations = useButtonAnimations({
      variant: state.variant,
      disabled: state.userDisabled,
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

    const rawDataState = (rest as { "data-state"?: string })["data-state"];
    const buttonDataState = state.isLoading
      ? "loading"
      : motionState === "success"
        ? "success"
        : motionState === "error"
          ? "error"
          : motionState === "idle"
            ? "idle"
            : rawDataState === "loading" ||
                rawDataState === "success" ||
                rawDataState === "error" ||
                rawDataState === "idle"
              ? rawDataState
              : undefined;
    const restTabIndex = (rest as { tabIndex?: number }).tabIndex;
 
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
        })}
      </>
    );
 
    return (
      <ButtonContextProvider value={contextValue}>
        {asChildElement ? (
          (() => {
            const mergedAsChild = mergeAsChildProps(
              asChildElement,
              {
                ...rest,
                style: mergeSkinSurfaceStyle(state.surfaceStyle, rest.style),
                className: state.buttonClass,
                "aria-disabled": state.blocked || undefined,
                "aria-busy": state.isLoading || undefined,
                ...(state.blocked
                  ? { tabIndex: -1 }
                  : restTabIndex !== undefined
                    ? { tabIndex: restTabIndex }
                    : {}),
                onPointerOver: animations.pointerHandlers.onPointerOver,
                onPointerOut: animations.pointerHandlers.onPointerOut,
                onPointerDown: animations.handlePointerDown,
                onPointerUp: animations.handlePointerUp,
                onPointerEnter: animations.handlePointerEnter,
                onPointerLeave: animations.handlePointerLeave,
                onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
                  animations.handleKeyDown(event as KeyboardEvent<HTMLButtonElement>);
                  if (
                    !state.blocked &&
                    !event.defaultPrevented &&
                    !event.repeat &&
                    (event.key === " " || event.key === "Spacebar") &&
                    event.currentTarget.tagName !== "BUTTON"
                  ) {
                    event.preventDefault();
                    event.currentTarget.click();
                  }
                },
                onMouseDown,
                onClick: (event: MouseEvent<HTMLElement>) => {
                  if (state.blocked) {
                    event.preventDefault();
                    return;
                  }
                  handleClick(event as MouseEvent<HTMLButtonElement>);
                },
                children: inner,
                ...dataVariantProps({
                  size: state.size,
                  variant: state.variant,
                  status: state.status,
                }),
                "data-group-segment": dataGroupSegment(state.groupSegment != null),
                "data-disabled": dataFlag(state.blocked),
                "data-state": buttonDataState,
              },
              animations.setRefs,
              { disabled: state.blocked },
            );
            if (state.blocked) mergedAsChild.href = undefined;
            return cloneElement(asChildElement, mergedAsChild);
          })()
        ) : (
          <button
            ref={animations.setRefs}
            {...rest}
            style={mergeSkinSurfaceStyle(state.surfaceStyle, rest.style)}
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
            {...dataVariantProps({
              size: state.size,
              variant: state.variant,
              status: state.status,
            })}
            data-group-segment={dataGroupSegment(state.groupSegment != null)}
            data-disabled={dataFlag(state.blocked)}
            data-state={buttonDataState}
            aria-busy={state.isLoading || undefined}
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
    asChild && isValidElement(children) && children.type !== Fragment && Children.count(children) === 1
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
    motionState,
    icon,
    iconPosition,
    ripple,
    iconOnly,
    groupSegment,
    children: contentChildren,
    onClick,
  });
 
  const hoverPointerInsideRef = useRef(false);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(
    () => {
      void skinRevision;
      return resolveButtonMotionDefaults({ variant: state.variant });
    },
    [skinRevision, state.variant],
  );
  const motionParams = useMemo(
    () => ({
      pointerInside: hoverPointerInsideRef,
      hasHoverShadow:
        usesKitElevationMember(state.variant, KIT_BUTTON_VARIANTS, BUTTON_VARIANT_HAS_HOVER_SHADOW) && !state.groupSegment,
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
          motionState={motionState}
        />
      </ButtonMotionProvider>
    </ButtonClassNamesProvider>
  );
});
 
ButtonRoot.displayName = "ButtonRoot";
 