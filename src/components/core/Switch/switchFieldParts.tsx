import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes, type Ref } from "react";
 
import { Field } from "@/components/core/Field";
import { Text } from "@/components/core/Text";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
 
import { compoundContentHasExternalLabel, compoundHasSwitchLabel } from "./switchAPI";
import { useSwitchChromeSlot } from "./switchAnimations";
import { useSwitchClassNames, useSwitchFieldContext } from "./switchContext";
import {
  SWITCH_CONTENT_COMPOUND_CLASS,
  SWITCH_CONTENT_PASS_THROUGH_CLASS,
  SWITCH_CONTENT_POINTER_CLASS,
  SWITCH_ERROR_DISABLED_CLASS,
  SWITCH_HINT_DISABLED_CLASS,
  SWITCH_LABEL_CLASS,
  SWITCH_LABEL_COMPOUND_SECONDARY_CLASS,
  SWITCH_LABEL_MOTION_CLASS,
  SWITCH_LABEL_TEXT_CLASS,
  SWITCH_LABEL_TEXT_DANGER_CLASS,
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
    const contentClass = cn(
      SWITCH_CONTENT_PASS_THROUGH_CLASS,
      ctx.isCompound && SWITCH_CONTENT_COMPOUND_CLASS,
      slotClassNames.content,
      className,
    );
 
    const useNativeLabel =
      ctx.isCompound &&
      !compoundHasSwitchLabel(children) &&
      !compoundContentHasExternalLabel(children);
 
    if (useNativeLabel) {
      return (
        <label
          ref={ref as Ref<HTMLLabelElement>}
          htmlFor={ctx.switchId}
          id={ctx.labelId}
          className={cn(
            contentClass,
            !ctx.disabled && SWITCH_CONTENT_POINTER_CLASS,
          )}
          {...(rest as LabelHTMLAttributes<HTMLLabelElement>)}
        >
          {children}
        </label>
      );
    }
 
    return (
      <div
        ref={ref}
        className={contentClass}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);
 
SwitchContent.displayName = "SwitchContent";
 
export function SwitchLabel({ children, className, motion, id: idProp, ...rest }: SwitchLabelProps) {
  const field = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();
  const sz = SWITCH_LAYOUT[field.size];
  const { setRef } = useSwitchChromeSlot("label", motion);
 
  return (
    <label
      {...rest}
      htmlFor={field.switchId}
      id={idProp ?? field.labelId}
      ref={mergeRefs(setRef, (node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      })}
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
    >
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={cn(
          SWITCH_LABEL_TEXT_CLASS,
          field.isInvalid && SWITCH_LABEL_TEXT_DANGER_CLASS,
          field.disabled && SWITCH_LABEL_TEXT_DISABLED_CLASS,
          slotClassNames.labelText,
        )}
      >
        {children}
      </Text>
    </label>
  );
}
 
SwitchLabel.displayName = "SwitchLabel";
 
export function SwitchHint({ children, className, variant, motion, ...rest }: SwitchHintProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();
  const { setRef } = useSwitchChromeSlot("hint", motion);
 
  return (
    <Field.Hint
      ref={setRef}
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
 
export function SwitchError({ children, className, motion, ...rest }: SwitchErrorProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();
  const { setRef } = useSwitchChromeSlot("error", motion);
 
  return (
    <Field.Error
      ref={setRef}
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
 
 