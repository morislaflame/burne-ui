import { Children, forwardRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { dataFlag } from "@/components/core/utils/dataContract";
import { ariaInvalidValue, dataInvalidValue } from "@/components/core/utils/fieldInvalid";
import { KitAdd, KitRemove } from "@/components/core/utils/kitIcons";
import { cn } from "@/utils/cn";

import {
  NUMBER_INPUT_DECREASE_LABEL,
  NUMBER_INPUT_INCREASE_LABEL,
} from "./numberInputA11y";
import { isNumberInputShellElement } from "./numberInputAPI";
import {
  useNumberInputChromeSlot,
  useNumberInputControlMotion,
  useNumberInputDecrementMotion,
  useNumberInputIncrementMotion,
  useNumberInputShellMotion,
} from "./numberInputAnimations";
import { useNumberInputClassNames, useNumberInputContext } from "./numberInputContext";
import {
  numberInputControlClass,
  numberInputIconClass,
  numberInputShellClass,
  numberInputStepperClass,
} from "./numberInputStyles";
import type {
  NumberInputControlProps,
  NumberInputErrorProps,
  NumberInputHintProps,
  NumberInputLabelProps,
  NumberInputStepperProps,
} from "./numberInputTypes";

function NumberInputShell({ children }: { children?: ReactNode }) {
  const field = useNumberInputContext();
  const slotClassNames = useNumberInputClassNames();
  const shell = useNumberInputShellMotion();

  return (
    <div
      ref={shell.setRef}
      className={numberInputShellClass({
        size: field.size,
        variant: field.variant,
        status: field.status,
        disabled: field.disabled,
        shellHoverMotionClass: shell.shellHoverMotionClass,
        slotClass: slotClassNames.shell,
      })}
      {...shell.pointerHandlers}
    >
      {children}
    </div>
  );
}

export function NumberInputCompoundBody({ children }: { children?: ReactNode }) {
  const nodes = Children.toArray(children);
  const firstShell = nodes.findIndex(isNumberInputShellElement);
  if (firstShell < 0) return children;
  const shellNodes = nodes.filter(isNumberInputShellElement);
  return (
    <>
      {nodes.map((node, index) => {
        if (!isNumberInputShellElement(node)) return node;
        if (index !== firstShell) return null;
        return <NumberInputShell key="number-input-shell">{shellNodes}</NumberInputShell>;
      })}
    </>
  );
}

export const NumberInputLabel = forwardRef<HTMLElement, NumberInputLabelProps>(
  function NumberInputLabel(
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
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const part = useNumberInputChromeSlot("label", {
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
        id={idProp ?? field.labelId}
        className={cn(slotClassNames.label, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.label}
      </Field.Label>
    );
  },
);

NumberInputLabel.displayName = "NumberInputLabel";

export const NumberInputControl = forwardRef<HTMLInputElement, NumberInputControlProps>(
  function NumberInputControl(
    {
      className,
      motion,
      placeholder,
      onBlur,
      onKeyDown,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const part = useNumberInputControlMotion({
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    const setRef = (node: HTMLInputElement | null) => {
      field.setInputRef(node);
      part.setRef(node);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || field.disabled || field.readOnly) return;
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      field.nudge(event.key === "ArrowUp" ? 1 : -1);
    };

    return (
      <input
        ref={setRef}
        className={numberInputControlClass({
          size: field.size,
          slotClass: slotClassNames.control,
          className,
        })}
        {...rest}
        {...part.pointerHandlers}
        id={field.inputId}
        name={field.name}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        placeholder={placeholder ?? field.placeholder}
        value={field.text}
        disabled={field.disabled}
        readOnly={field.readOnly}
        required={field.required}
        aria-required={field.required || undefined}
        aria-invalid={ariaInvalidValue(field.isInvalid)}
        aria-valuenow={field.value ?? undefined}
        aria-valuemin={field.min}
        aria-valuemax={field.max}
        aria-describedby={field.describedBy}
        data-invalid={dataInvalidValue(field.isInvalid)}
        data-disabled={dataFlag(field.disabled)}
        data-readonly={dataFlag(field.readOnly)}
        data-required={dataFlag(field.required)}
        onChange={(event) => field.commitInput(event.target.value)}
        onBlur={(event) => {
          onBlur?.(event);
          field.commitBlur();
        }}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

NumberInputControl.displayName = "NumberInputControl";

export const NumberInputDecrement = forwardRef<HTMLButtonElement, NumberInputStepperProps>(
  function NumberInputDecrement(
    {
      className,
      motion,
      onClick,
      onMouseDown,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const blocked = !field.canDecrement;
    const part = useNumberInputDecrementMotion({
      motion,
      forwardedRef: ref,
      blocked,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      field.nudge(-1);
    };

    const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(event);
      if (!event.defaultPrevented) event.preventDefault();
    };

    return (
      <button
        ref={part.setRef}
        className={numberInputStepperClass({
          size: field.size,
          side: "decrement",
          disabled: blocked,
          slotClass: slotClassNames.decrement,
          className,
        })}
        {...rest}
        {...part.pointerHandlers}
        type="button"
        tabIndex={-1}
        aria-label={NUMBER_INPUT_DECREASE_LABEL}
        disabled={blocked}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <span className={numberInputIconClass(field.size)}>
          <KitRemove />
        </span>
      </button>
    );
  },
);

NumberInputDecrement.displayName = "NumberInputDecrement";

export const NumberInputIncrement = forwardRef<HTMLButtonElement, NumberInputStepperProps>(
  function NumberInputIncrement(
    {
      className,
      motion,
      onClick,
      onMouseDown,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const blocked = !field.canIncrement;
    const part = useNumberInputIncrementMotion({
      motion,
      forwardedRef: ref,
      blocked,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      field.nudge(1);
    };

    const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(event);
      if (!event.defaultPrevented) event.preventDefault();
    };

    return (
      <button
        ref={part.setRef}
        className={numberInputStepperClass({
          size: field.size,
          side: "increment",
          disabled: blocked,
          slotClass: slotClassNames.increment,
          className,
        })}
        {...rest}
        {...part.pointerHandlers}
        type="button"
        tabIndex={-1}
        aria-label={NUMBER_INPUT_INCREASE_LABEL}
        disabled={blocked}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <span className={numberInputIconClass(field.size)}>
          <KitAdd />
        </span>
      </button>
    );
  },
);

NumberInputIncrement.displayName = "NumberInputIncrement";

export const NumberInputHint = forwardRef<HTMLElement, NumberInputHintProps>(
  function NumberInputHint(
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
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const part = useNumberInputChromeSlot("hint", {
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
        status={field.status}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children ?? field.hint}
      </Field.Hint>
    );
  },
);

NumberInputHint.displayName = "NumberInputHint";

export const NumberInputError = forwardRef<HTMLElement, NumberInputErrorProps>(
  function NumberInputError(
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
    const field = useNumberInputContext();
    const slotClassNames = useNumberInputClassNames();
    const part = useNumberInputChromeSlot("error", {
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
        {children ?? field.error}
      </Field.Error>
    );
  },
);

NumberInputError.displayName = "NumberInputError";

export function NumberInputSimpleBody() {
  const field = useNumberInputContext();
  return (
    <>
      {field.label != null ? <NumberInputLabel /> : null}
      <NumberInputShell>
        <NumberInputDecrement />
        <NumberInputControl />
        <NumberInputIncrement />
      </NumberInputShell>
      {field.hint != null ? <NumberInputHint /> : null}
      {field.error != null ? <NumberInputError /> : null}
    </>
  );
}
