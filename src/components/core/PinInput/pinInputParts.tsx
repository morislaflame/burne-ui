import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { Field } from "@/components/core/Field";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { ariaInvalidValue, fieldPaintStatus } from "@/components/core/utils/fieldInvalid";
import { cn } from "@/utils/cn";

import { pinInputCellLabel } from "./pinInputA11y";
import { pinInputChar, pinInputChars, pinInputKeyAction, pinInputSeparatorIndex } from "./pinInputAPI";
import {
  usePinInputChromeSlot,
  usePinInputControlMotion,
  usePinInputShellMotion,
} from "./pinInputAnimations";
import { usePinInputClassNames, usePinInputContext } from "./pinInputContext";
import { pinInputFieldClass, pinInputGroupClass, pinInputSeparatorClass } from "./pinInputStyles";
import type {
  PinInputErrorProps,
  PinInputControlProps,
  PinInputShellProps,
  PinInputHintProps,
  PinInputLabelProps,
} from "./pinInputTypes";

type PinFieldHost = {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  register: (index: number, node: HTMLInputElement | null) => void;
  move: (index: number) => void;
};

const PinFieldHostContext = createContext<PinFieldHost | null>(null);

function isPinInputControl(child: ReactNode): child is ReactElement<PinInputControlProps> {
  return isValidElement(child) && child.type === PinInputControl;
}

export const PinInputControl = forwardRef<HTMLInputElement, PinInputControlProps>(function PinInputControl(
  { index: indexProp = 0, className, ...rest },
  ref,
) {
  const field = usePinInputContext();
  const host = useContext(PinFieldHostContext);
  const slotClassNames = usePinInputClassNames();
  const motion = usePinInputControlMotion();
  const index = indexProp;
  const chars = pinInputChars(field.value, field.length);
  const value = chars[index] ?? "";
  const focused = host != null && index === host.focusedIndex;

  return (
    <input
      ref={mergeRefs(ref, motion.setRef, (node: HTMLInputElement | null) => {
        host?.register(index, node);
      })}
      {...rest}
      className={pinInputFieldClass({
        size: field.size,
        variant: field.variant,
        status: fieldPaintStatus(field.isInvalid),
        disabled: field.disabled,
        mask: field.mask,
        motionClass: motion.motionClass,
        slotClass: slotClassNames.control,
        className,
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
        if (host == null) return;
        if (index > field.value.length) {
          host.move(field.value.length);
          return;
        }
        host.setFocusedIndex(index);
      }}
      onChange={(event) => {
        if (host == null) return;
        const incoming = [...event.target.value]
          .map((char) => pinInputChar(char, field.type))
          .filter(Boolean);
        if (incoming.length === 0) return;
        if (incoming.length === 1) {
          host.move(field.write(index, incoming[0] ?? ""));
          return;
        }
        host.move(field.paste(index, incoming.join("")));
      }}
      onPaste={(event) => {
        if (host == null) return;
        event.preventDefault();
        host.move(field.paste(index, event.clipboardData.getData("text")));
      }}
      onKeyDown={(event) => {
        if (host == null) return;
        const action = pinInputKeyAction(event.key, index, field.length, field.value);
        if (action.type === "none") return;
        event.preventDefault();
        if (action.type === "move") host.move(action.index);
        if (action.type === "delete") host.move(field.remove(index));
      }}
      {...motion.pointerHandlers}
    />
  );
});

PinInputControl.displayName = "PinInput.Control";

function pinInputFieldCount(children: ReactNode): number {
  let count = 0;
  Children.forEach(children, (child) => {
    if (isPinInputControl(child)) count += 1;
  });
  return count;
}

export const PinInputShell = forwardRef<HTMLDivElement, PinInputShellProps>(function PinInputShell(
  {
    children,
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
  const part = usePinInputShellMotion({
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
  const fieldCount = pinInputFieldCount(children);

  const register = useCallback((index: number, node: HTMLInputElement | null) => {
    cells.current[index] = node;
  }, []);

  const move = useCallback((index: number) => {
    const next = Math.min(Math.max(0, index), field.length - 1);
    setFocusIndex(next);
    cells.current[next]?.focus();
  }, [field.length]);

  const host = useMemo<PinFieldHost>(
    () => ({
      focusedIndex: focusIndex,
      setFocusedIndex: setFocusIndex,
      register,
      move,
    }),
    [focusIndex, register, move],
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (fieldCount > 0 && fieldCount !== field.length) {
      console.warn(
        `PinInput: ${fieldCount} PinInput.Control children, length is ${field.length}. Use the same count.`,
      );
    }
  }, [fieldCount, field.length]);

  let nextIndex = 0;
  const customCells =
    fieldCount > 0
      ? Children.map(children, (child) => {
          if (!isPinInputControl(child)) return child;
          let index = child.props.index;
          if (index == null) {
            index = nextIndex;
            nextIndex += 1;
          } else {
            nextIndex = Math.max(nextIndex, index + 1);
          }
          const fieldNode = cloneElement(child, { index });
          if (index !== separatorAt) return fieldNode;
          return (
            <Fragment key={child.key ?? `pin-field-${index}`}>
              {fieldNode}
              <span
                aria-hidden
                className={pinInputSeparatorClass({ slotClass: slotClassNames.separator })}
              >
                {field.separator}
              </span>
            </Fragment>
          );
        })
      : null;

  return (
    <PinFieldHostContext.Provider value={host}>
      <div
        ref={part.setRef}
        role="group"
        aria-labelledby={field.labelled ? field.labelId : undefined}
        className={pinInputGroupClass({ slotClass: slotClassNames.shell, className })}
        {...rest}
        {...part.pointerHandlers}
      >
        {customCells ??
          Array.from({ length: field.length }, (_, index) => (
            <Fragment key={`cell-${index}`}>
              <PinInputControl index={index} />
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
    </PinFieldHostContext.Provider>
  );
});

PinInputShell.displayName = "PinInput.Shell";

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
      <PinInputShell />
      {field.hint != null ? <PinInputHint /> : null}
      {field.error != null ? <PinInputError /> : null}
    </>
  );
}

export function PinInputCompoundBody({ children }: { children?: ReactNode }) {
  return children;
}
