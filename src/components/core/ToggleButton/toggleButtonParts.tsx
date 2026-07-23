import { forwardRef } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { useToggleButtonClassNames, useOptionalToggleButtonContext } from "./toggleButtonContext";
import { toggleButtonContentClass, toggleButtonFillClass, toggleButtonIconClass, toggleButtonLabelClass, toggleButtonTextClass, TOGGLE_BUTTON_TEXT_VARIANT } from "./toggleButtonStyles";
import { type ToggleButtonContentProps, type ToggleButtonFillProps, type ToggleButtonIconStartProps, type ToggleButtonLabelProps, type ToggleButtonTextProps, type ToggleButtonIconEndProps } from "./toggleButtonTypes";
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

export function ToggleButtonIconStart({ className = "", children, ...rest }: ToggleButtonIconStartProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <span
      className={toggleButtonIconClass(size, cn(slotClassNames.icon, className))}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}

ToggleButtonIconStart.displayName = "ToggleButtonIconStart";

export function ToggleButtonIconEnd({
  className = "",
  children,
  ...rest
}: ToggleButtonIconEndProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";

  return (
    <span
      className={toggleButtonIconClass(size, cn(slotClassNames.icon, className))}
      aria-hidden
      {...rest}
    >
      {children}
    </span>
  );
}

ToggleButtonIconEnd.displayName = "ToggleButtonIconEnd";

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
