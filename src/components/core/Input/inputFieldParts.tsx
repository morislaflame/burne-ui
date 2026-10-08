import { forwardRef } from "react";
 
import { Field } from "@/components/core/Field";
 
import { useInputChromeSlot } from "./inputAnimations";
import { useInputClassNames, useInputFieldContext } from "./inputContext";
import type { InputErrorProps, InputHintProps, InputLabelProps } from "./inputTypes";
 
import { cn } from "@/utils/cn";
 
export const InputLabel = forwardRef<HTMLElement, InputLabelProps>(
  function InputLabel(
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
    const slotClassNames = useInputClassNames();
    const part = useInputChromeSlot("label", {
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
 
InputLabel.displayName = "InputLabel";
 
export const InputHint = forwardRef<HTMLElement, InputHintProps>(
  function InputHint(
    {
      children,
      status,
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
    const field = useInputFieldContext();
    const slotClassNames = useInputClassNames();
    const hintStatus = status ?? field.status;
    const part = useInputChromeSlot("hint", {
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
        status={hintStatus}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children}
      </Field.Hint>
    );
  },
);
 
InputHint.displayName = "InputHint";
 
export const InputError = forwardRef<HTMLElement, InputErrorProps>(
  function InputError(
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
    const field = useInputFieldContext();
    const slotClassNames = useInputClassNames();
    const part = useInputChromeSlot("error", {
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
        {children}
      </Field.Error>
    );
  },
);
 
InputError.displayName = "InputError";
 