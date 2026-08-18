import { forwardRef } from "react";

import { Field } from "@/components/core/Field";
import { OptionGroupHeader } from "@/components/composite/utils/optionGroupFieldset";
import { cn } from "@/utils/cn";

import { useRadioGroupSlotMotion } from "./radioGroupAnimations";
import { useRadioGroupClassNames, useRadioGroupContext } from "./radioGroupContext";
import { radioGroupListClass } from "./radioGroupStyles";
import type {
  RadioGroupActionsProps,
  RadioGroupErrorProps,
  RadioGroupHintProps,
  RadioGroupLegendProps,
  RadioGroupListProps,
} from "./radioGroupTypes";

export const RadioGroupLegend = forwardRef<HTMLLegendElement, RadioGroupLegendProps>(
  function RadioGroupLegend(
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
    const part = useRadioGroupSlotMotion<HTMLLegendElement>("legend", {
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

RadioGroupLegend.displayName = "RadioGroup.Legend";

export const RadioGroupHint = forwardRef<HTMLElement, RadioGroupHintProps>(
  function RadioGroupHint(
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
    const hintId = useRadioGroupContext().hintId;
    const slotClass = useRadioGroupClassNames().hint;
    const part = useRadioGroupSlotMotion<HTMLElement>("hint", {
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

RadioGroupHint.displayName = "RadioGroup.Hint";

export const RadioGroupError = forwardRef<HTMLElement, RadioGroupErrorProps>(
  function RadioGroupError(
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
    const errorId = useRadioGroupContext().errorId;
    const slotClass = useRadioGroupClassNames().error;
    const part = useRadioGroupSlotMotion<HTMLElement>("error", {
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

RadioGroupError.displayName = "RadioGroup.Error";

export const RadioGroupActions = forwardRef<HTMLDivElement, RadioGroupActionsProps>(
  function RadioGroupActions(
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
    const part = useRadioGroupSlotMotion<HTMLDivElement>("actions", {
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

RadioGroupActions.displayName = "RadioGroup.Actions";

export const RadioGroupList = forwardRef<HTMLDivElement, RadioGroupListProps>(
  function RadioGroupList(
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
    const slotClass = useRadioGroupClassNames().list;
    const part = useRadioGroupSlotMotion<HTMLDivElement>("list", {
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
        className={radioGroupListClass(orientation, cn(slotClass, className))}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);

RadioGroupList.displayName = "RadioGroup.List";
