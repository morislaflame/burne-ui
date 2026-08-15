import { forwardRef, memo, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

import { Text } from "@/components/core/Text";
import { clearWillChangeOnComplete, ensureRippleEase, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { isMotionFeatureEnabled, motionFeedbackExpand } from "@/components/core/utils/motionConfig";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

import { useButtonClassNames, useOptionalButtonContext, useOptionalButtonMotionScope } from "./buttonContext";
import { buttonContentClass, buttonErrorLayerClass, buttonFeedbackExpandRippleClass, buttonIconClass, buttonIconSvgClass, buttonLabelClass, buttonLoaderLayerClass, buttonSpinnerClass, buttonSpinnerInnerClass, buttonSuccessLayerClass, buttonTextClass, BUTTON_CLIP_LAYER_CLASS, BUTTON_SIZE_TEXT_VARIANT, BUTTON_SPINNER_MOTION_CLASS } from "./buttonStyles";
import type {
  ButtonContentProps,
  ButtonErrorProps,
  ButtonExpandRippleHandle,
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
  ExpandRipple,
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
      prefersReducedMotion() || !isMotionFeatureEnabled("enableFeedbackExpand");

    if (reduceMotion) {
      onDoneRef.current();
      return;
    }

    setWillChangeTransform(el, true);
    const tween = gsap.fromTo(
      el,
      { scale: 0, autoAlpha: 0.5 },
      {
        scale: 1,
        autoAlpha: 0,
        ...motionFeedbackExpand(),
        ease: ensureRippleEase(),
        overwrite: "auto",
        onComplete: clearWillChangeOnComplete(el, () => {
          if (!finished) onDoneRef.current();
        }),
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
    const scope = useOptionalButtonMotionScope();

    const setRef = (node: HTMLSpanElement | null) => {
      if (ref != null) mergeForwardedRef(ref, node);
      else if (ctx?.contentMotionRef) ctx.contentMotionRef.current = node;
      if (ctx?.groupSegment) scope?.registerTarget("root", node);
    };

    return (
      <span
        ref={setRef}
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
    const asyncState = ctx?.asyncState ?? "idle";
    const cssHidden = !ctx?.asyncMotionReady && asyncState !== "idle";

    return (
      <span
        ref={ref ?? ctx?.bindLabelRef}
        className={buttonLabelClass({
          slotClass: slotClassNames.label,
          className,
          cssHidden,
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
    const cssHidden = !ctx?.asyncMotionReady && asyncState !== "loading";

    return (
      <span
        ref={ref ?? ctx?.bindLoaderRef}
        className={buttonLoaderLayerClass(
          loaderTextClass,
          cn(slotClassNames.loader, className),
          cssHidden,
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
    const cssHidden = !ctx?.asyncMotionReady && asyncState !== "success";

    return (
      <span
        ref={ref ?? ctx?.bindSuccessRef}
        className={buttonSuccessLayerClass(
          cn(slotClassNames.success, className),
          cssHidden,
        )}
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
    const cssHidden = !ctx?.asyncMotionReady && asyncState !== "error";

    return (
      <span
        ref={ref ?? ctx?.bindErrorRef}
        className={buttonErrorLayerClass(
          cn(slotClassNames.error, className),
          cssHidden,
        )}
        aria-hidden={asyncState !== "error"}
        {...rest}
      >
        <ButtonIconCross className={layout.icon} />
      </span>
    );
  },
);

ButtonError.displayName = "ButtonError";

export const ButtonExpandRippleLayer = memo(
  forwardRef<ButtonExpandRippleHandle, ButtonExpandRippleLayerProps>(
    function ButtonExpandRippleLayer({ clipClass }, ref) {
      const [expandRipples, setExpandRipples] = useState<ExpandRipple[]>([]);
      const expandId = useRef(0);

      useImperativeHandle(
        ref,
        () => ({
          push(tone, size) {
            const id = ++expandId.current;
            setExpandRipples((prev) => [...prev, { id, size, tone }]);
          },
        }),
        [],
      );

      const onDismiss = useCallback((id: number) => {
        setExpandRipples((prev) => prev.filter((rp) => rp.id !== id));
      }, []);

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
    },
  ),
);

ButtonExpandRippleLayer.displayName = "ButtonExpandRippleLayer";
