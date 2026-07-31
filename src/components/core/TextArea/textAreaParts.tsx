import type { PointerEventHandler } from "react";
import { forwardRef, useCallback, useId, useRef } from "react";

import { Field } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import type { LabelProps } from "@/components/core/Label";

import "@/components/core/utils/glossInteractive.css";

import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { textAreaResizeHandleAriaLabel } from "./textAreaA11y";

import { useTextAreaShellMotion } from "./textAreaAnimations";
import { useOptionalTextAreaFieldContext, useTextAreaClassNames, useTextAreaFieldContext } from "./textAreaContext";
import { TEXTAREA_RESIZE_GRIP_LINE_PRIMARY_CLASS, TEXTAREA_RESIZE_GRIP_LINE_SECONDARY_CLASS, TEXTAREA_RESIZE_GRIP_WRAP_CLASS, textareaControlClassNames, textareaResizeHandleClass, textareaShellClass, textareaShellSurfaceClass } from "./textAreaStyles";
import type {
  TextAreaErrorProps,
  TextAreaHintProps,
  TextAreaControlProps,
  TextAreaSimpleBodyProps,
} from "./textAreaTypes";
import { useTextAreaResize } from "./useTextAreaResize";

import { cn } from "@/utils/cn";

function TextAreaResizeGrip() {
  return (
    <span aria-hidden className={TEXTAREA_RESIZE_GRIP_WRAP_CLASS}>
      <span className={TEXTAREA_RESIZE_GRIP_LINE_PRIMARY_CLASS} />
      <span className={TEXTAREA_RESIZE_GRIP_LINE_SECONDARY_CLASS} />
    </span>
  );
}

function TextAreaResizeHandle({
  disabled,
  className,
  onPointerDown,
  onKeyDown,
}: {
  disabled?: boolean;
  className?: string;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const resizeLabel = textAreaResizeHandleAriaLabel(useBurneLabel("resizeHeight"));
  return (
    <button
      type="button"
      data-textarea-resize-handle
      aria-label={resizeLabel}
      disabled={disabled}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={textareaResizeHandleClass({ disabled, slotClass: className })}
    >
      <TextAreaResizeGrip />
    </button>
  );
}

export const TextAreaControl = forwardRef<HTMLTextAreaElement, TextAreaControlProps>(
  function TextAreaControl(
    {
      variant = "default",
      status: statusProp,
      size: sizeProp,
      rows = 1,
      resizable = true,
      placeholder,
      id: idProp,
      disabled,
      readOnly,
      className,
      onPointerDown,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalTextAreaFieldContext();
    const slotClassNames = useTextAreaClassNames();
    const genId = useId();
    const id = idProp ?? fieldCtx?.textareaId ?? genId;
    const status = statusProp ?? fieldCtx?.status ?? "default";
    const size = sizeProp ?? fieldCtx?.size ?? "base";
    const required = fieldCtx?.required ?? false;
    const hintConnected = fieldCtx?.hintConnected ?? false;
    const errorConnected = fieldCtx?.errorConnected ?? false;
    const hintId = fieldCtx?.hintId;
    const errorId = fieldCtx?.errorId;
    const ariaDescribedBy =
      ariaDescribedByProp ??
      joinFieldDescribedBy(
        hintConnected ? hintId : undefined,
        errorConnected ? errorId : undefined,
      );

    const shellRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const setTextareaRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const blocked = Boolean(disabled || readOnly);
    const shellSurface = textareaShellSurfaceClass({ variant, status });

    const shellMotion = useTextAreaShellMotion({
      shellRef,
      blocked,
      variant,
      resizable,
      onPointerDown,
    });

    const { onResizePointerDown, onResizeKeyDown } = useTextAreaResize(
      shellRef,
      resizable,
      blocked,
      size,
    );

    return (
      <div
        ref={shellMotion.setShellRef}
        data-slot="textarea-shell"
        onPointerDown={shellMotion.shellPointerDown}
        onPointerEnter={shellMotion.shellPointerEnter}
        onPointerLeave={shellMotion.shellPointerLeave}
        onFocusCapture={shellMotion.shellFocusCapture}
        onBlurCapture={shellMotion.shellBlurCapture}
        className={textareaShellClass({
          variant,
          status,
          blocked,
          size,
          shellSurface,
          glossShellHoverMotionClass: shellMotion.glossShellHoverMotionClass,
          standardShellHoverMotionClass: shellMotion.standardShellHoverMotionClass,
          slotClass: slotClassNames.shell,
          className,
        })}
      >
        <textarea
          ref={setTextareaRef}
          id={id}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-required={required || undefined}
          aria-invalid={status === "danger" ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={textareaControlClassNames({
            size,
            resizable,
            slotClass: slotClassNames.control,
          })}
          {...rest}
        />
        {resizable ? (
          <TextAreaResizeHandle
            disabled={blocked}
            className={slotClassNames.resizeHandle}
            onPointerDown={onResizePointerDown}
            onKeyDown={onResizeKeyDown}
          />
        ) : null}
      </div>
    );
  },
);

TextAreaControl.displayName = "TextAreaControl";

export function TextAreaLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useTextAreaClassNames();

  return (
    <Field.Label
      className={className}
      classNames={{
        ...classNames,
        root: cn(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

TextAreaLabel.displayName = "TextAreaLabel";

export function TextAreaHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: TextAreaHintProps) {
  const field = useTextAreaFieldContext();
  const slotClassNames = useTextAreaClassNames();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <Field.Hint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </Field.Hint>
  );
}

TextAreaHint.displayName = "TextAreaHint";

export function TextAreaError({
  children,
  className,
  id: idProp,
  ...rest
}: TextAreaErrorProps) {
  const field = useTextAreaFieldContext();
  const slotClassNames = useTextAreaClassNames();

  return (
    <Field.Error
      id={idProp ?? field.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </Field.Error>
  );
}

TextAreaError.displayName = "TextAreaError";

export function TextAreaSimpleBody({
  label,
  hint,
  error,
  textareaId,
  labelId,
  size,
  status,
  controlProps,
}: TextAreaSimpleBodyProps) {
  const slotClassNames = useTextAreaClassNames();

  return (
    <>
      {label != null ? (
        <Field.Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Field.Label>
      ) : null}
      <TextAreaControl id={textareaId} size={size} status={status} {...controlProps} />
      {hint != null ? <TextAreaHint>{hint}</TextAreaHint> : null}
      {error != null ? <TextAreaError>{error}</TextAreaError> : null}
    </>
  );
}
