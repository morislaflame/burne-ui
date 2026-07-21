import { forwardRef, type LabelHTMLAttributes, type Ref } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useOptionalFieldLabelContext } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import { checkboxVariantToIndicator, compoundContentHasExternalLabel, resolveCheckboxIndicatorClassNames } from "./checkboxAPI";
import { useCheckboxControlTrackAnimation } from "./checkboxAnimations";
import { useCheckboxFieldContext, useCheckboxClassNames } from "./checkboxContext";
import { CHECKBOX_CONTENT_COMPOUND_CLASS, CHECKBOX_CONTENT_PASS_THROUGH_CLASS, CHECKBOX_CONTENT_POINTER_CLASS, CHECKBOX_CONTROL_CLASS, CHECKBOX_CONTROL_TRACK_CLASS, CHECKBOX_ERROR_DISABLED_CLASS, CHECKBOX_HINT_DISABLED_CLASS, CHECKBOX_INPUT_TRACK_OVERLAY_CLASS, CHECKBOX_INPUT_VISUALLY_HIDDEN_CLASS, CHECKBOX_LABEL_CLASS, CHECKBOX_LABEL_COMPOUND_SECONDARY_CLASS, CHECKBOX_LABEL_MOTION_CLASS, CHECKBOX_LABEL_TEXT_DANGER_CLASS, CHECKBOX_LABEL_TEXT_DISABLED_CLASS, CHECKBOX_REQUIRED_MARK_CLASS, CHECKBOX_SIMPLE_LABEL_TEXT_CLASS, CHECKBOX_SIMPLE_LABEL_WRAP_CLASS, CHECKBOX_SIZE_LAYOUT, checkboxControlCellClass, checkboxErrorRow, checkboxLabelCellClass, checkboxSecondaryCellClass } from "./checkboxStyles";
import type {
  CheckboxContentProps,
  CheckboxControlProps,
  CheckboxErrorProps,
  CheckboxHintProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxSize,
} from "./checkboxTypes";

import { cn } from "@/utils/cn";

export const CheckboxControl = forwardRef<HTMLSpanElement, CheckboxControlProps>(
  function CheckboxControl({ className, children, ...rest }, ref) {
    const ctx = useCheckboxFieldContext();
    const slotClassNames = useCheckboxClassNames();
    const trackRef = useCheckboxControlTrackAnimation();

    return (
      <span
        ref={ref}
        className={cn(
          CHECKBOX_CONTROL_CLASS,
          checkboxControlCellClass(),
          slotClassNames.control,
          className,
        )}
        {...rest}
      >
        <span
          ref={trackRef}
          className={cn(
            CHECKBOX_CONTROL_TRACK_CLASS,
            slotClassNames.controlTrack,
          )}
        >
          <input
            ref={ctx.inputProps.inputRef}
            id={ctx.inputId}
            type="checkbox"
            className={
              ctx.isCompound
                ? cn(
                    CHECKBOX_INPUT_TRACK_OVERLAY_CLASS,
                    slotClassNames.input,
                  )
                : cn(
                    CHECKBOX_INPUT_VISUALLY_HIDDEN_CLASS,
                    slotClassNames.input,
                  )
            }
            disabled={ctx.isDisabled}
            name={ctx.inputProps.name}
            value={ctx.inputProps.value}
            required={ctx.inputProps.required}
            form={ctx.inputProps.form}
            autoFocus={ctx.inputProps.autoFocus}
            tabIndex={ctx.inputProps.tabIndex}
            readOnly={ctx.inputProps.readOnly}
            onBlur={ctx.inputProps.onBlur}
            onFocus={ctx.inputProps.onFocus}
            aria-invalid={ctx.inputProps.ariaInvalid}
            aria-describedby={joinFieldDescribedBy(
              ctx.hintConnected ? ctx.hintId : undefined,
              ctx.errorConnected ? ctx.errorId : undefined,
            )}
            aria-labelledby={ctx.labelConnected ? ctx.labelId : undefined}
            aria-label={!ctx.labelConnected ? ctx.accessibleName : undefined}
            {...(ctx.isControlled
              ? { checked: ctx.mergedChecked, onChange: ctx.onChange }
              : {
                  defaultChecked: ctx.inputProps.defaultChecked,
                  onChange: ctx.onChange,
                })}
          />
          {children ?? <CheckboxIndicator />}
        </span>
      </span>
    );
  },
);

CheckboxControl.displayName = "CheckboxControl";

export function CheckboxIndicator({
  children,
  className,
  classNames: classNamesProp,
  size: sizeProp,
  ...rest
}: CheckboxIndicatorProps) {
  const ctx = useCheckboxFieldContext();
  const slotClassNames = useCheckboxClassNames();

  return (
    <SelectionIndicator
      variant={checkboxVariantToIndicator(ctx.variant)}
      size={sizeProp ?? ctx.size}
      selected={ctx.mergedChecked}
      icon={ctx.icon ?? undefined}
      check
      classNames={resolveCheckboxIndicatorClassNames({
        slotClassNames,
        classNames: classNamesProp,
        className,
      })}
      {...rest}
    >
      {children}
    </SelectionIndicator>
  );
}

CheckboxIndicator.displayName = "CheckboxIndicator";

export const CheckboxContent = forwardRef<HTMLDivElement, CheckboxContentProps>(
  function CheckboxContent({ className, children, ...rest }, ref) {
    const ctx = useCheckboxFieldContext();
    const slotClassNames = useCheckboxClassNames();
    const contentClass = cn(
      CHECKBOX_CONTENT_PASS_THROUGH_CLASS,
      ctx.isCompound && CHECKBOX_CONTENT_COMPOUND_CLASS,
      slotClassNames.content,
      className,
    );

    const useNativeLabel =
      ctx.isCompound && !compoundContentHasExternalLabel(children);

    if (useNativeLabel) {
      return (
        <label
          ref={ref as Ref<HTMLLabelElement>}
          htmlFor={ctx.inputId}
          id={ctx.labelId}
          className={cn(
            contentClass,
            !ctx.isDisabled && CHECKBOX_CONTENT_POINTER_CLASS,
          )}
          {...(rest as LabelHTMLAttributes<HTMLLabelElement>)}
        >
          {children}
        </label>
      );
    }

    return (
      <div ref={ref} className={contentClass} {...rest}>
        {children}
      </div>
    );
  },
);

CheckboxContent.displayName = "CheckboxContent";

export function CheckboxLabel({
  children,
  className,
  required: requiredProp,
  id: idProp,
  ...rest
}: CheckboxLabelProps) {
  const field = useCheckboxFieldContext();
  const slotClassNames = useCheckboxClassNames();
  const labelCtx = useOptionalFieldLabelContext();
  const required = requiredProp ?? labelCtx?.required ?? false;
  const sz = CHECKBOX_SIZE_LAYOUT[field.size];

  return (
    <span
      id={idProp}
      ref={(node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      }}
      className={cn(
        CHECKBOX_LABEL_CLASS,
        field.isCompound && checkboxLabelCellClass(),
        field.isCompound &&
          (field.hasCompoundHint || field.hasCompoundError) &&
          CHECKBOX_LABEL_COMPOUND_SECONDARY_CLASS,
        field.isCompound && field.useInlineCompoundMotion && CHECKBOX_LABEL_MOTION_CLASS,
        slotClassNames.label,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={cn(
          field.isDisabled && CHECKBOX_LABEL_TEXT_DISABLED_CLASS,
          !field.isDisabled && field.status === "danger" && CHECKBOX_LABEL_TEXT_DANGER_CLASS,
          slotClassNames.labelText,
        )}
      >
        {children}
      </Text>
      {required ? (
        <span
          className={cn(
            CHECKBOX_REQUIRED_MARK_CLASS,
            slotClassNames.requiredMark,
          )}
          aria-hidden
        >
          *
        </span>
      ) : null}
    </span>
  );
}

CheckboxLabel.displayName = "CheckboxLabel";

export function CheckboxHint({ children, className, variant, ...rest }: CheckboxHintProps) {
  const ctx = useCheckboxFieldContext();
  const slotClassNames = useCheckboxClassNames();
  return (
    <FieldHint
      as="span"
      id={ctx.hintId}
      variant={variant ?? CHECKBOX_SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && checkboxSecondaryCellClass(2),
        ctx.isDisabled && CHECKBOX_HINT_DISABLED_CLASS,
        slotClassNames.hint,
        className,
      )}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

CheckboxHint.displayName = "CheckboxHint";

export function CheckboxError({ children, className, ...rest }: CheckboxErrorProps) {
  const ctx = useCheckboxFieldContext();
  const slotClassNames = useCheckboxClassNames();
  return (
    <FieldError
      as="span"
      id={ctx.errorId}
      variant={CHECKBOX_SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && checkboxSecondaryCellClass(checkboxErrorRow(ctx.hasCompoundHint)),
        ctx.isDisabled && CHECKBOX_ERROR_DISABLED_CLASS,
        slotClassNames.error,
        className,
      )}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

CheckboxError.displayName = "CheckboxError";

export function CheckboxSimpleBody({
  label,
  hint,
  error,
  hasHint,
  hasError,
  secondaryLines,
  textColRef,
  size,
  isDisabled,
  status,
  hintId,
  errorId,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  hasHint: boolean;
  hasError: boolean;
  secondaryLines: number;
  textColRef: React.RefObject<HTMLElement | null>;
  size: CheckboxSize;
  isDisabled: boolean;
  status: boolean;
  hintId: string;
  errorId: string;
}) {
  const slotClassNames = useCheckboxClassNames();
  const sz = CHECKBOX_SIZE_LAYOUT[size];

  return (
    <>
      <CheckboxControl />
      <span
        ref={textColRef}
        className={cn(
          checkboxLabelCellClass(),
          !secondaryLines && CHECKBOX_SIMPLE_LABEL_WRAP_CLASS,
          slotClassNames.simpleLabelWrap,
          slotClassNames.label,
        )}
      >
        <Text
          as="span"
          variant={sz.title}
          inheritColor
          className={cn(
            CHECKBOX_SIMPLE_LABEL_TEXT_CLASS,
            isDisabled && CHECKBOX_LABEL_TEXT_DISABLED_CLASS,
            !isDisabled && status && CHECKBOX_LABEL_TEXT_DANGER_CLASS,
            slotClassNames.simpleLabelText,
            slotClassNames.labelText,
          )}
        >
          {label}
        </Text>
      </span>
      {hasHint ? (
        <FieldHint
          as="span"
          id={hintId}
          variant={sz.desc as "small"}
          className={cn(
            checkboxSecondaryCellClass(2),
            isDisabled && CHECKBOX_HINT_DISABLED_CLASS,
            slotClassNames.hint,
          )}
        >
          {hint}
        </FieldHint>
      ) : null}
      {hasError ? (
        <FieldError
          as="span"
          id={errorId}
          variant={sz.desc as "small"}
          className={cn(
            checkboxSecondaryCellClass(checkboxErrorRow(hasHint)),
            isDisabled && CHECKBOX_ERROR_DISABLED_CLASS,
            slotClassNames.error,
          )}
        >
          {error}
        </FieldError>
      ) : null}
    </>
  );
}
