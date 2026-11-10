import { forwardRef } from "react";
 
import { Field } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useOptionalFieldLabelContext } from "@/components/core/Label";
import { Text } from "@/components/core/Text";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
 
import { radioInputAriaLabel } from "./radioA11y";
import { radioVariantToIndicator, resolveRadioIndicatorClassNames } from "./radioAPI";
import { resolveRadioIndicatorMotion, useRadioChromeSlot, useRadioControlTrackAnimation, useRadioLabelSlot } from "./radioAnimations";
import { useRadioClassNames, useRadioFieldContext, useRadioMotion, useOptionalRadioMotionScope } from "./radioContext";
import { RADIO_CONTENT_COMPOUND_CLASS, RADIO_CONTENT_PASS_THROUGH_CLASS, RADIO_CONTROL_TRACK_CLASS, RADIO_ERROR_DISABLED_CLASS, RADIO_HINT_DISABLED_CLASS, RADIO_INPUT_VISUALLY_HIDDEN_CLASS, RADIO_LABEL_CLASS, RADIO_LABEL_COMPOUND_SECONDARY_CLASS, RADIO_LABEL_MOTION_CLASS, RADIO_LABEL_TEXT_DANGER_CLASS, RADIO_LABEL_TEXT_DISABLED_CLASS, RADIO_REQUIRED_MARK_CLASS, RADIO_SIMPLE_LABEL_TEXT_CLASS, RADIO_SIMPLE_LABEL_WRAP_CLASS, RADIO_SIZE_LAYOUT, radioControlCellClass, radioControlClass, radioErrorRow, radioLabelCellClass, radioSecondaryCellClass } from "./radioStyles";
import type {
  RadioContentProps,
  RadioControlProps,
  RadioErrorProps,
  RadioHintProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioSize,
} from "./radioTypes";
import type { MotionController, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import { cn } from "@/utils/cn";
 
export const RadioControl = forwardRef<HTMLSpanElement, RadioControlProps>(
  function RadioControl({ className, children, motionController, motionState, motionPayload, playInitialState, ...rest }, ref) {
    const unnamedLabel = useBurneLabel("radioOption");
    const ctx = useRadioFieldContext();
    const slotClassNames = useRadioClassNames();
    const trackRef = useRadioControlTrackAnimation();
 
    return (
      <span
        ref={ref}
        className={cn(
          radioControlClass(ctx.size),
          radioControlCellClass(ctx.labelPosition),
          slotClassNames.control,
          className,
        )}
        {...rest}
      >
        {/* The kit contract publishes aria-invalid on the control. The native radio role mapping does not list it. */}
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- invalid radios publish aria-invalid */}
        <input
          id={ctx.inputId}
          type="radio"
          className={cn(
            RADIO_INPUT_VISUALLY_HIDDEN_CLASS,
            slotClassNames.input,
          )}
          checked={ctx.mergedChecked}
          disabled={ctx.isDisabled}
          name={ctx.inputName}
          value={ctx.inputProps.value}
          required={ctx.inputProps.required}
          aria-invalid={ctx.isInvalid ? true : undefined}
          data-invalid={ctx.isInvalid ? "" : undefined}
          form={ctx.inputProps.form}
          autoFocus={ctx.inputProps.autoFocus}
          tabIndex={ctx.inputProps.tabIndex}
          readOnly={ctx.inputProps.readOnly}
          data-readonly={ctx.inputProps.readOnly ? "" : undefined}
          onClick={(event) => {
            if (ctx.inputProps.readOnly) {
              event.preventDefault();
              return;
            }
            ctx.onActivate?.(event);
          }}
          ref={ctx.inputProps.inputRef}
          onBlur={ctx.inputProps.onBlur}
          onFocus={ctx.inputProps.onFocus}
          aria-describedby={joinFieldDescribedBy(
            ctx.hintConnected ? ctx.hintId : undefined,
            ctx.errorConnected ? ctx.errorId : undefined,
          )}
          aria-label={radioInputAriaLabel(ctx.inputProps.value, ctx.hasLabel, unnamedLabel)}
          onChange={ctx.onChange}
        />
        <span
          ref={trackRef}
          className={cn(
            RADIO_CONTROL_TRACK_CLASS,
            slotClassNames.controlTrack,
          )}
        >
          {children ?? <RadioIndicator motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState} />}
        </span>
      </span>
    );
  },
);
 
RadioControl.displayName = "RadioControl";
 
export const RadioIndicator = forwardRef<HTMLSpanElement, RadioIndicatorProps>(
  function RadioIndicator({
  children,
  icon,
  className,
  classNames: classNamesProp,
  size: sizeProp,
  motion: motionProp,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}, ref) {
  const ctx = useRadioFieldContext();
  const slotClassNames = useRadioClassNames();
  const rootMotion = useRadioMotion();
  const mapped = resolveRadioIndicatorMotion({
    rootMotion,
    indicatorMotion: motionProp,
  });
  const parentEvents = useOptionalRadioMotionScope()?.getEvents();
  const events = mapped?.events ?? parentEvents;
  const motion = events ? { ...mapped, events } : mapped;
 
  return (
    <SelectionIndicator
      size={sizeProp ?? ctx.size}
      variant={radioVariantToIndicator(ctx.variant)}
      selected={ctx.mergedChecked}
      dot
      icon={icon}
      classNames={resolveRadioIndicatorClassNames({
        slotClassNames,
        classNames: classNamesProp,
        className,
      })}
      motion={motion}
      motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState}
      {...rest}
      ref={ref}
    >
      {children}
    </SelectionIndicator>
  );
});
 
RadioIndicator.displayName = "RadioIndicator";
 
export const RadioContent = forwardRef<HTMLDivElement, RadioContentProps>(
  function RadioContent({ className, children, ...rest }, ref) {
    const ctx = useRadioFieldContext();
    const slotClassNames = useRadioClassNames();
 
    return (
      <div
        ref={ref}
        className={cn(
          RADIO_CONTENT_PASS_THROUGH_CLASS,
          ctx.isCompound && RADIO_CONTENT_COMPOUND_CLASS,
          slotClassNames.content,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
 
RadioContent.displayName = "RadioContent";
 
export const RadioLabel = forwardRef<HTMLSpanElement, RadioLabelProps>(function RadioLabel({
  children,
  className,
  required: requiredProp,
  motion,
  ...rest
}, ref) {
  const field = useRadioFieldContext();
  const slotClassNames = useRadioClassNames();
  const labelCtx = useOptionalFieldLabelContext();
  const required = requiredProp ?? labelCtx?.required ?? false;
  const sz = RADIO_SIZE_LAYOUT[field.size];
  const { setRef } = useRadioLabelSlot(motion);
 
  return (
    <span
      ref={mergeRefs(setRef, ref, (node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      })}
      className={cn(
        RADIO_LABEL_CLASS,
        field.isCompound && radioLabelCellClass(field.labelPosition),
        field.isCompound &&
          (field.hasCompoundHint || field.hasCompoundError) &&
          RADIO_LABEL_COMPOUND_SECONDARY_CLASS,
        field.isCompound && field.useInlineCompoundMotion && RADIO_LABEL_MOTION_CLASS,
        slotClassNames.label,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        textStyle={sz.title}
        inheritColor
        className={cn(
          field.isDisabled && RADIO_LABEL_TEXT_DISABLED_CLASS,
          !field.isDisabled && field.danger && RADIO_LABEL_TEXT_DANGER_CLASS,
          slotClassNames.labelText,
        )}
      >
        {children}
      </Text>
      {required ? (
        <span
          className={cn(
            RADIO_REQUIRED_MARK_CLASS,
            slotClassNames.requiredMark,
          )}
          aria-hidden
        >
          *
        </span>
      ) : null}
    </span>
  );
});
 
RadioLabel.displayName = "RadioLabel";
 
export const RadioHint = forwardRef<HTMLElement, RadioHintProps>(function RadioHint({
  children,
  className,
  textStyle,
  motion,
  ...rest
}, ref) {
  const ctx = useRadioFieldContext();
  const slotClassNames = useRadioClassNames();
  const { setRef } = useRadioChromeSlot("hint", motion);
 
  return (
    <Field.Hint
      ref={mergeRefs(setRef, ref)}
      as="span"
      id={ctx.hintId}
      textStyle={textStyle ?? RADIO_SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && radioSecondaryCellClass(2, ctx.labelPosition),
        ctx.isDisabled && RADIO_HINT_DISABLED_CLASS,
        slotClassNames.hint,
        className,
      )}
      {...rest}
    >
      {children}
    </Field.Hint>
  );
});
 
RadioHint.displayName = "RadioHint";
 
export const RadioError = forwardRef<HTMLElement, RadioErrorProps>(function RadioError({
  children,
  className,
  motion,
  ...rest
}, ref) {
  const ctx = useRadioFieldContext();
  const slotClassNames = useRadioClassNames();
  const { setRef } = useRadioChromeSlot("error", motion);
 
  return (
    <Field.Error
      ref={mergeRefs(setRef, ref)}
      as="span"
      id={ctx.errorId}
      textStyle={RADIO_SIZE_LAYOUT[ctx.size].desc}
      className={cn(
        ctx.isCompound && radioSecondaryCellClass(radioErrorRow(ctx.hasCompoundHint), ctx.labelPosition),
        ctx.isDisabled && RADIO_ERROR_DISABLED_CLASS,
        slotClassNames.error,
        className,
      )}
      {...rest}
    >
      {children}
    </Field.Error>
  );
});
 
RadioError.displayName = "RadioError";
 
export function RadioSimpleBody({
  label,
  hint,
  error,
  hasHint,
  hasError,
  secondaryLines,
  textColRef,
  size,
  isDisabled,
  danger,
  hintId,
  errorId,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
}: {
  label: React.ReactNode;
  hint: React.ReactNode;
  error: React.ReactNode;
  hasHint: boolean;
  hasError: boolean;
  secondaryLines: number;
  textColRef: React.RefObject<HTMLElement | null>;
  size: RadioSize;
  isDisabled: boolean;
  danger: boolean;
  hintId: string;
  errorId: string;
  motionController?: MotionController;
} & MotionStateHostProps) {
  const slotClassNames = useRadioClassNames();
  const { labelPosition } = useRadioFieldContext();
  const sz = RADIO_SIZE_LAYOUT[size];
  const { setRef: setLabelMotionRef } = useRadioLabelSlot();
  const { setRef: setHintMotionRef } = useRadioChromeSlot("hint");
  const { setRef: setErrorMotionRef } = useRadioChromeSlot("error");
 
  return (
    <>
      <RadioControl motionController={motionController}
                motionState={motionState}
                motionPayload={motionPayload}
                playInitialState={playInitialState} />
      <span
        ref={mergeRefs(textColRef, setLabelMotionRef)}
        className={cn(
          radioLabelCellClass(labelPosition),
          !secondaryLines && RADIO_SIMPLE_LABEL_WRAP_CLASS,
          slotClassNames.simpleLabelWrap,
          slotClassNames.label,
        )}
      >
        <Text
          as="span"
          textStyle={sz.title}
          inheritColor
          className={cn(
            RADIO_SIMPLE_LABEL_TEXT_CLASS,
            isDisabled && RADIO_LABEL_TEXT_DISABLED_CLASS,
            !isDisabled && danger && RADIO_LABEL_TEXT_DANGER_CLASS,
            slotClassNames.simpleLabelText,
            slotClassNames.labelText,
          )}
        >
          {label}
        </Text>
      </span>
      {hasHint ? (
        <Field.Hint
          ref={setHintMotionRef}
          as="span"
          id={hintId}
          textStyle={sz.desc}
          className={cn(
            radioSecondaryCellClass(2, labelPosition),
            isDisabled && RADIO_HINT_DISABLED_CLASS,
            slotClassNames.hint,
          )}
        >
          {hint}
        </Field.Hint>
      ) : null}
      {hasError ? (
        <Field.Error
          ref={setErrorMotionRef}
          as="span"
          id={errorId}
          textStyle={sz.desc}
          className={cn(
            radioSecondaryCellClass(radioErrorRow(hasHint), labelPosition),
            isDisabled && RADIO_ERROR_DISABLED_CLASS,
            slotClassNames.error,
          )}
        >
          {error}
        </Field.Error>
      ) : null}
    </>
  );
}
 