import { useCallback, useState } from "react";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
} from "@/components/composite/ButtonGroup/buttonGroupSegment";
import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { buttonAriaBusy } from "./buttonA11y";
import type { ButtonAsyncState, UseButtonRootStateProps } from "./buttonTypes";
import {
  BUTTON_BASE_INTERACTIVE_CLASS,
  BUTTON_CURSOR_CLASS,
  BUTTON_DISABLED_OPACITY_CLASS,
  BUTTON_GLOSS_STATUS,
  BUTTON_STATUS_FOCUS_OUTLINE,
  buttonConvergeRippleColor,
  buttonIdleSurfaceMotion,
  buttonLoaderTextClass,
  buttonRootClass,
  buttonStatusClass,
  buttonVariantRootClass,
} from "./buttonStyles";

export function useButtonRootState({
  variant: variantProp,
  status = "default",
  size: sizeProp,
  type = "button",
  animated = true,
  asyncState: asyncStateProp,
  onAsyncStateChange,
  onAsyncClick,
  asyncFeedbackMs = 2000,
  disabled: disabledProp,
  leftIcon,
  ripple = false,
  iconOnly = false,
  groupSegment: groupSegmentProp,
  className = "",
  children,
  onClick,
}: UseButtonRootStateProps) {
  const layoutCtx = useOptionalButtonGroupLayout();
  const groupCtx = useOptionalButtonGroupSegment();
  const groupSegment = layoutCtx?.segmented
    ? undefined
    : (groupSegmentProp ?? groupCtx?.segment);
  const size = sizeProp ?? groupCtx?.buttonSize ?? "base";
  const variant = variantProp ?? groupCtx?.variant ?? "default";
  const userDisabled = Boolean(disabledProp);
  const isGloss = variant === "gloss";

  const [internalAsync, setInternalAsync] = useState<ButtonAsyncState>("idle");
  const isControlled = asyncStateProp !== undefined;
  const asyncState: ButtonAsyncState = isControlled ? asyncStateProp! : internalAsync;

  const setUncontrolledAsync = useCallback(
    (next: ButtonAsyncState) => {
      setInternalAsync(next);
      onAsyncStateChange?.(next);
    },
    [onAsyncStateChange],
  );

  const scheduleAsyncIdleReset = useCallback(() => {
    window.setTimeout(() => {
      setUncontrolledAsync("idle");
    }, asyncFeedbackMs);
  }, [asyncFeedbackMs, setUncontrolledAsync]);

  const busy =
    asyncState === "loading" ||
    asyncState === "success" ||
    asyncState === "error";
  const blocked = userDisabled || busy;

  const roundingClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : "rounded-base";

  const groupGlue = groupSegment ? buttonGroupSegmentSurfaceClasses(groupSegment) : "";

  const clipClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : "rounded-base";

  const buttonClass = cn(
    BUTTON_BASE_INTERACTIVE_CLASS,
    BUTTON_STATUS_FOCUS_OUTLINE[status],
    buttonRootClass(size, iconOnly),
    isGloss
      ? cn("gloss-btn", GLOSS_INTERACTIVE_MOTION_CLASS, BUTTON_GLOSS_STATUS[status])
      : cn(
          buttonVariantRootClass(variant, status),
          buttonStatusClass(variant, status),
          !groupSegment && SHADOW_LIFT_MOTION_CLASS,
          buttonIdleSurfaceMotion(variant, status, blocked),
        ),
    userDisabled ? BUTTON_DISABLED_OPACITY_CLASS : "",
    roundingClass,
    className,
    groupGlue,
    BUTTON_CURSOR_CLASS,
  );

  const convergeRippleColor = buttonConvergeRippleColor(variant, status);
  const loaderTextClass = buttonLoaderTextClass(variant, status);

  return {
    type,
    size,
    variant,
    status,
    animated,
    ripple,
    blocked,
    busy,
    userDisabled,
    isGloss,
    groupSegment,
    clipClass,
    buttonClass,
    convergeRippleColor,
    loaderTextClass,
    asyncState,
    isControlled,
    internalAsync,
    leftIcon,
    children,
    onClick,
    onAsyncClick,
    setUncontrolledAsync,
    scheduleAsyncIdleReset,
    ariaBusy: buttonAriaBusy(asyncState),
  };
}
