import { forwardRef } from "react";

import { Field } from "@/components/core/Field";
import { Text } from "@/components/core/Text";

import { useSwitchClassNames, useSwitchFieldContext } from "./switchContext";
import {
  SWITCH_CONTENT_COMPOUND_CLASS,
  SWITCH_CONTENT_PASS_THROUGH_CLASS,
  SWITCH_ERROR_DISABLED_CLASS,
  SWITCH_HINT_DISABLED_CLASS,
  SWITCH_LABEL_CLASS,
  SWITCH_LABEL_COMPOUND_SECONDARY_CLASS,
  SWITCH_LABEL_MOTION_CLASS,
  SWITCH_LABEL_TEXT_CLASS,
  SWITCH_LABEL_TEXT_DISABLED_CLASS,
  SWITCH_LAYOUT,
  switchErrorRow,
  switchLabelCellClass,
  switchSecondaryCellClass,
} from "./switchStyles";
import type {
  SwitchContentProps,
  SwitchErrorProps,
  SwitchHintProps,
  SwitchLabelProps,
} from "./switchTypes";

import { cn } from "@/utils/cn";

export const SwitchContent = forwardRef<HTMLDivElement, SwitchContentProps>(
  function SwitchContent({ className, children, ...rest }, ref) {
    const ctx = useSwitchFieldContext();
    const slotClassNames = useSwitchClassNames();

    return (
      <div
        ref={ref}
        className={cn(
          SWITCH_CONTENT_PASS_THROUGH_CLASS,
          ctx.isCompound && SWITCH_CONTENT_COMPOUND_CLASS,
          slotClassNames.content,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

SwitchContent.displayName = "SwitchContent";

export function SwitchLabel({ children, className, ...rest }: SwitchLabelProps) {
  const field = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();
  const sz = SWITCH_LAYOUT[field.size];

  return (
    <span
      ref={(node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      }}
      className={cn(
        SWITCH_LABEL_CLASS,
        field.isCompound && switchLabelCellClass(field.labelPosition),
        field.isCompound &&
          (field.hasCompoundHint || field.hasCompoundError) &&
          SWITCH_LABEL_COMPOUND_SECONDARY_CLASS,
        field.isCompound && field.useInlineCompoundMotion && SWITCH_LABEL_MOTION_CLASS,
        slotClassNames.label,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={cn(
          SWITCH_LABEL_TEXT_CLASS,
          field.disabled && SWITCH_LABEL_TEXT_DISABLED_CLASS,
          slotClassNames.labelText,
        )}
      >
        {children}
      </Text>
    </span>
  );
}

SwitchLabel.displayName = "SwitchLabel";

export function SwitchHint({ children, className, variant, ...rest }: SwitchHintProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <Field.Hint
      as="span"
      id={ctx.hintId}
      variant={variant ?? SWITCH_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && switchSecondaryCellClass(2, ctx.labelPosition),
        ctx.disabled && SWITCH_HINT_DISABLED_CLASS,
        slotClassNames.hint,
        className,
      )}
      {...rest}
    >
      {children}
    </Field.Hint>
  );
}

SwitchHint.displayName = "Switch.Hint";

export function SwitchError({ children, className, ...rest }: SwitchErrorProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <Field.Error
      as="span"
      id={ctx.errorId}
      variant={SWITCH_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound &&
          switchSecondaryCellClass(switchErrorRow(ctx.hasCompoundHint), ctx.labelPosition),
        ctx.disabled && SWITCH_ERROR_DISABLED_CLASS,
        slotClassNames.error,
        className,
      )}
      {...rest}
    >
      {children}
    </Field.Error>
  );
}

SwitchError.displayName = "Switch.Error";

