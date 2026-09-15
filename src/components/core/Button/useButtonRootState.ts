import { useMemo } from "react";

import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

import { hasButtonCompoundChildren } from "./buttonAPI";
import type { UseButtonRootStateProps } from "./buttonTypes";
import { BUTTON_BASE_INTERACTIVE_CLASS, BUTTON_CURSOR_CLASS, BUTTON_DISABLED_OPACITY_CLASS, BUTTON_STATUS_FOCUS_OUTLINE, buttonConvergeRippleColor, buttonLoaderTextClass, buttonRootClass, buttonSurfaceMotionClass } from "./buttonStyles";

export function useButtonRootState({
  variant: variantProp,
  status = "default",
  size: sizeProp,
  type = "button",
  disabled: disabledProp,
  icon,
  iconPosition = "start",
  ripple = false,
  iconOnly = false,
  groupSegment: groupSegmentProp,
  className = "",
  classNames,
  children,
  onClick,
}: UseButtonRootStateProps) {
  const layoutCtx = useOptionalButtonGroupLayout();
  const groupCtx = useOptionalButtonGroupSegment();
  const formCtx = useOptionalFormBindingContext();
  const groupSegment = layoutCtx?.segmented
    ? undefined
    : (groupSegmentProp ?? groupCtx?.segment);
  const size = sizeProp ?? groupCtx?.buttonSize ?? "base";
  const variant = variantProp ?? groupCtx?.variant ?? "default";
  const userDisabled = Boolean(disabledProp ?? formCtx?.disabled ?? formCtx?.isSubmitting);
  const isGloss = variant === "gloss";
  const blocked = userDisabled;

  const sizeRounded = CONTROL_SIZE_LAYOUT[size].rounded;
  const roundingClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : sizeRounded;

  const groupGlue = groupSegment ? buttonGroupSegmentSurfaceClasses(groupSegment) : "";

  const clipClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : sizeRounded;

  const isCompound = useMemo(() => hasButtonCompoundChildren(children), [children]);
  const labelLayoutClass = !isCompound ? className : undefined;

  const buttonClass = cn(
    BUTTON_BASE_INTERACTIVE_CLASS,
    BUTTON_STATUS_FOCUS_OUTLINE[status],
    buttonRootClass(size, iconOnly),
    buttonSurfaceMotionClass(isGloss, status, variant, !!groupSegment, blocked),
    userDisabled ? BUTTON_DISABLED_OPACITY_CLASS : "",
    roundingClass,
    groupGlue,
    BUTTON_CURSOR_CLASS,
    classNames?.root,
    className,
  );

  const convergeRippleColor = buttonConvergeRippleColor(variant, status);
  const loaderTextClass = buttonLoaderTextClass(variant, status);

  return {
    type,
    size,
    variant,
    status,
    ripple,
    blocked,
    userDisabled,
    isGloss,
    groupSegment,
    clipClass,
    buttonClass,
    convergeRippleColor,
    loaderTextClass,
    icon,
    iconPosition,
    children,
    classNames,
    isCompound,
    labelLayoutClass,
    onClick,
  };
}
