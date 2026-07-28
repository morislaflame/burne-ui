import { useCallback, useMemo, type FocusEvent } from "react";

import { useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { useControllableState } from "@/components/core/utils/useControllableState";

import { toggleButtonAriaChecked, toggleButtonAriaPressed, toggleButtonRole } from "./toggleButtonA11y";
import { hasToggleButtonCompoundChildren } from "./toggleButtonAPI";
import { useOptionalToggleButtonGroupContext } from "./toggleButtonContext";
import { toggleButtonRoundingClass } from "./toggleButtonStyles";
import type { UseToggleButtonRootStateProps } from "./toggleButtonTypes";

export function useToggleButtonRootState({
  value: itemValue,
  groupSegment: groupSegmentProp,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  onFillStart,
  variant: variantProp,
  fillColor = "bg-primary-tint",
  size: sizeProp,
  disabled: disabledProp = false,
  className,
  classNames,
  children,
  onClick,
  onFocus,
}: UseToggleButtonRootStateProps) {
  const groupCtx = useOptionalToggleButtonGroupContext();
  const segmentCtx = useOptionalButtonGroupSegment();
  const groupSegment = groupSegmentProp ?? segmentCtx?.segment;

  const inGroup = groupCtx != null && itemValue != null;
  const isSingleGroup = groupCtx?.type === "single";

  const size = sizeProp ?? groupCtx?.size ?? segmentCtx?.buttonSize ?? "base";
  const variant = variantProp ?? groupCtx?.variant ?? "default";
  const disabled = disabledProp || Boolean(groupCtx?.disabled);

  const [localPressed, setLocalPressed] = useControllableState({
    value: inGroup ? undefined : pressedProp,
    defaultValue: Boolean(inGroup ? false : defaultPressed),
  });

  const pressedFromGroup = inGroup ? groupCtx!.isSelected(itemValue!) : localPressed;
  const pressed = inGroup
    ? pressedProp !== undefined
      ? Boolean(pressedProp)
      : pressedFromGroup
    : pressedProp !== undefined
      ? Boolean(pressedProp)
      : localPressed;

  const roundingClass = toggleButtonRoundingClass(groupSegment, size);

  const isCompound = useMemo(() => hasToggleButtonCompoundChildren(children), [children]);
  const contentLayoutClass = !isCompound ? className : undefined;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, queueFillOnClick: (next: boolean) => void) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;

      if (inGroup && itemValue != null) {
        // Single: clicked item ends selected (re-click is no-op). Multiple: toggle.
        const nextPressed =
          groupCtx!.type === "single" ? true : !groupCtx!.isSelected(itemValue);
        groupCtx!.select(itemValue);
        queueFillOnClick(nextPressed);
        return;
      }

      const next = !pressed;
      queueFillOnClick(next);
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

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLButtonElement>) => {
      onFocus?.(e);
      if (e.defaultPrevented || !inGroup || itemValue == null) return;
      groupCtx!.setRovingValue(itemValue);
    },
    [groupCtx, inGroup, itemValue, onFocus],
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
    onFillStart,
    fillColor,
    classNames,
    roundingClass,
    role: toggleButtonRole({ inGroup, isSingleGroup }),
    ariaPressed: toggleButtonAriaPressed({ inGroup, isSingleGroup, pressed }),
    ariaChecked: toggleButtonAriaChecked({ inGroup, isSingleGroup, pressed }),
    tabIndex: inGroup ? groupCtx!.tabIndexFor(itemValue!) : undefined,
    isCompound,
    contentLayoutClass,
    children,
    handleClick,
    handleFocus,
  };
}
