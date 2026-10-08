import { forwardRef } from "react";
 
import { Field } from "@/components/core/Field";
import { OptionGroupHeader } from "@/components/composite/utils/optionGroupFieldset";
import { cn } from "@/utils/cn";
 
import { useCheckboxGroupSlotMotion } from "./checkboxGroupAnimations";
import { useCheckboxGroupClassNames, useCheckboxGroupContext } from "./checkboxGroupContext";
import { checkboxGroupListClass } from "./checkboxGroupStyles";
import type {
  CheckboxGroupActionsProps,
  CheckboxGroupErrorProps,
  CheckboxGroupHintProps,
  CheckboxGroupLegendProps,
  CheckboxGroupListProps,
} from "./checkboxGroupTypes";
 
export const CheckboxGroupLegend = forwardRef<HTMLLegendElement, CheckboxGroupLegendProps>(
  function CheckboxGroupLegend(
    {
      children,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const part = useCheckboxGroupSlotMotion<HTMLLegendElement>("legend", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Legend ref={part.setRef} {...rest} {...part.pointerHandlers}>
        <OptionGroupHeader>{children}</OptionGroupHeader>
      </Field.Legend>
    );
  },
);
 
CheckboxGroupLegend.displayName = "CheckboxGroup.Legend";
 
export const CheckboxGroupHint = forwardRef<HTMLElement, CheckboxGroupHintProps>(
  function CheckboxGroupHint(
    {
      id,
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const hintId = useCheckboxGroupContext().hintId;
    const slotClass = useCheckboxGroupClassNames().hint;
    const part = useCheckboxGroupSlotMotion<HTMLElement>("hint", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Hint
        ref={part.setRef}
        as="span"
        variant="small"
        id={id ?? hintId}
        className={cn(slotClass, className)}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
CheckboxGroupHint.displayName = "CheckboxGroup.Hint";
 
export const CheckboxGroupError = forwardRef<HTMLElement, CheckboxGroupErrorProps>(
  function CheckboxGroupError(
    {
      id,
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const errorId = useCheckboxGroupContext().errorId;
    const slotClass = useCheckboxGroupClassNames().error;
    const part = useCheckboxGroupSlotMotion<HTMLElement>("error", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Error
        ref={part.setRef}
        id={id ?? errorId}
        className={cn(slotClass, className)}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
CheckboxGroupError.displayName = "CheckboxGroup.Error";
 
export const CheckboxGroupActions = forwardRef<HTMLDivElement, CheckboxGroupActionsProps>(
  function CheckboxGroupActions(
    {
      className,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const part = useCheckboxGroupSlotMotion<HTMLDivElement>("actions", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Set.Actions
        ref={part.setRef}
        className={className}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
CheckboxGroupActions.displayName = "CheckboxGroup.Actions";
 
export const CheckboxGroupList = forwardRef<HTMLDivElement, CheckboxGroupListProps>(
  function CheckboxGroupList(
    {
      className,
      orientation = "vertical",
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClass = useCheckboxGroupClassNames().list;
    const part = useCheckboxGroupSlotMotion<HTMLDivElement>("list", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    return (
      <div
        ref={part.setRef}
        className={checkboxGroupListClass(orientation, cn(slotClass, className))}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
CheckboxGroupList.displayName = "CheckboxGroup.List";
 