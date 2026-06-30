import { ensureRippleEase, gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useLayoutEffect, useRef } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig, motionFeedbackExpand } from "@/components/core/utils/motionConfig";

import {
  buttonFeedbackExpandRippleClass,
  buttonIconSvgClass,
  buttonSpinnerInnerClass,
} from "./buttonStyles";
import type {
  ButtonContentProps,
  ButtonFeedbackExpandRippleProps,
  ButtonIconCheckProps,
  ButtonIconCrossProps,
  ButtonSpinnerProps,
} from "./buttonTypes";
import {
  BUTTON_ASYNC_GRID_LAYER_CLASS,
  BUTTON_CONTENT_MOTION_CLASS,
  BUTTON_CONTENT_MOTION_GROUP_CLASS,
  BUTTON_ERROR_LAYER_CLASS,
  BUTTON_LABEL_LAYER_CLASS,
  BUTTON_LABEL_TEXT_CLASS,
  BUTTON_LEFT_ICON_SLOT_CLASS,
  BUTTON_SIZE_TEXT_VARIANT,
  BUTTON_SPINNER_MOTION_CLASS,
  BUTTON_SUCCESS_LAYER_CLASS,
  BUTTON_CLIP_LAYER_CLASS,
  BUTTON_ICON_SLOT_SVG_SIZE,
  buttonSpinnerClass,
} from "./buttonStyles";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

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

export function ButtonContent({
  size,
  asyncState,
  groupSegment,
  leftIcon,
  children,
  bindLabelRef,
  bindLoaderRef,
  bindSuccessRef,
  bindErrorRef,
  contentMotionRef,
  loaderTextClass,
}: ButtonContentProps & { loaderTextClass: string }) {
  const layout = CONTROL_SIZE_LAYOUT[size];

  return (
    <span
      ref={contentMotionRef}
      className={cn(
        BUTTON_CONTENT_MOTION_CLASS,
        groupSegment && BUTTON_CONTENT_MOTION_GROUP_CLASS,
      )}
    >
      <span ref={bindLabelRef} className={BUTTON_LABEL_LAYER_CLASS}>
        {leftIcon != null ? (
          <span
            className={cn(BUTTON_LEFT_ICON_SLOT_CLASS, BUTTON_ICON_SLOT_SVG_SIZE[size])}
            aria-hidden
          >
            {leftIcon}
          </span>
        ) : null}
        <Text
          variant={BUTTON_SIZE_TEXT_VARIANT[size]}
          as="span"
          inheritColor
          className={BUTTON_LABEL_TEXT_CLASS}
        >
          {children}
        </Text>
      </span>
      <span
        ref={bindLoaderRef}
        className={cn(BUTTON_ASYNC_GRID_LAYER_CLASS, loaderTextClass)}
        aria-hidden={asyncState !== "loading"}
      >
        <ButtonSpinner
          className={cn(buttonSpinnerClass(size), BUTTON_SPINNER_MOTION_CLASS)}
        />
      </span>
      <span
        ref={bindSuccessRef}
        className={cn(BUTTON_ASYNC_GRID_LAYER_CLASS, BUTTON_SUCCESS_LAYER_CLASS)}
        aria-hidden={asyncState !== "success"}
      >
        <ButtonIconCheck className={layout.icon} />
      </span>
      <span
        ref={bindErrorRef}
        className={cn(BUTTON_ASYNC_GRID_LAYER_CLASS, BUTTON_ERROR_LAYER_CLASS)}
        aria-hidden={asyncState !== "error"}
      >
        <ButtonIconCross className={layout.icon} />
      </span>
    </span>
  );
}

export function ButtonExpandRippleLayer({
  clipClass,
  expandRipples,
  onDismiss,
}: {
  clipClass: string;
  expandRipples: { id: number; size: number; tone: "success" | "error" }[];
  onDismiss: (id: number) => void;
}) {
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
