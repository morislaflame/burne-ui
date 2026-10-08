import { forwardRef, useMemo, useRef } from "react";
 
 
import {
  resolveCloseButtonMotionDefaults,
  resolveCloseButtonMotionParams,
  useCloseButtonAnimations,
} from "./closeButtonAnimations";
import { CloseButtonClassNamesProvider, CloseButtonMotionProvider } from "./closeButtonContext";
import { CloseButtonIcon, CloseButtonRipple } from "./closeButtonParts";
import type { CloseButtonProps } from "./closeButtonTypes";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeSkinSurfaceStyle, useSkinRegistryRevision, useSkinSurfaceStyle } from "@/skins/skinContext";

import { useCloseButtonRootState } from "./useCloseButtonRootState";
 
export type {
  CloseButtonProps,
  CloseButtonSize,
  CloseButtonVariant,
  CloseButtonClassNames,
  CloseButtonMotion,
  CloseButtonPartMotion,
} from "./closeButtonTypes";
 
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(
    {
      variant,
      size,
      ripple,
      className,
      classNames,
      disabled,
      type,
      "aria-label": ariaLabel,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      onPointerDown,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const state = useCloseButtonRootState({
      variant,
      size,
      ripple,
      className,
      classNames,
      disabled,
      type,
      "aria-label": ariaLabel,
    });
    const hoverPointerInsideRef = useRef(false);
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveCloseButtonMotionDefaults({
        variant: state.variant,
        disabled: state.disabled,
      });
    }, [skinRevision, state.disabled, state.variant]);
    const motionParams = useMemo(
      () =>
        resolveCloseButtonMotionParams({
          variant: state.variant,
          disabled: state.disabled,
          pointerInside: hoverPointerInsideRef,
        }),
      [state.disabled, state.variant],
    );
 
    return (
      <CloseButtonClassNamesProvider classNames={state.classNames}>
        <CloseButtonMotionProvider
          motion={motion}
          defaults={motionDefaults}
          params={motionParams}
          controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
        >
          <CloseButtonSurface
            state={state}
            motion={motion}
            hoverPointerInsideRef={hoverPointerInsideRef}
            forwardedRef={ref}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onKeyDown={onKeyDown}
            rest={rest}
          />
        </CloseButtonMotionProvider>
      </CloseButtonClassNamesProvider>
    );
  },
);
 
CloseButton.displayName = "CloseButton";
 
function CloseButtonSurface({
  state,
  motion,
  hoverPointerInsideRef,
  forwardedRef,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onKeyDown,
  rest,
}: {
  state: ReturnType<typeof useCloseButtonRootState>;
  motion: CloseButtonProps["motion"];
  hoverPointerInsideRef: React.MutableRefObject<boolean>;
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  onPointerDown?: CloseButtonProps["onPointerDown"];
  onPointerUp?: CloseButtonProps["onPointerUp"];
  onPointerEnter?: CloseButtonProps["onPointerEnter"];
  onPointerLeave?: CloseButtonProps["onPointerLeave"];
  onPointerOver?: CloseButtonProps["onPointerOver"];
  onPointerOut?: CloseButtonProps["onPointerOut"];
  onKeyDown?: CloseButtonProps["onKeyDown"];
  rest: Omit<
    CloseButtonProps,
    | "variant"
    | "size"
    | "ripple"
    | "className"
    | "classNames"
    | "disabled"
    | "type"
    | "aria-label"
    | "motion"
    | "motionController"
    | "onPointerDown"
    | "onPointerUp"
    | "onPointerEnter"
    | "onPointerLeave"
    | "onPointerOver"
    | "onPointerOut"
    | "onKeyDown"
  >;
}) {
  const animations = useCloseButtonAnimations({
    variant: state.variant,
    disabled: state.disabled,
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
  const surfaceStyle = useSkinSurfaceStyle(state.variant);
 
  return (
    <button
      ref={animations.setRefs}
      type={state.type}
      disabled={state.disabled}
      aria-label={state.ariaLabel}
      className={state.buttonClass}
      {...rest}
      style={mergeSkinSurfaceStyle(surfaceStyle, rest.style)}
      onPointerEnter={animations.handlePointerEnter}
      onPointerLeave={animations.handlePointerLeave}
      onPointerOver={animations.pointerHandlers.onPointerOver}
      onPointerOut={animations.pointerHandlers.onPointerOut}
      onPointerDown={animations.handlePointerDown}
      onPointerUp={animations.handlePointerUp}
      onKeyDown={animations.handleKeyDown}
      {...dataVariantProps({ size: state.size, variant: state.variant })}
    >
      {state.ripple ? (
        <CloseButtonRipple
          color={state.convergeRippleColor}
          disabled={state.disabled}
        />
      ) : null}
      <CloseButtonIcon size={state.size} />
    </button>
  );
}
 
