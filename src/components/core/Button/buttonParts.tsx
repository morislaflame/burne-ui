import { forwardRef, useLayoutEffect, useRef } from "react";

import { Text } from "@/components/core/Text";
import { ensureRippleEase, gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig, motionFeedbackExpand } from "@/components/core/utils/motionConfig";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { cn } from "@/utils/cn";

import { useButtonClassNames, useOptionalButtonContext } from "./buttonContext";
import {
  buttonContentClass,
  buttonErrorLayerClass,
  buttonFeedbackExpandRippleClass,
  buttonIconClass,
  buttonIconSvgClass,
  buttonLabelClass,
  buttonLoaderLayerClass,
  buttonSpinnerClass,
  buttonSpinnerInnerClass,
  buttonSuccessLayerClass,
  buttonTextClass,
  BUTTON_CLIP_LAYER_CLASS,
  BUTTON_SIZE_TEXT_VARIANT,
  BUTTON_SPINNER_MOTION_CLASS,
} from "./buttonStyles";
import type {
  ButtonContentProps,
  ButtonErrorProps,
  ButtonExpandRippleLayerProps,
  ButtonFeedbackExpandRippleProps,
  ButtonIconCheckProps,
  ButtonIconCrossProps,
  ButtonIconProps,
  ButtonLabelProps,
  ButtonLoaderProps,
  ButtonSpinnerProps,
  ButtonSuccessProps,
  ButtonTextProps,
} from "./buttonTypes";

export function ButtonSpinner({ className }: ButtonSpinnerProps) {
  return (
    <span
      className={cn(buttonSpinnerInnerClass(), className)}
      aria-hidden
    />
  );
}

export function ButtonIconCheck({ className }: ButtonIconCheckProps) {
  return (
    <svg
      className={cn(buttonIconSvgClass(), className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ButtonIconCross({ className }: ButtonIconCrossProps) {
  return (
    <svg
      className={cn(buttonIconSvgClass(), className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function ButtonFeedbackExpandRipple({
  size,
  tone,
  onDone,
}: ButtonFeedbackExpandRippleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let finished = false;
    killMotion(el);

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableFeedbackExpand;

    if (reduceMotion) {
      onDoneRef.current();
      return;
    }

    const tween = gsap.fromTo(
      el,
      { scale: 0, autoAlpha: 0.5 },
      {
        scale: 1,
        autoAlpha: 0,
        ...motionFeedbackExpand(),
        ease: ensureRippleEase(),
        overwrite: "auto",
        onComplete: () => {
          if (!finished) onDoneRef.current();
        },
      },
    );

    return () => {
      finished = true;
      tween.kill();
      killMotion(el);
    };
  }, [size, tone]);

  return (
    <span
      ref={ref}
      className={buttonFeedbackExpandRippleClass()}
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background:
          tone === "success"
            ? "color-mix(in oklab, var(--color-success) 55%, transparent)"
            : "color-mix(in oklab, var(--color-danger) 55%, transparent)",
        transform: "scale(0)",
      }}
      aria-hidden
    />
  );
}

export const ButtonContent = forwardRef<HTMLSpanElement, ButtonContentProps>(
  function ButtonContent({ className = "", children, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();

    return (
      <span
        ref={ref ?? ctx?.contentMotionRef}
        className={buttonContentClass({
          groupSegment: Boolean(ctx?.groupSegment),
          slotClass: slotClassNames.content,
          className,
        })}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

ButtonContent.displayName = "ButtonContent";

export const ButtonLabel = forwardRef<HTMLSpanElement, ButtonLabelProps>(
  function ButtonLabel({ className = "", children, ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();

    return (
      <span
        ref={ref ?? ctx?.bindLabelRef}
        className={buttonLabelClass({
          slotClass: slotClassNames.label,
          className,
        })}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

ButtonLabel.displayName = "ButtonLabel";

export function ButtonIcon({ className = "", children, ...rest }: ButtonIconProps) {
  const ctx = useOptionalButtonContext();
  const slotClassNames = useButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <span
      className={buttonIconClass(size, cn(slotClassNames.icon, className))}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}

ButtonIcon.displayName = "ButtonIcon";

export function ButtonText({ className = "", children, ...rest }: ButtonTextProps) {
  const ctx = useOptionalButtonContext();
  const slotClassNames = useButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <Text
      variant={BUTTON_SIZE_TEXT_VARIANT[size]}
      as="span"
      inheritColor
      className={buttonTextClass(slotClassNames.text, className)}
      {...rest}
    >
      {children}
    </Text>
  );
}

ButtonText.displayName = "ButtonText";

export const ButtonLoader = forwardRef<HTMLSpanElement, ButtonLoaderProps>(
  function ButtonLoader({ className = "", ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const asyncState = ctx?.asyncState ?? "idle";
    const loaderTextClass = ctx?.loaderTextClass ?? "";

    return (
      <span
        ref={ref ?? ctx?.bindLoaderRef}
        data-button-async-layer
        className={buttonLoaderLayerClass(
          loaderTextClass,
          cn(slotClassNames.loader, className),
        )}
        aria-hidden={asyncState !== "loading"}
        {...rest}
      >
        <ButtonSpinner
          className={cn(buttonSpinnerClass(size), BUTTON_SPINNER_MOTION_CLASS)}
        />
      </span>
    );
  },
);

ButtonLoader.displayName = "ButtonLoader";

export const ButtonSuccess = forwardRef<HTMLSpanElement, ButtonSuccessProps>(
  function ButtonSuccess({ className = "", ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const asyncState = ctx?.asyncState ?? "idle";
    const layout = CONTROL_SIZE_LAYOUT[size];

    return (
      <span
        ref={ref ?? ctx?.bindSuccessRef}
        data-button-async-layer
        className={buttonSuccessLayerClass(cn(slotClassNames.success, className))}
        aria-hidden={asyncState !== "success"}
        {...rest}
      >
        <ButtonIconCheck className={layout.icon} />
      </span>
    );
  },
);

ButtonSuccess.displayName = "ButtonSuccess";

export const ButtonError = forwardRef<HTMLSpanElement, ButtonErrorProps>(
  function ButtonError({ className = "", ...rest }, ref) {
    const ctx = useOptionalButtonContext();
    const slotClassNames = useButtonClassNames();
    const size = ctx?.size ?? "base";
    const asyncState = ctx?.asyncState ?? "idle";
    const layout = CONTROL_SIZE_LAYOUT[size];

    return (
      <span
        ref={ref ?? ctx?.bindErrorRef}
        data-button-async-layer
        className={buttonErrorLayerClass(cn(slotClassNames.error, className))}
        aria-hidden={asyncState !== "error"}
        {...rest}
      >
        <ButtonIconCross className={layout.icon} />
      </span>
    );
  },
);

ButtonError.displayName = "ButtonError";

export function ButtonExpandRippleLayer({
  clipClass,
  expandRipples,
  onDismiss,
}: ButtonExpandRippleLayerProps) {
  return (
    <span className={cn(BUTTON_CLIP_LAYER_CLASS, clipClass)} aria-hidden>
      {expandRipples.map((rp) => (
        <ButtonFeedbackExpandRipple
          key={rp.id}
          size={rp.size}
          tone={rp.tone}
          onDone={() => onDismiss(rp.id)}
        />
      ))}
    </span>
  );
}
