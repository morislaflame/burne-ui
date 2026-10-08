import { forwardRef, Fragment, useRef, useState, type ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { ariaInvalidValue } from "@/components/core/utils/fieldInvalid";
import { cn } from "@/utils/cn";

import { pinInputCellLabel } from "./pinInputA11y";
import { pinInputChar, pinInputChars, pinInputKeyAction, pinInputSeparatorIndex } from "./pinInputAPI";
import {
  usePinInputChromeSlot,
  usePinInputFieldMotion,
  usePinInputGroupMotion,
} from "./pinInputAnimations";
import { usePinInputClassNames, usePinInputContext } from "./pinInputContext";
import { pinInputFieldClass, pinInputGroupClass, pinInputSeparatorClass } from "./pinInputStyles";
import type {
  PinInputErrorProps,
  PinInputGroupProps,
  PinInputHintProps,
  PinInputLabelProps,
} from "./pinInputTypes";

function PinInputCell({
  index,
  focused,
  onFocusIndex,
  onMove,
  register,
}: {
  index: number;
  focused: boolean;
  onFocusIndex: (index: number) => void;
  onMove: (index: number) => void;
  register: (index: number, node: HTMLInputElement | null) => void;
}) {
  const field = usePinInputContext();
  const slotClassNames = usePinInputClassNames();
  const motion = usePinInputFieldMotion();
  const chars = pinInputChars(field.value, field.length);
  const value = chars[index] ?? "";

  return (
    <input
      ref={(node) => {
        motion.setRef(node);
        register(index, node);
      }}
      className={pinInputFieldClass({
        size: field.size,
        variant: field.variant,
        status: field.status,
        disabled: field.disabled,
        mask: field.mask,
        motionClass: motion.motionClass,
        slotClass: slotClassNames.field,
      })}
      value={value}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readOnly}
      required={field.required && index === 0}
      inputMode={field.type === "number" ? "numeric" : "text"}
      autoComplete={index === 0 ? "one-time-code" : "off"}
      type="text"
      tabIndex={focused ? 0 : -1}
      aria-label={pinInputCellLabel(index, field.length, field.type)}
      aria-invalid={ariaInvalidValue(field.isInvalid)}
      aria-describedby={field.describedBy}
      onFocus={() => {
        if (index > field.value.length) {
          onMove(field.value.length);
          return;
        }
        onFocusIndex(index);
      }}
      onChange={(event) => {
        const incoming = [...event.target.value]
          .map((char) => pinInputChar(char, field.type))
          .filter(Boolean);
        if (incoming.length === 0) return;
        if (incoming.length === 1) {
          onMove(field.write(index, incoming[0] ?? ""));
          return;
        }
        onMove(field.paste(index, incoming.join("")));
      }}
      onPaste={(event) => {
        event.preventDefault();
        onMove(field.paste(index, event.clipboardData.getData("text")));
      }}
      onKeyDown={(event) => {
        const action = pinInputKeyAction(event.key, index, field.length, field.value);
        if (action.type === "none") return;
        event.preventDefault();
        if (action.type === "move") onMove(action.index);
        if (action.type === "delete") onMove(field.remove(index));
      }}
      {...motion.pointerHandlers}
    />
  );
}

export const PinInputGroup = forwardRef<HTMLDivElement, PinInputGroupProps>(function PinInputGroup(
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
  const field = usePinInputContext();
  const slotClassNames = usePinInputClassNames();
  const part = usePinInputGroupMotion({
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const separatorAt = field.separator != null ? pinInputSeparatorIndex(field.length) : -1;

  const move = (index: number) => {
    const next = Math.min(Math.max(0, index), field.length - 1);
    setFocusIndex(next);
    cells.current[next]?.focus();
  };

  return (
    <div
      ref={part.setRef}
      role="group"
      aria-labelledby={field.labelled ? field.labelId : undefined}
      className={pinInputGroupClass({ slotClass: slotClassNames.group, className })}
      {...rest}
      {...part.pointerHandlers}
    >
      {Array.from({ length: field.length }, (_, index) => (
        <Fragment key={`cell-${index}`}>
          <PinInputCell
            index={index}
            focused={index === focusIndex}
            onFocusIndex={setFocusIndex}
            onMove={move}
            register={(cell, node) => {
              cells.current[cell] = node;
            }}
          />
          {index === separatorAt ? (
            <span
              aria-hidden
              className={pinInputSeparatorClass({ slotClass: slotClassNames.separator })}
            >
              {field.separator}
            </span>
          ) : null}
        </Fragment>
      ))}
      {field.name ? <input type="hidden" name={field.name} value={field.value} /> : null}
    </div>
  );
});

PinInputGroup.displayName = "PinInputGroup";

export const PinInputLabel = forwardRef<HTMLElement, PinInputLabelProps>(function PinInputLabel(
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
  const field = usePinInputContext();
  const slotClassNames = usePinInputClassNames();
  const part = usePinInputChromeSlot("label", {
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
});

PinInputLabel.displayName = "PinInputLabel";

export const PinInputHint = forwardRef<HTMLElement, PinInputHintProps>(function PinInputHint(
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
  const field = usePinInputContext();
  const slotClassNames = usePinInputClassNames();
  const part = usePinInputChromeSlot("hint", {
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
});

PinInputHint.displayName = "PinInputHint";

export const PinInputError = forwardRef<HTMLElement, PinInputErrorProps>(function PinInputError(
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
  const field = usePinInputContext();
  const slotClassNames = usePinInputClassNames();
  const part = usePinInputChromeSlot("error", {
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
});

PinInputError.displayName = "PinInputError";

export function PinInputSimpleBody() {
  const field = usePinInputContext();
  return (
    <>
      {field.label != null ? <PinInputLabel /> : null}
      <PinInputGroup />
      {field.hint != null ? <PinInputHint /> : null}
      {field.error != null ? <PinInputError /> : null}
    </>
  );
}

export function PinInputCompoundBody({ children }: { children?: ReactNode }) {
  return children;
}
