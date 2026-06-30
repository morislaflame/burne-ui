import { useRef } from "react";

import { Text } from "@/components/core/Text";

import { mergeToggleButtonSlotClass } from "./toggleButtonAPI";
import { useToggleButtonFillAnimation } from "./useToggleButtonFillAnimation";
import {
  toggleButtonContentClass,
  toggleButtonFillClass,
  toggleButtonIconClass,
  TOGGLE_BUTTON_LABEL_CLASS,
} from "./toggleButtonStyles";
import {
  TOGGLE_BUTTON_TEXT_VARIANT,
  type ToggleButtonContentProps,
} from "./toggleButtonTypes";

export function ToggleButtonFill({
  bindFillRef,
  fillColor,
  pressed,
  roundingClass,
  className,
}: {
  bindFillRef: (node: HTMLSpanElement | null) => void;
  fillColor: string;
  pressed: boolean;
  roundingClass: string;
  className?: string;
}) {
  return (
    <span
      ref={bindFillRef}
      aria-hidden
      className={toggleButtonFillClass({
        fillColor,
        pressed,
        roundingClass,
        slotClass: className,
      })}
    />
  );
}

export function ToggleButtonContent({
  size,
  groupSegment,
  leftIcon,
  rightIcon,
  children,
  contentMotionRef,
  classNames,
}: ToggleButtonContentProps) {
  return (
    <span
      ref={contentMotionRef}
      className={toggleButtonContentClass({
        groupSegment,
        slotClass: classNames?.content,
      })}
    >
      {leftIcon != null ? (
        <span className={toggleButtonIconClass(size, classNames?.leftIcon)} aria-hidden>
          {leftIcon}
        </span>
      ) : null}
      {children != null ? (
        <Text
          variant={TOGGLE_BUTTON_TEXT_VARIANT[size]}
          as="span"
          inheritColor
          className={mergeToggleButtonSlotClass(TOGGLE_BUTTON_LABEL_CLASS, classNames?.label)}
        >
          {children}
        </Text>
      ) : null}
      {rightIcon != null ? (
        <span className={toggleButtonIconClass(size, classNames?.rightIcon)} aria-hidden>
          {rightIcon}
        </span>
      ) : null}
    </span>
  );
}

export function useToggleButtonFill(pressed: boolean) {
  const fillRef = useRef<HTMLSpanElement>(null);
  return useToggleButtonFillAnimation(pressed, fillRef);
}
