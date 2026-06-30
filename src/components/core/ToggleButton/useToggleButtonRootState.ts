import { useCallback } from "react";

import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";

import {
  toggleButtonAriaChecked,
  toggleButtonAriaPressed,
  toggleButtonRole,
} from "./toggleButtonA11y";
import { useMergedPressed } from "./toggleButtonAPI";
import { useOptionalToggleButtonGroupContext } from "./toggleButtonContext";
import {
  toggleButtonRootClass,
  toggleButtonRoundingClass,
} from "./toggleButtonStyles";
import type { UseToggleButtonRootStateProps } from "./toggleButtonTypes";

export function useToggleButtonRootState({
  value: itemValue,
  groupSegment: groupSegmentProp,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant: variantProp,
  fillColor = "bg-primary-tint",
  size: sizeProp,
  animated = true,
  disabled: disabledProp = false,
  className,
  classNames,
  onClick,
}: UseToggleButtonRootStateProps) {
  const groupCtx = useOptionalToggleButtonGroupContext();
  const segmentCtx = useOptionalButtonGroupSegment();
  const groupSegment = groupSegmentProp ?? segmentCtx?.segment;

  const inGroup = groupCtx != null && itemValue != null;
  const isSingleGroup = groupCtx?.type === "single";

  const size = sizeProp ?? groupCtx?.size ?? segmentCtx?.buttonSize ?? "base";
  const variant = variantProp ?? groupCtx?.variant ?? "default";
  const disabled = disabledProp || Boolean(groupCtx?.disabled);

  const [localPressed, setLocalPressed] = useMergedPressed(
    inGroup ? undefined : pressedProp,
    inGroup ? false : defaultPressed,
  );

  const pressedFromGroup = inGroup ? groupCtx!.isSelected(itemValue!) : localPressed;
  const pressed = inGroup
    ? pressedProp !== undefined
      ? Boolean(pressedProp)
      : pressedFromGroup
    : pressedProp !== undefined
      ? Boolean(pressedProp)
      : localPressed;

  const roundingClass = toggleButtonRoundingClass(groupSegment);

  const buttonClass = toggleButtonRootClass({
    variant,
    pressed,
    disabled,
    size,
    groupSegment,
    slotClass: classNames?.root,
    className,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, animateTo: (next: boolean) => void) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;

      if (inGroup && itemValue != null) {
        groupCtx!.select(itemValue);
        return;
      }

      const next = !pressed;
      animateTo(next);
      setLocalPressed(next);
      onPressedChange?.(next);
    },
    [
      disabled,
      groupCtx,
      inGroup,
      itemValue,
      onClick,
      onPressedChange,
      pressed,
      setLocalPressed,
    ],
  );

  return {
    itemValue,
    groupCtx,
    groupSegment,
    inGroup,
    isSingleGroup,
    size,
    variant,
    disabled,
    pressed,
    fillColor,
    animated,
    classNames,
    roundingClass,
    buttonClass,
    role: toggleButtonRole({ inGroup, isSingleGroup }),
    ariaPressed: toggleButtonAriaPressed({ inGroup, isSingleGroup, pressed }),
    ariaChecked: toggleButtonAriaChecked({ inGroup, isSingleGroup, pressed }),
    tabIndex:
      inGroup && isSingleGroup ? groupCtx!.tabIndexFor(itemValue!) : undefined,
    handleClick,
  };
}
