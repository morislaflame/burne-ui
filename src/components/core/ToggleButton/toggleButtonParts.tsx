import { forwardRef } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import {
  useToggleButtonClassNames,
  useOptionalToggleButtonContext,
} from "./toggleButtonContext";
import {
  toggleButtonContentClass,
  toggleButtonFillClass,
  toggleButtonIconClass,
  toggleButtonLabelClass,
  toggleButtonTextClass,
} from "./toggleButtonStyles";
import {
  TOGGLE_BUTTON_TEXT_VARIANT,
  type ToggleButtonContentProps,
  type ToggleButtonFillProps,
  type ToggleButtonIconProps,
  type ToggleButtonLabelProps,
  type ToggleButtonTextProps,
  type ToggleButtonTrailingProps,
} from "./toggleButtonTypes";
import { SELECTION_FILL_DATA_ATTR } from "./useToggleButtonFillAnimation";

export const ToggleButtonFill = forwardRef<HTMLSpanElement, ToggleButtonFillProps>(
  function ToggleButtonFill({ className = "", ...rest }, ref) {
    const ctx = useOptionalToggleButtonContext();
    const slotClassNames = useToggleButtonClassNames();

    if (!ctx) return null;

    return (
      <span
        ref={ref ?? ctx.bindFillRef}
        aria-hidden
        className={toggleButtonFillClass({
          fillColor: ctx.fillColor,
          pressed: ctx.pressed,
          roundingClass: ctx.roundingClass,
          slotClass: cn(slotClassNames.fill, className),
        })}
        {...rest}
        {...{ [SELECTION_FILL_DATA_ATTR]: "" }}
        data-pressed={ctx.pressed ? "true" : "false"}
      />
    );
  },
);

ToggleButtonFill.displayName = "ToggleButtonFill";

export const ToggleButtonContent = forwardRef<HTMLSpanElement, ToggleButtonContentProps>(
  function ToggleButtonContent({ className = "", children, ...rest }, ref) {
    const ctx = useOptionalToggleButtonContext();
    const slotClassNames = useToggleButtonClassNames();

    return (
      <span
        ref={ref ?? ctx?.contentMotionRef}
        className={toggleButtonContentClass({
          groupSegment: ctx?.groupSegment,
          slotClass: cn(slotClassNames.content, className),
        })}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

ToggleButtonContent.displayName = "ToggleButtonContent";

export const ToggleButtonLabel = forwardRef<HTMLSpanElement, ToggleButtonLabelProps>(
  function ToggleButtonLabel({ className = "", children, ...rest }, ref) {
    const slotClassNames = useToggleButtonClassNames();

    return (
      <span
        ref={ref}
        className={toggleButtonLabelClass({
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

ToggleButtonLabel.displayName = "ToggleButtonLabel";

export function ToggleButtonIcon({ className = "", children, ...rest }: ToggleButtonIconProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <span
      className={toggleButtonIconClass(size, cn(slotClassNames.leftIcon, className))}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}

ToggleButtonIcon.displayName = "ToggleButtonIcon";

export function ToggleButtonTrailing({
  className = "",
  children,
  ...rest
}: ToggleButtonTrailingProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <span
      className={toggleButtonIconClass(size, cn(slotClassNames.rightIcon, className))}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}

ToggleButtonTrailing.displayName = "ToggleButtonTrailing";

export function ToggleButtonText({ className = "", children, ...rest }: ToggleButtonTextProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <Text
      variant={TOGGLE_BUTTON_TEXT_VARIANT[size]}
      as="span"
      inheritColor
      className={toggleButtonTextClass(slotClassNames.text, className)}
      {...rest}
    >
      {children}
    </Text>
  );
}

ToggleButtonText.displayName = "ToggleButtonText";
