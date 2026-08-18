import { forwardRef } from "react";

import { Field } from "@/components/core/Field";

import { comboBoxResolveHintStatus } from "./comboBoxA11y";
import { useComboBoxChromeSlot } from "./comboBoxAnimations";
import { useComboBoxClassNames, useComboBoxFieldContext } from "./comboBoxContext";
import type { ComboBoxErrorProps, ComboBoxHintProps, ComboBoxLabelProps } from "./comboBoxTypes";

import { cn } from "@/utils/cn";

export const ComboBoxLabel = forwardRef<HTMLElement, ComboBoxLabelProps>(
  function ComboBoxLabel(
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
    const slotClassNames = useComboBoxClassNames();
    const part = useComboBoxChromeSlot("label", {
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

ComboBoxLabel.displayName = "ComboBoxLabel";

export const ComboBoxHint = forwardRef<HTMLElement, ComboBoxHintProps>(
  function ComboBoxHint(
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
    const field = useComboBoxFieldContext();
    const slotClassNames = useComboBoxClassNames();
    const hintStatus = comboBoxResolveHintStatus(status, field.status);
    const part = useComboBoxChromeSlot("hint", {
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

ComboBoxHint.displayName = "ComboBoxHint";

export const ComboBoxError = forwardRef<HTMLElement, ComboBoxErrorProps>(
  function ComboBoxError(
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
    const field = useComboBoxFieldContext();
    const slotClassNames = useComboBoxClassNames();
    const part = useComboBoxChromeSlot("error", {
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

ComboBoxError.displayName = "ComboBoxError";
