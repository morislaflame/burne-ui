import { forwardRef } from "react";
 
import { Field } from "@/components/core/Field";
 
import { useSelectChromeSlot } from "./selectAnimations";
import { useSelectClassNames, useSelectFieldContext } from "./selectContext";
import type { SelectErrorProps, SelectHintProps, SelectLabelProps } from "./selectTypes";
 
import { cn } from "@/utils/cn";
 
export const SelectLabel = forwardRef<HTMLElement, SelectLabelProps>(
  function SelectLabel(
    {
      className,
      classNames,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useSelectClassNames();
    const part = useSelectChromeSlot("label", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
 
    return (
      <Field.Label
        ref={part.setRef}
        className={className}
        classNames={{
          ...classNames,
          root: cn(slotClassNames.label, classNames?.root),
        }}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
SelectLabel.displayName = "SelectLabel";
 
export const SelectHint = forwardRef<HTMLElement, SelectHintProps>(
  function SelectHint(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useSelectFieldContext();
    const slotClassNames = useSelectClassNames();
    const part = useSelectChromeSlot("hint", {
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
        id={idProp ?? field.hintId}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children}
      </Field.Hint>
    );
  },
);
 
SelectHint.displayName = "SelectHint";
 
export const SelectError = forwardRef<HTMLElement, SelectErrorProps>(
  function SelectError(
    {
      children,
      className,
      id: idProp,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useSelectFieldContext();
    const slotClassNames = useSelectClassNames();
    const part = useSelectChromeSlot("error", {
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
        id={idProp ?? field.errorId}
        className={cn(slotClassNames.error, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.errorMessage}
      </Field.Error>
    );
  },
);
 
SelectError.displayName = "Select.Error";
 