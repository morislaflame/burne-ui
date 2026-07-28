import { forwardRef } from "react";

import "../utils/glossInteractive.css";

import { useCloseButtonAnimations } from "./closeButtonAnimations";
import { CloseButtonClassNamesProvider } from "./closeButtonContext";
import { CloseButtonIcon, CloseButtonRipple } from "./closeButtonParts";
import type { CloseButtonProps } from "./closeButtonTypes";
import { useCloseButtonRootState } from "./useCloseButtonRootState";

export type {
  CloseButtonProps,
  CloseButtonSize,
  CloseButtonVariant,
  CloseButtonClassNames,
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
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
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

    const animations = useCloseButtonAnimations({
      variant: state.variant,
      disabled: state.disabled,
      forwardedRef: ref,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onKeyDown,
    });

    return (
      <CloseButtonClassNamesProvider classNames={state.classNames}>
        <button
          ref={animations.setRefs}
          type={state.type}
          disabled={state.disabled}
          aria-label={state.ariaLabel}
          className={state.buttonClass}
          {...rest}
          onPointerEnter={animations.handlePointerEnter}
          onPointerLeave={animations.handlePointerLeave}
          onPointerDown={animations.handlePointerDown}
          onKeyDown={animations.handleKeyDown}
        >
          {state.ripple ? (
            <CloseButtonRipple
              color={state.convergeRippleColor}
              disabled={state.disabled}
            />
          ) : null}
          <CloseButtonIcon size={state.size} />
        </button>
      </CloseButtonClassNamesProvider>
    );
  },
);

CloseButton.displayName = "CloseButton";
