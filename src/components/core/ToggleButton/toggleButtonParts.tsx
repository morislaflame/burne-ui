import { forwardRef } from "react";

import { Text } from "@/components/core/Text";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import {
  useOptionalToggleButtonContext,
  useOptionalToggleButtonMotionScope,
  useToggleButtonClassNames,
} from "./toggleButtonContext";
import {
  toggleButtonContentClass,
  toggleButtonFillClass,
  toggleButtonIconClass,
  toggleButtonLabelClass,
  toggleButtonTextClass,
  TOGGLE_BUTTON_TEXT_VARIANT,
} from "./toggleButtonStyles";
import type {
  ToggleButtonContentProps,
  ToggleButtonFillProps,
  ToggleButtonIconEndProps,
  ToggleButtonIconStartProps,
  ToggleButtonLabelProps,
  ToggleButtonTextProps,
} from "./toggleButtonTypes";
import { SELECTION_FILL_DATA_ATTR } from "./useToggleButtonFillAnimation";

export const ToggleButtonFill = forwardRef<HTMLSpanElement, ToggleButtonFillProps>(
  function ToggleButtonFill({ className = "", motion, ...rest }, ref) {
    const ctx = useOptionalToggleButtonContext();
    const slotClassNames = useToggleButtonClassNames();
    const { setRef } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalToggleButtonMotionScope(),
      slot: "fill",
      motion,
      forwardedRef: ref,
    });

    if (!ctx) return null;

    return (
      <span
        ref={mergeRefs(setRef, ctx.bindFillRef)}
        aria-hidden
        className={toggleButtonFillClass({
          fillColor: ctx.fillColor,
          pressed: ctx.pressed,
          variant: ctx.variant,
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
  function ToggleButtonContent({ className = "", children, motion, ...rest }, ref) {
    const ctx = useOptionalToggleButtonContext();
    const slotClassNames = useToggleButtonClassNames();
    const scope = useOptionalToggleButtonMotionScope();
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope,
      slot: "content",
      motion,
      forwardedRef: ref,
    });

    const bindRef = (node: HTMLSpanElement | null) => {
      setRef(node);
      if (ctx?.contentMotionRef) ctx.contentMotionRef.current = node;
      if (ctx?.groupSegment) scope?.registerTarget("root", node);
    };

    return (
      <span
        ref={bindRef}
        className={toggleButtonContentClass({
          groupSegment: ctx?.groupSegment,
          slotClass: cn(slotClassNames.content, className),
        })}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </span>
    );
  },
);

ToggleButtonContent.displayName = "ToggleButtonContent";

export const ToggleButtonLabel = forwardRef<HTMLSpanElement, ToggleButtonLabelProps>(
  function ToggleButtonLabel(
    { className = "", children, motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const slotClassNames = useToggleButtonClassNames();
    const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
      scope: useOptionalToggleButtonMotionScope(),
      slot: "label",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });

    return (
      <span
        ref={setRef}
        className={toggleButtonLabelClass({
          slotClass: slotClassNames.label,
          className,
        })}
        {...rest}
        {...pointerHandlers}
      >
        {children}
      </span>
    );
  },
);

ToggleButtonLabel.displayName = "ToggleButtonLabel";

export function ToggleButtonIconStart({
  className = "",
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: ToggleButtonIconStartProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalToggleButtonMotionScope(),
    slot: "iconStart",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });

  return (
    <span
      ref={setRef}
      className={toggleButtonIconClass(size, cn(slotClassNames.iconStart, className))}
      aria-hidden
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}

ToggleButtonIconStart.displayName = "ToggleButtonIconStart";

export function ToggleButtonIconEnd({
  className = "",
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: ToggleButtonIconEndProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalToggleButtonMotionScope(),
    slot: "iconEnd",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });

  return (
    <span
      ref={setRef}
      className={toggleButtonIconClass(size, cn(slotClassNames.iconEnd, className))}
      aria-hidden
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}

ToggleButtonIconEnd.displayName = "ToggleButtonIconEnd";

export function ToggleButtonText({
  className = "",
  children,
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: ToggleButtonTextProps) {
  const ctx = useOptionalToggleButtonContext();
  const slotClassNames = useToggleButtonClassNames();
  const size = ctx?.size ?? "base";
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalToggleButtonMotionScope(),
    slot: "text",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });

  return (
    <Text
      ref={setRef}
      variant={TOGGLE_BUTTON_TEXT_VARIANT[size]}
      as="span"
      inheritColor
      className={toggleButtonTextClass(slotClassNames.text, className)}
      {...rest}
      {...pointerHandlers}
    >
      {children}
    </Text>
  );
}

ToggleButtonText.displayName = "ToggleButtonText";
